import { useState } from 'react';
import type { ProductTableRow } from '../../db/products.server';
import type { TagTableRow } from '../../db/tags.server';
import type { TemplateSelectRow } from '../../db/templates.server';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import { BatchSidebar } from './batch-sidebar';
import { DashboardHeader, type ProductFilterTab } from './dashboard-header';
import { TagsTable } from './product-table';
import { ProductsTable } from './products-table';

type SidebarData = Pick<DashboardOutletContext, 'categories' | 'zones'>;

type ProductsProps = SidebarData & {
  variant: 'products';
  products: ProductTableRow[];
  templates: TemplateSelectRow[];
  productStats: { total: number; pending: number; failed: number };
};

type TagsProps = SidebarData & {
  variant: 'tags';
  tags: TagTableRow[];
  tagStats: {
    online: number;
    lowBattery: number;
    offline: number;
    total: number;
  };
  productOptions: Array<{ id: string; name: string }>;
};

export type TagControlScreenProps = ProductsProps | TagsProps;

export function TagControlScreen(props: TagControlScreenProps) {
  const { variant, categories, zones } = props;
  const [createOpen, setCreateOpen] = useState(false);
  const [headerFilter, setHeaderFilter] = useState<ProductFilterTab>('all');

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto px-3 pb-2 pt-3 sm:px-6 lg:overflow-hidden lg:px-8 lg:pb-3 lg:pt-4">
      <div className="shrink-0">
        {variant === 'products' ? (
          <DashboardHeader
            variant="products"
            productStats={props.productStats}
            onAddProduct={() => setCreateOpen(true)}
            activeFilter={headerFilter}
            onFilterChange={setHeaderFilter}
          />
        ) : (
          <DashboardHeader variant="tags" tagStats={props.tagStats} />
        )}
      </div>
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col rounded-xl border border-surface-muted bg-white p-2 shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)] lg:mt-3 lg:p-3">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-3">
          <BatchSidebar variant={variant} categories={categories} zones={zones} />
          {variant === 'products' ? (
            <ProductsTable
              initialProducts={props.products}
              templates={props.templates}
              categories={categories}
              createOpen={createOpen}
              onCreateOpenChange={setCreateOpen}
              headerFilter={headerFilter}
            />
          ) : (
            <TagsTable
              initialTags={props.tags}
              productOptions={props.productOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}
