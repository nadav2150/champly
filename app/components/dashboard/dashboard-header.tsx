import { useTranslation } from 'react-i18next';

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatDot({ color }: { color: 'green' | 'amber' | 'red' }) {
  const c =
    color === 'green'
      ? 'bg-churn-low'
      : color === 'amber'
        ? 'bg-churn-med'
        : 'bg-churn-high';
  return <span className={`size-1.5 shrink-0 rounded-full ${c}`} aria-hidden />;
}

type DashboardHeaderProps =
  | {
      variant: 'products';
      productStats: { total: number; pending: number; failed: number };
      onAddProduct?: () => void;
    }
  | {
      variant: 'tags';
      tagStats: {
        online: number;
        lowBattery: number;
        offline: number;
        total: number;
      };
    };

export function DashboardHeader(props: DashboardHeaderProps) {
  const { t } = useTranslation(['common', 'products', 'tags']);
  const isProducts = props.variant === 'products';

  if (isProducts) {
    const stats = props.productStats;
    const onAddProduct = props.onAddProduct;
    return (
      <>
        <section
          className="w-full max-w-none rounded-lg border border-dashboard-border bg-dashboard-card px-4 py-3 lg:px-5 shadow-[0px_0px_0px_1px_#0d171a]"
          aria-labelledby="products-heading"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <h1 id="products-heading" className="text-xl font-medium leading-7 text-white">
                    {t('products:heading')}
                  </h1>
                  <p className="text-xs leading-4 text-white/50">
                    {t('products:subheading')}
                  </p>
                </div>
                <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
                <div className="hidden items-center gap-5 sm:flex lg:gap-7">
                  <div className="flex items-center gap-1.5">
                    <StatDot color="green" />
                    <span className="text-xs text-white/50">{t('products:total')}</span>
                    <span className="text-sm font-semibold text-white">{stats.total}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatDot color="amber" />
                    <span className="text-xs text-white/50">{t('products:pending')}</span>
                    <span className="text-sm font-semibold text-white">{stats.pending}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatDot color="red" />
                    <span className="text-xs text-white/50">{t('products:issues')}</span>
                    <span className="text-sm font-semibold text-white">{stats.failed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Mobile FAB */}
        <button
          type="button"
          onClick={onAddProduct}
          className="fixed bottom-4 inset-e-4 z-40 flex size-14 items-center justify-center rounded-full border border-white bg-accent-mint shadow-lg active:scale-95 lg:hidden"
          aria-label={t('common:actions.addProduct')}
        >
          <IconPlus className="size-6 text-accent-mint-text" />
          <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_3px_4px_0px_rgba(255,255,255,0.35)]" aria-hidden />
        </button>
      </>
    );
  }

  const stats = props.tagStats;
  return (
    <>
      <section
        className="w-full max-w-none rounded-lg border border-dashboard-border bg-dashboard-card px-4 py-3 lg:px-5 shadow-[0px_0px_0px_1px_#0d171a]"
        aria-labelledby="tags-heading"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <h1 id="tags-heading" className="text-xl font-medium leading-7 text-white">
                  {t('tags:heading')}
                </h1>
                <p className="text-xs leading-4 text-white/50">
                  {t('tags:subheading')}
                </p>
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
              <div className="hidden items-center gap-5 sm:flex lg:gap-7">
                <div className="flex items-center gap-1.5">
                  <StatDot color="green" />
                  <span className="text-xs text-white/50">{t('tags:connected')}</span>
                  <span className="text-sm font-semibold text-white">{stats.online}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatDot color="amber" />
                  <span className="text-xs text-white/50">{t('tags:lowBat')}</span>
                  <span className="text-sm font-semibold text-white">{stats.lowBattery}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatDot color="red" />
                  <span className="text-xs text-white/50">{t('tags:offline')}</span>
                  <span className="text-sm font-semibold text-white">{stats.offline}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconClock className="shrink-0 text-accent-mint" />
                  <span className="text-xs text-white/50">{t('tags:sync')}</span>
                  <span className="text-sm font-semibold text-white">10s ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mobile FAB */}
      <button
        type="button"
        className="fixed bottom-4 inset-e-4 z-40 flex size-14 items-center justify-center rounded-full border border-white bg-accent-mint shadow-lg active:scale-95 lg:hidden"
        aria-label={t('common:actions.pairNewTag')}
      >
        <IconPlus className="size-6 text-accent-mint-text" />
        <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_3px_4px_0px_rgba(255,255,255,0.35)]" aria-hidden />
      </button>
    </>
  );
}
