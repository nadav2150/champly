import type { ComponentType } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getLanguageFromPathname, toLocalizedPath } from '../../i18n/config';

export type StoreCardData = {
  id: string;
  name: string;
  address: string;
  connectedTags: number;
  pendingUpdates: number;
  failedUpdates: number;
  lastSync: string;
};

function HeaderWaveArt() {
  return (
    <div
      className="relative h-20 w-full overflow-hidden rounded-t-[inherit] bg-gradient-to-br from-[#0f2d32] via-[#1a4a52] to-[#2a6b6f]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      <svg
        className="absolute -bottom-px left-0 h-10 w-[120%] text-white/25"
        viewBox="0 0 400 64"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 40C80 20 120 55 200 35s120 30 200 10v29H0V40z"
          fill="currentColor"
          opacity="0.35"
        />
        <path
          d="M0 48C100 28 150 58 220 38s100 22 180 8v18H0V48z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
      <div className="absolute end-2 top-2 flex size-7 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm">
        <IconStoreMini className="size-3.5 text-white" />
      </div>
    </div>
  );
}

function IconStoreMini({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 8l7-5 7 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 1.5a4.25 4.25 0 00-4.25 4.25c0 3.19 4.25 8.75 4.25 8.75s4.25-5.56 4.25-8.75A4.25 4.25 0 008 1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="5.75" r="1.25" fill="currentColor" />
    </svg>
  );
}

function IconTag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3.5 11.5L11.5 3.5a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8L8.5 16.5H3v-5.5l.5-.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconQueue({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2.5 4h11M2.5 8h11M2.5 12h7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 2.5L14 12H2L8 2.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8 6v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 5v3l2 1.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bold pill chips — סגנון Kanban / כרטיס מודרני */
function StatusPill({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: 'mint' | 'amber' | 'rose';
}) {
  const styles = {
    mint: 'bg-accent-mint text-accent-mint-text ring-1 ring-black/5',
    amber:
      'bg-[#fff8eb] text-[#9a5b00] ring-1 ring-[#fcd34d]',
    rose: 'bg-[#ffe4e6] text-[#be123c] ring-1 ring-[#fecdd3]',
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-tight shadow-sm ${styles}`}
    >
      <span className="opacity-80">{label}</span>
      <span className="tabular-nums opacity-95">{value}</span>
    </span>
  );
}

function FooterMeta({
  icon: Icon,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 text-content-primary/45">
      <Icon className="size-3.5 shrink-0 text-content-primary/35" />
      <span className="text-xs font-semibold tabular-nums text-content-primary">
        {value}
      </span>
      <span className="text-[10px] text-content-primary/40">{label}</span>
    </div>
  );
}

export function StoreCard({ store }: { store: StoreCardData }) {
  const { t } = useTranslation('stores');
  const { pathname } = useLocation();
  const language = getLanguageFromPathname(pathname);

  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-content-border/90 bg-white shadow-[0px_4px_16px_-2px_rgba(0,29,34,0.1)] transition duration-200 hover:-translate-y-px hover:border-accent-mint/30 hover:shadow-[0px_8px_20px_-4px_rgba(0,29,34,0.14)]">
      <HeaderWaveArt />

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5">
        <div className="flex flex-wrap gap-1.5">
          <StatusPill
            label={t('connected')}
            value={store.connectedTags}
            variant="mint"
          />
          <StatusPill
            label={t('pending')}
            value={store.pendingUpdates}
            variant="amber"
          />
          <StatusPill
            label={t('failed')}
            value={store.failedUpdates}
            variant="rose"
          />
        </div>

        <div className="mt-2.5">
          <h2 className="text-base font-bold tracking-tight text-content-primary">
            {store.name}
          </h2>
          <div className="mt-1 flex items-start gap-1.5 text-xs leading-snug text-content-primary/55">
            <IconMapPin className="mt-px size-3.5 shrink-0 text-churn-low" />
            <span>{store.address}</span>
          </div>
        </div>

        <div className="my-2.5 h-px w-full bg-gradient-to-r from-transparent via-content-border to-transparent" />

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <FooterMeta
            icon={IconTag}
            value={store.connectedTags}
            label={t('eslOnline')}
          />
          <FooterMeta
            icon={IconQueue}
            value={store.pendingUpdates}
            label={t('inQueue')}
          />
          <FooterMeta
            icon={IconAlert}
            value={store.failedUpdates}
            label={t('alerts')}
          />
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-content-primary/40">
          <IconClock className="size-3 shrink-0 text-accent-mint" />
          <span className="font-medium text-content-primary/55">{t('sync')}</span>
          <span>{store.lastSync}</span>
        </div>

        <div className="mt-3 flex flex-wrap justify-end gap-1.5">
          <Link
            to={toLocalizedPath('/products', language)}
            className="inline-flex items-center gap-0.5 rounded-full border border-content-border bg-white px-2.5 py-1 text-xs font-semibold text-content-primary shadow-sm transition hover:border-accent-mint/40 hover:bg-surface-subtle"
          >
            {t('products')}
            <IconChevron className="size-3 text-content-primary/35" />
          </Link>
          <Link
            to={toLocalizedPath('/tags', language)}
            className="inline-flex items-center gap-0.5 rounded-full border border-white bg-accent-mint px-2.5 py-1 text-xs font-semibold text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] transition hover:brightness-95"
          >
            {t('tags')}
            <IconChevron className="size-3 text-accent-mint-text/70" />
          </Link>
        </div>
      </div>
    </article>
  );
}
