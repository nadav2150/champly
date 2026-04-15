import type { Route } from './+types/products';
import { data, useLoaderData, useOutletContext } from 'react-router';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { createCategory } from '../db/categories.server';
import { getDb, withRetry } from '../db/client.server';
import {
  bulkSetProductsPending,
  bulkUpdateProducts,
  createProduct,
  deleteProduct,
  listProductsForTable,
  updateProductFields,
} from '../db/products.server';
import { assignTagToProduct, listUnlinkedTags, unassignTagFromProduct } from '../db/tags.server';
import { listTemplatesForSelect } from '../db/templates.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);

  let products: Awaited<ReturnType<typeof listProductsForTable>> = [];
  let templates: Awaited<ReturnType<typeof listTemplatesForSelect>> = [];
  let unlinkedTags: Awaited<ReturnType<typeof listUnlinkedTags>> = [];

  try {
    [products, templates, unlinkedTags] = await Promise.all([
      withRetry(() => listProductsForTable(db, user.id)),
      withRetry(() => listTemplatesForSelect(db)),
      withRetry(() => listUnlinkedTags(db)),
    ]);
  } catch (err) {
    console.error('Failed to load products data:', err);
  }

  return data({ products, templates, unlinkedTags }, { headers });
}

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const db = getDb(context);

  if (intent === 'update-product') {
    const templateRaw = formData.get('templateId');
    const categoryRaw = formData.get('categoryId');
    const templateDataRaw = formData.get('templateData');
    const templateData =
      templateDataRaw && String(templateDataRaw).length > 0
        ? String(templateDataRaw)
        : null;
    const updated = await updateProductFields(db, user.id, {
      id: String(formData.get('id') ?? ''),
      name: String(formData.get('name') ?? ''),
      priceCents: Number.parseInt(String(formData.get('priceCents') ?? '0'), 10),
      unit:
        formData.get('unit') === 'per_unit'
          ? 'per_unit'
          : 'per_kg',
      templateId:
        templateRaw && String(templateRaw).length > 0
          ? String(templateRaw)
          : null,
      categoryId:
        categoryRaw && String(categoryRaw).length > 0
          ? String(categoryRaw)
          : null,
      templateData,
    });
    if (!updated) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
    }

    const imageBase64 = String(formData.get('imageBase64') ?? '');
    console.log(`[update-product] imageBase64 length: ${imageBase64.length}`);
    if (imageBase64.length > 0) {
      const productId = String(formData.get('id') ?? '');
      const { getTagMacByProductId } = await import('../db/tags.server');
      const tagMac = await getTagMacByProductId(db, productId);
      console.log(`[update-product] productId=${productId}, tagMac=${tagMac}`);
      if (tagMac) {
        try {
          const { sendImage } = await import('../lib/mqtt-bridge.server');
          console.log(`[update-product] Sending image to bridge for tag ${tagMac}...`);
          const bridgeResult = await sendImage(env, tagMac, imageBase64);
          console.log(`[update-product] Bridge result:`, JSON.stringify(bridgeResult));
          return data({ ok: true as const, bridge: bridgeResult }, { headers });
        } catch (err) {
          console.error('[update-product] Failed to push image to tag:', err);
          return data({ ok: true as const, bridgeError: String(err) }, { headers });
        }
      } else {
        console.log('[update-product] No tag MAC found for product, skipping image push');
      }
    } else {
      console.log('[update-product] No imageBase64 in form data, skipping image push');
    }

    return data({ ok: true as const }, { headers });
  }

  if (intent === 'create-category') {
    const name = String(formData.get('name') ?? '').trim();
    const icon = String(formData.get('icon') ?? '').trim();
    if (!name) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const row = await createCategory(db, {
      userId: user.id,
      name,
      icon: icon || '📦',
    });
    return data({ ok: true as const, id: row.id }, { headers });
  }

  if (intent === 'create-product') {
    const name = String(formData.get('name') ?? '').trim();
    const priceCents = Number.parseInt(
      String(formData.get('priceCents') ?? '0'),
      10,
    );
    if (!name || Number.isNaN(priceCents) || priceCents < 0) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const categoryRaw = formData.get('categoryId');
    const categoryId =
      categoryRaw && String(categoryRaw).length > 0
        ? String(categoryRaw)
        : null;
    const storeRaw = formData.get('storeId');
    const storeId =
      storeRaw && String(storeRaw).length > 0 ? String(storeRaw) : null;
    const templateRaw = formData.get('templateId');
    const templateDataRaw = formData.get('templateData');
    const created = await createProduct(db, {
      userId: user.id,
      name,
      priceCents,
      unit:
        formData.get('unit') === 'per_unit' ? 'per_unit' : 'per_kg',
      categoryId,
      storeId,
      templateId:
        templateRaw && String(templateRaw).length > 0
          ? String(templateRaw)
          : null,
      templateData:
        templateDataRaw && String(templateDataRaw).length > 0
          ? String(templateDataRaw)
          : null,
    });
    if ('error' in created) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    return data({ ok: true as const }, { headers });
  }

  if (intent === 'delete-product') {
    const id = String(formData.get('id') ?? '').trim();
    if (!id) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const removed = await deleteProduct(db, user.id, id);
    if (!removed) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
    }
    return data({ ok: true as const }, { headers });
  }

  if (intent === 'assign-tag') {
    const tagInternalId = String(formData.get('tagInternalId') ?? '');
    const productId = String(formData.get('productId') ?? '');
    if (!tagInternalId || !productId) {
      return data({ ok: false as const, error: 'Tag and product required' }, { headers });
    }
    try {
      await assignTagToProduct(db, tagInternalId, productId);
      return data({ ok: true as const }, { headers });
    } catch (err) {
      return data(
        { ok: false as const, error: err instanceof Error ? err.message : 'Assign failed' },
        { headers },
      );
    }
  }

  if (intent === 'unassign-tag') {
    const productId = String(formData.get('productId') ?? '');
    if (!productId) {
      return data({ ok: false as const, error: 'Product required' }, { headers });
    }
    try {
      await unassignTagFromProduct(db, productId);
      return data({ ok: true as const }, { headers });
    } catch (err) {
      return data(
        { ok: false as const, error: err instanceof Error ? err.message : 'Unassign failed' },
        { headers },
      );
    }
  }

  if (intent === 'send-locate') {
    const mac = String(formData.get('mac') ?? '').trim();
    if (!mac) {
      return data({ ok: false as const, error: 'MAC required' }, { headers });
    }
    try {
      const { sendLedViaBle } = await import('../lib/mqtt-bridge.server');
      const result = await sendLedViaBle(env, mac, {
        color: 4, cycles: 20, light_on: 300, light_off: 300, brightness: 50,
      });
      return data({ ok: true as const, locate: result }, { headers });
    } catch (err) {
      return data({ ok: false as const, error: String(err) }, { headers });
    }
  }

  if (intent === 'bulk-price-update') {
    const raw = String(formData.get('ids') ?? '[]');
    let ids: string[] = [];
    try {
      ids = JSON.parse(raw) as string[];
    } catch {
      ids = [];
    }
    await bulkSetProductsPending(db, user.id, ids);
    return data({ ok: true as const }, { headers });
  }

  if (intent === 'bulk-edit-products') {
    const raw = String(formData.get('edits') ?? '[]');
    let edits: Array<{ id: string; name?: string; priceCents?: number }> = [];
    try {
      edits = JSON.parse(raw);
    } catch {
      edits = [];
    }
    if (edits.length === 0) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const updated = await bulkUpdateProducts(db, user.id, edits);
    return data({ ok: true as const, updated }, { headers });
  }

  if (intent === 'push-tag-image') {
    const productId = String(formData.get('productId') ?? '').trim();
    const imageBase64 = String(formData.get('imageBase64') ?? '');
    if (!productId || !imageBase64) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const { getTagMacByProductId } = await import('../db/tags.server');
    const tagMac = await getTagMacByProductId(db, productId);
    if (!tagMac) {
      return data({ ok: true as const, skipped: true }, { headers });
    }
    try {
      const { sendImage } = await import('../lib/mqtt-bridge.server');
      const bridgeResult = await sendImage(env, tagMac, imageBase64);
      return data({ ok: true as const, bridge: bridgeResult }, { headers });
    } catch (err) {
      console.error(`[push-tag-image] Failed for product ${productId}:`, err);
      return data({ ok: true as const, bridgeError: String(err) }, { headers });
    }
  }

  return data({ ok: false as const }, { headers });
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'מוצרים — קטלוג ומחירים' : 'Products — Catalog & Pricing' },
    {
      name: 'description',
      content: isHebrew
        ? 'ניהול קטלוג המוצרים, הקטגוריות והמחירים. סנכרון מחירים לתגיות מדף אלקטרוניות.'
        : 'Manage your product catalog, categories, and pricing. Sync prices to electronic shelf labels.',
    },
  ];
}

export default function ProductsPage() {
  const { products, templates, unlinkedTags } = useLoaderData<typeof loader>();
  const { categories, zones } = useOutletContext<DashboardOutletContext>();

  return (
    <TagControlScreen
      variant="products"
      categories={categories}
      zones={zones}
      products={products}
      templates={templates}
      unlinkedTags={unlinkedTags}
    />
  );
}
