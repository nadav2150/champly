import { useState } from 'react';
import type { ProductTableRow } from '../../db/products.server';
import type { TagTableRow } from '../../db/tags.server';
import type { TemplateSelectRow } from '../../db/templates.server';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import { DashboardHeader } from './dashboard-header';
import { TagsTable } from './product-table';
import { ProductsTable } from './products-table';

type SidebarData = Pick<DashboardOutletContext, 'categories' | 'zones'>;

type UnlinkedTag = {
  id: string;
  tagId: string;
  mac: string | null;
  tagModel: string | null;
  status: 'online' | 'offline';
};

type ProductsProps = SidebarData & {
  variant: 'products';
  products: ProductTableRow[];
  templates: TemplateSelectRow[];
  unlinkedTags?: UnlinkedTag[];
};

type GatewayInfo = {
  id: string;
  apId: string;
  alias: string | null;
  mac: string | null;
  status: 'online' | 'offline';
  lastSeen: string | null;
};

type BridgeHealth = {
  status: string;
  mqtt: 'connected' | 'disconnected';
  gateway: string;
  uptime: number;
} | null;

type TagsProps = SidebarData & {
  variant: 'tags';
  tags: TagTableRow[];
  tagStats: {
    online: number;
    lowBattery: number;
    offline: number;
    total: number;
  };
  gateways?: GatewayInfo[];
  bridgeHealth?: BridgeHealth;
};

export type TagControlScreenProps = ProductsProps | TagsProps;

export function TagControlScreen(props: TagControlScreenProps) {
  const { variant, categories, zones } = props;
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto px-3 pb-2 pt-3 sm:px-6 lg:overflow-hidden lg:px-8 lg:pb-3 lg:pt-4">
      <div className="shrink-0">
        {variant === 'products' ? (
          <DashboardHeader
            variant="products"
            onAddProduct={() => setCreateOpen(true)}
          />
        ) : (
          <DashboardHeader variant="tags" tagStats={props.tagStats} />
        )}
      </div>
      <div className="mt-2 flex min-h-0 w-full flex-1 flex-col rounded-xl border border-surface-muted bg-white p-2 shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)] lg:mt-3 lg:p-3">
        <div className="flex min-h-0 w-full flex-1 flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-3">
          {variant === 'products' ? (
            <ProductsTable
              initialProducts={props.products}
              templates={props.templates}
              categories={categories}
              createOpen={createOpen}
              onCreateOpenChange={setCreateOpen}
              unlinkedTags={props.unlinkedTags ?? []}
            />
          ) : (
            <TagsTable
              initialTags={props.tags}
              gateways={props.gateways}
              bridgeHealth={props.bridgeHealth}
            />
          )}
        </div>
      </div>
    </div>
  );
}
