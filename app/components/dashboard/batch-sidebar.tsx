import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';

export type CategoryItem = {
  id: string;
  name: string;
  productCount: number;
  icon: string;
  selected?: boolean;
  connectedTags: number;
  pendingTags: number;
};

type ZoneItem = {
  id: string;
  name: string;
  totalTags: number;
  onlineTags: number;
  lowBattery: number;
  selected?: boolean;
};

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconFilter({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 5h14M6 10h8M9 15h2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryCard({ category }: { category: CategoryItem }) {
  const { t } = useTranslation(['common', 'products']);
  const selected = category.selected;
  return (
    <article
      className={`flex w-full flex-col gap-2 rounded-md border p-3 shadow-sm ${
        selected
          ? 'border-batch-selected-border bg-batch-selected-bg shadow-[0px_1px_0px_0px_#0a9132]'
          : 'border-content-border bg-white shadow-[0px_1px_0px_0px_#e8e8e8]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#233236] bg-dashboard-card text-lg shadow-[0px_1px_0px_0px_#233236]" aria-hidden>
          {category.icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium tracking-[-0.56px] text-content-primary">{t(category.name)}</h3>
          <p className="text-[10px] leading-4 tracking-[-0.1px] text-black/50">{category.productCount} {t('products:heading')}</p>
        </div>
      </div>
      <div className="h-px w-full bg-content-border/80" aria-hidden />
      <div className="flex items-center justify-between gap-2 text-[10px]">
        <div>
          <p className="text-black/50">{t('common:status.connected')}</p>
          <p className="font-medium text-churn-low">{category.connectedTags}</p>
        </div>
        <div className="text-end">
          <p className="text-black/50">{t('common:status.pending')}</p>
          <p className="font-medium text-churn-med">{category.pendingTags}</p>
        </div>
      </div>
    </article>
  );
}

function ZoneCard({ zone }: { zone: ZoneItem }) {
  const { t } = useTranslation(['common', 'tags']);
  const selected = zone.selected;
  const offlineTags = zone.totalTags - zone.onlineTags;
  return (
    <article
      className={`flex w-full flex-col gap-2 rounded-md border p-3 shadow-sm ${
        selected
          ? 'border-batch-selected-border bg-batch-selected-bg shadow-[0px_1px_0px_0px_#0a9132]'
          : 'border-content-border bg-white shadow-[0px_1px_0px_0px_#e8e8e8]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#233236] bg-dashboard-card shadow-[0px_1px_0px_0px_#233236]" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="12" height="10" rx="2" stroke="white" strokeWidth="1.1" />
            <path d="M5 7h6M5 10h3" stroke="white" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium tracking-[-0.56px] text-content-primary">{t(zone.name)}</h3>
          <p className="text-[10px] leading-4 tracking-[-0.1px] text-black/50">{zone.totalTags} {t('tags:heading')}</p>
        </div>
      </div>
      <div className="h-px w-full bg-content-border/80" aria-hidden />
      <div className="flex items-center justify-between gap-2 text-[10px]">
        <div>
          <p className="text-black/50">{t('common:status.online')}</p>
          <p className="font-medium text-churn-low">{zone.onlineTags}</p>
        </div>
        <div className="text-center">
          <p className="text-black/50">{t('common:status.offline')}</p>
          <p className={`font-medium ${offlineTags > 0 ? 'text-churn-high' : 'text-black/40'}`}>{offlineTags}</p>
        </div>
        <div className="text-end">
          <p className="text-black/50">{t('tags:lowBat')}</p>
          <p className={`font-medium ${zone.lowBattery > 0 ? 'text-churn-med' : 'text-black/40'}`}>{zone.lowBattery}</p>
        </div>
      </div>
    </article>
  );
}

type BatchSidebarProps = {
  variant?: 'products' | 'tags';
  categories: DashboardOutletContext['categories'];
  zones: DashboardOutletContext['zones'];
};

export function BatchSidebar({
  variant = 'products',
  categories,
  zones,
}: BatchSidebarProps) {
  const { t } = useTranslation(['common', 'products', 'tags']);
  const isProducts = variant === 'products';

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    () => categories[0]?.id ?? '',
  );
  const [selectedZoneId, setSelectedZoneId] = useState(() => zones[0]?.id ?? '');

  const categoriesWithSelection: CategoryItem[] = categories.map((c) => ({
    ...c,
    selected: c.id === selectedCategoryId,
  }));

  const zonesWithSelection: ZoneItem[] = zones.map((z) => ({
    id: z.id,
    name: z.name,
    totalTags: z.totalTags,
    onlineTags: z.onlineTags,
    lowBattery: z.lowBattery,
    selected: z.id === selectedZoneId,
  }));

  return (
    <>
      <aside
        className="hidden w-full shrink-0 flex-col overflow-hidden rounded-xl border border-[#e2e2e4] bg-surface-muted lg:flex lg:w-[341px] lg:max-w-[341px]"
        aria-label={isProducts ? t('stores:productCategories') : t('stores:storeZones')}
      >
        <div className="flex gap-3 border-b border-content-border bg-surface-muted p-3 shadow-[0px_1px_0px_0px_white]">
          <div className="flex flex-1 items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 ps-2 pe-3">
            <IconSearch className="text-black/40" />
            <span className="text-sm text-black/40">
              {isProducts ? t('stores:searchCategory') : t('stores:searchZone')}
            </span>
          </div>
          <button
            type="button"
            className="flex h-auto items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 ps-2 pe-3 shadow-[0px_1px_0px_0px_#ddd,0px_2px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <IconFilter className="text-black" />
            <span className="text-sm text-black">{t('common:actions.sort')}</span>
            <IconChevronDown className="text-black/60" />
          </button>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto p-3">
          {isProducts
            ? categoriesWithSelection.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(c.id)}
                  className="w-full text-start"
                >
                  <CategoryCard category={c} />
                </button>
              ))
            : zonesWithSelection.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZoneId(z.id)}
                  className="w-full text-start"
                >
                  <ZoneCard zone={z} />
                </button>
              ))}
        </div>
      </aside>

      <div
        className="flex gap-2 overflow-x-auto px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden"
        role="tablist"
        aria-label={isProducts ? t('stores:productCategories') : t('stores:storeZones')}
      >
        {isProducts
          ? categoriesWithSelection.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.selected}
                onClick={() => setSelectedCategoryId(c.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
                  c.selected
                    ? 'border border-batch-selected-border bg-batch-selected-bg text-churn-low'
                    : 'border border-content-border bg-white text-content-primary'
                }`}
              >
                <span aria-hidden>{c.icon}</span>
                {t(c.name)}
                <span className="tabular-nums text-black/40">{c.productCount}</span>
              </button>
            ))
          : zonesWithSelection.map((z) => (
              <button
                key={z.id}
                type="button"
                role="tab"
                aria-selected={z.selected}
                onClick={() => setSelectedZoneId(z.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
                  z.selected
                    ? 'border border-batch-selected-border bg-batch-selected-bg text-churn-low'
                    : 'border border-content-border bg-white text-content-primary'
                }`}
              >
                {t(z.name)}
                <span className="tabular-nums text-black/40">{z.totalTags}</span>
              </button>
            ))}
      </div>
    </>
  );
}
