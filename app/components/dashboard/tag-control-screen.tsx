import { BatchSidebar } from './batch-sidebar';
import { DashboardHeader } from './dashboard-header';
import { TagsTable } from './product-table';
import { ProductsTable } from './products-table';

export type TagControlScreenProps = {
  variant?: 'tags' | 'products';
};

export function TagControlScreen({ variant = 'tags' }: TagControlScreenProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4 pb-3 pt-4 sm:px-6 lg:px-8">
      <div className="shrink-0">
        <DashboardHeader variant={variant} />
      </div>
      <div className="mt-3 flex min-h-0 w-full flex-1 flex-col rounded-xl border border-surface-muted bg-white p-3 shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)]">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-3 lg:flex-row lg:items-stretch">
          <BatchSidebar variant={variant} />
          {variant === 'products' ? <ProductsTable /> : <TagsTable />}
        </div>
      </div>
    </div>
  );
}
