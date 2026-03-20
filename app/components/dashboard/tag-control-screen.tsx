import { BatchSidebar } from './batch-sidebar';
import { DashboardHeader } from './dashboard-header';
import { TagsTable } from './product-table';
import { ProductsTable } from './products-table';

export type TagControlScreenProps = {
  variant?: 'tags' | 'products';
};

export function TagControlScreen({ variant = 'tags' }: TagControlScreenProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto px-3 pb-2 pt-3 sm:px-6 lg:overflow-hidden lg:px-8 lg:pb-3 lg:pt-4">
      <div className="shrink-0">
        <DashboardHeader variant={variant} />
      </div>
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col rounded-xl border border-surface-muted bg-white p-2 shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)] lg:mt-3 lg:p-3">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-3">
          <BatchSidebar variant={variant} />
          {variant === 'products' ? <ProductsTable /> : <TagsTable />}
        </div>
      </div>
    </div>
  );
}
