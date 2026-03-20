import type { Route } from './+types/products';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { isSupportedLanguage } from '../i18n/config';

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
  return <TagControlScreen variant="products" />;
}
