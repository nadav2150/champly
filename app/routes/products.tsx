import type { Route } from './+types/products';
import { data, useLoaderData, useOutletContext } from 'react-router';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { createCategory } from '../db/categories.server';
import { getDb } from '../db/client.server';
import {
  bulkSetProductsPending,
  createProduct,
  deleteProduct,
  listProductsForTable,
  updateProductFields,
} from '../db/products.server';
import { listTemplatesForSelect } from '../db/templates.server';
import { getProductHeaderStats } from '../db/stats.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);
  const [products, templates, productStats] = await Promise.all([
    listProductsForTable(db, user.id),
    listTemplatesForSelect(db),
    getProductHeaderStats(db, user.id),
  ]);
  return data({ products, templates, productStats }, { headers });
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
    });
    if (!updated) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
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
  const { products, templates, productStats } = useLoaderData<typeof loader>();
  const { categories, zones } = useOutletContext<DashboardOutletContext>();

  return (
    <TagControlScreen
      variant="products"
      categories={categories}
      zones={zones}
      products={products}
      templates={templates}
      productStats={productStats}
    />
  );
}
