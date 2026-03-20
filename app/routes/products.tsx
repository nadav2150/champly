import type { Route } from './+types/products';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Products — Catalog & Pricing' },
    {
      name: 'description',
      content:
        'Manage your product catalog, categories, and pricing. Sync prices to electronic shelf labels.',
    },
  ];
}

export default function ProductsPage() {
  return <TagControlScreen variant="products" />;
}
