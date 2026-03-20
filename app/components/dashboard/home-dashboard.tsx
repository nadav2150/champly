import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { getLanguageFromPathname, toLocalizedPath } from '../../i18n/config';

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-3xl font-medium tracking-tight text-white">{value}</p>
      {hint ? (
        <p className="mt-2 text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
}

export function HomeDashboard() {
  const { t } = useTranslation('home');
  const { pathname } = useLocation();
  const language = getLanguageFromPathname(pathname);

  return (
    <div className="flex w-full flex-1 flex-col gap-8 overflow-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-white md:text-4xl">
          {t('welcome')}
        </h1>
        <p className="max-w-2xl text-sm text-white/50 md:text-base">
          {t('subtitle')} <span className="text-accent-mint">{t('subtitleDetail')}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t('stats.totalProducts')} value="35" hint={t('stats.acrossCategories')} />
        <StatCard label={t('stats.connectedTags')} value="18" hint={t('stats.onlineNow')} />
        <StatCard label={t('stats.lowBattery')} value="2" hint={t('stats.needsAttention')} />
        <StatCard label={t('stats.offlineTags')} value="2" hint={t('stats.noSignal')} />
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        <div className="rounded-xl border border-surface-muted bg-white p-6 text-content-primary shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium text-content-primary">
            {t('quickActions.title')}
          </h2>
          <p className="mt-1 text-sm text-content-primary/60">
            {t('quickActions.subtitle')}
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <Link
                to={toLocalizedPath('/stores', language)}
                className="flex items-center justify-between rounded-lg border border-content-border bg-surface-subtle px-4 py-3 text-sm font-medium text-content-primary transition hover:border-accent-mint/40 hover:bg-accent-mint/10"
              >
                {t('quickActions.stores')}
                <span className="text-content-primary/40" aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                to={toLocalizedPath('/products', language)}
                className="flex items-center justify-between rounded-lg border border-content-border bg-surface-subtle px-4 py-3 text-sm font-medium text-content-primary transition hover:border-accent-mint/40 hover:bg-accent-mint/10"
              >
                {t('quickActions.products')}
                <span className="text-content-primary/40" aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <Link
                to={toLocalizedPath('/tags', language)}
                className="flex items-center justify-between rounded-lg border border-content-border bg-surface-subtle px-4 py-3 text-sm font-medium text-content-primary transition hover:border-accent-mint/40 hover:bg-accent-mint/10"
              >
                {t('quickActions.tags')}
                <span className="text-content-primary/40" aria-hidden>→</span>
              </Link>
            </li>
            <li>
              <span className="flex cursor-default items-center justify-between rounded-lg border border-content-border/80 bg-white px-4 py-3 text-sm text-content-primary/50">
                {t('quickActions.comingSoon')}
                <span aria-hidden>—</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]">
          <h2 className="text-lg font-medium text-white">{t('today.title')}</h2>
          <p className="mt-1 text-sm text-white/50">
            {t('today.lowBatteryNotice', { count: 2 })}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to={toLocalizedPath('/tags', language)}
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              {t('common:actions.goToTags')}
            </Link>
            <Link
              to={toLocalizedPath('/products', language)}
              className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10"
            >
              {t('common:actions.goToProducts')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
