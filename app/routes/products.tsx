import type { Route } from './+types/products';
import { useLoaderData, useOutletContext } from 'react-router';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { getDb } from '../db/client.server';
import {
  bulkSetProductsPending,
  listProductsForTable,
  updateProductFields,
} from '../db/products.server';
import { listTemplatesForSelect } from '../db/templates.server';
import { getProductHeaderStats } from '../db/stats.server';
import { isSupportedLanguage } from '../i18n/config';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  const [products, templates, productStats] = await Promise.all([
    listProductsForTable(db),
    listTemplatesForSelect(db),
    getProductHeaderStats(db),
  ]);
  return { products, templates, productStats };
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const db = getDb(context);

  if (intent === 'update-product') {
    const templateRaw = formData.get('templateId');
    await updateProductFields(db, {
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
    });
    return { ok: true as const };
  }

  if (intent === 'bulk-price-update') {
    const raw = String(formData.get('ids') ?? '[]');
    let ids: string[] = [];
    try {
      ids = JSON.parse(raw) as string[];
    } catch {
      ids = [];
    }
    await bulkSetProductsPending(db, ids);
    return { ok: true as const };
  }

  return { ok: false as const };
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
