import { PRODUCTS_DATA, TAGS_DATA } from './tag-product';

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M4.5 2L8.5 6l-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDots({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="3" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="13" cy="8" r="1.5" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconTag({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3.5 11.5L11.5 3.5a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8L8.5 16.5H3v-5.5l.5-.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconPackage({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 6l7-3 7 3v10l-7 3-7-3V6z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M3 6l7 3 7-3M10 9v9" stroke="currentColor" strokeWidth="1.25" />
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

type DashboardHeaderProps = {
  variant?: 'tags' | 'products';
};

function getProductStats() {
  const total = PRODUCTS_DATA.length;
  const pending = PRODUCTS_DATA.filter((p) => p.syncStatus === 'pending').length;
  const failed = PRODUCTS_DATA.filter((p) => p.syncStatus === 'failed').length;
  return { total, pending, failed };
}

function getTagStats() {
  const online = TAGS_DATA.filter((t) => t.status === 'online').length;
  const lowBattery = TAGS_DATA.filter((t) => t.battery <= 25).length;
  const offline = TAGS_DATA.filter((t) => t.status === 'offline').length;
  return { online, lowBattery, offline, total: TAGS_DATA.length };
}

export function DashboardHeader({ variant = 'tags' }: DashboardHeaderProps) {
  const isProducts = variant === 'products';

  if (isProducts) {
    const stats = getProductStats();
    return (
      <section
        className="w-full max-w-none rounded-lg border border-dashboard-border bg-dashboard-card px-5 py-3 shadow-[0px_0px_0px_1px_#0d171a]"
        aria-labelledby="products-heading"
      >
        <div className="flex flex-col gap-3">
          {/* Row 1: title + KPIs + suggested action */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <h1 id="products-heading" className="text-xl font-medium leading-7 text-white">
                  Products
                </h1>
                <p className="text-xs leading-4 text-white/50">
                  Manage your catalog and pricing
                </p>
              </div>
              <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
              <div className="hidden items-center gap-5 sm:flex lg:gap-7">
                <div className="flex items-center gap-1.5">
                  <StatDot color="green" />
                  <span className="text-xs text-white/50">Total</span>
                  <span className="text-sm font-semibold text-white">{stats.total}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatDot color="amber" />
                  <span className="text-xs text-white/50">Pending</span>
                  <span className="text-sm font-semibold text-white">{stats.pending}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatDot color="red" />
                  <span className="text-xs text-white/50">Issues</span>
                  <span className="text-sm font-semibold text-white">{stats.failed}</span>
                </div>
              </div>
            </div>
            <div
              className="relative flex max-w-[280px] items-center gap-2 overflow-hidden rounded-lg border border-white/16 bg-dashboard-bg px-3 py-2 shadow-[0px_0px_0px_1px_#162021,0px_1px_0px_0px_#2e464b]"
              role="status"
            >
              <div className="pointer-events-none absolute -bottom-16 -right-16 size-36 rounded-full bg-accent-mint/10 blur-2xl" aria-hidden />
              <IconPackage className="relative shrink-0 text-white/80" />
              <p className="relative min-w-0 flex-1 truncate text-xs font-medium text-white">
                {stats.pending > 0
                  ? `${stats.pending} products need price sync`
                  : 'All prices synced'}
              </p>
              <button
                type="button"
                className="relative shrink-0 rounded-full border border-white/36 bg-[#152a2d] p-1 shadow-sm"
                aria-label="Sync prices now"
              >
                <IconChevronRight className="text-white" />
              </button>
            </div>
          </div>
          {/* Row 2: tabs + actions */}
          <div className="flex h-10 w-full items-center rounded-full border border-white/16 bg-dashboard-tabbar px-2.5 shadow-[0px_0px_0px_1px_#162021,0px_1px_0px_0px_#2e464b]">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-[rgba(233,232,237,0.2)] bg-white/20 px-4 py-1 text-xs font-medium text-white shadow-sm">
                  All Products
                </span>
                {['By Category', 'Recently Updated'].map((t) => (
                  <span key={t} className="cursor-default rounded-full px-4 py-1 text-xs text-white/70">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-full border border-white/36 bg-[#475c5f] p-1.5 shadow-sm" aria-label="More options">
                  <IconDots className="text-white" />
                </button>
                <button type="button" className="relative flex items-center gap-1.5 rounded-full border border-white bg-accent-mint py-1 pl-3 pr-2 text-xs font-medium text-accent-mint-text shadow-sm">
                  Add Product
                  <IconPlus className="text-accent-mint-text" />
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.3)]" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const stats = getTagStats();
  return (
    <section
      className="w-full max-w-none rounded-lg border border-dashboard-border bg-dashboard-card px-5 py-3 shadow-[0px_0px_0px_1px_#0d171a]"
      aria-labelledby="tags-heading"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: title + KPIs + suggested action */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 id="tags-heading" className="text-xl font-medium leading-7 text-white">
                Tags
              </h1>
              <p className="text-xs leading-4 text-white/50">
                Monitor and control physical shelf tags
              </p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
            <div className="hidden items-center gap-5 sm:flex lg:gap-7">
              <div className="flex items-center gap-1.5">
                <StatDot color="green" />
                <span className="text-xs text-white/50">Connected</span>
                <span className="text-sm font-semibold text-white">{stats.online}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatDot color="amber" />
                <span className="text-xs text-white/50">Low bat</span>
                <span className="text-sm font-semibold text-white">{stats.lowBattery}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StatDot color="red" />
                <span className="text-xs text-white/50">Offline</span>
                <span className="text-sm font-semibold text-white">{stats.offline}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconClock className="shrink-0 text-accent-mint" />
                <span className="text-xs text-white/50">Sync</span>
                <span className="text-sm font-semibold text-white">10s ago</span>
              </div>
            </div>
          </div>
          <div
            className="relative flex max-w-[280px] items-center gap-2 overflow-hidden rounded-lg border border-white/16 bg-dashboard-bg px-3 py-2 shadow-[0px_0px_0px_1px_#162021,0px_1px_0px_0px_#2e464b]"
            role="status"
          >
            <div className="pointer-events-none absolute -bottom-16 -right-16 size-36 rounded-full bg-accent-mint/10 blur-2xl" aria-hidden />
            <IconTag className="relative shrink-0 text-white/80" />
            <p className="relative min-w-0 flex-1 truncate text-xs font-medium text-white">
              {stats.lowBattery > 0
                ? `${stats.lowBattery} tag${stats.lowBattery > 1 ? 's' : ''} low battery — check now`
                : stats.offline > 0
                  ? `${stats.offline} tag${stats.offline > 1 ? 's' : ''} offline`
                  : 'All tags healthy'}
            </p>
            <button
              type="button"
              className="relative shrink-0 rounded-full border border-white/36 bg-[#152a2d] p-1 shadow-sm"
              aria-label="Review tag alerts"
            >
              <IconChevronRight className="text-white" />
            </button>
          </div>
        </div>
        {/* Row 2: tabs + actions */}
        <div className="flex h-10 w-full items-center rounded-full border border-white/16 bg-dashboard-tabbar px-2.5 shadow-[0px_0px_0px_1px_#162021,0px_1px_0px_0px_#2e464b]">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-[rgba(233,232,237,0.2)] bg-white/20 px-4 py-1 text-xs font-medium text-white shadow-sm">
                All Tags
              </span>
              {['Online', 'Offline', 'Low Battery'].map((t) => (
                <span key={t} className="cursor-default rounded-full px-4 py-1 text-xs text-white/70">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="rounded-full border border-white/36 bg-[#475c5f] p-1.5 shadow-sm" aria-label="More options">
                <IconDots className="text-white" />
              </button>
              <button type="button" className="relative flex items-center gap-1.5 rounded-full border border-white bg-accent-mint py-1 pl-3 pr-2 text-xs font-medium text-accent-mint-text shadow-sm">
                Pair New Tag
                <IconPlus className="text-accent-mint-text" />
                <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_2px_3px_0px_rgba(255,255,255,0.3)]" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
