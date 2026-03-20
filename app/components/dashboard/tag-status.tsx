import { useTranslation } from 'react-i18next';

export type TagSyncStatus = 'updated' | 'pending' | 'failed';
export type TagHwStatus = 'online' | 'offline';
export type SignalStrength = 'strong' | 'weak' | 'none';

type TagStatusProps = {
  status: TagSyncStatus;
  className?: string;
};

const syncStyles: Record<TagSyncStatus, { labelKey: string; className: string }> = {
  updated: {
    labelKey: 'status.synced',
    className:
      'border-churn-low-border bg-[#edfff1] text-churn-low shadow-[0px_0.5px_0px_0px_#0a9132]',
  },
  pending: {
    labelKey: 'status.pending',
    className:
      'border-churn-med-border bg-[#fff8ed] text-churn-med shadow-[0px_0.5px_0px_0px_#b07135]',
  },
  failed: {
    labelKey: 'status.failed',
    className:
      'border-churn-high-border bg-[#fff0ef] text-churn-high shadow-[0px_0.5px_0px_0px_#b03d35]',
  },
};

export function TagStatus({ status, className = '' }: TagStatusProps) {
  const { t } = useTranslation('common');
  const s = syncStyles[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${s.className} ${className}`}
    >
      {t(s.labelKey)}
    </span>
  );
}

const hwStyles: Record<TagHwStatus, { labelKey: string; dot: string; className: string }> = {
  online: {
    labelKey: 'status.online',
    dot: 'bg-churn-low',
    className:
      'border-churn-low-border bg-[#edfff1] text-churn-low shadow-[0px_0.5px_0px_0px_#0a9132]',
  },
  offline: {
    labelKey: 'status.offline',
    dot: 'bg-black/30',
    className:
      'border-black/10 bg-[#f5f5f5] text-black/50 shadow-[0px_0.5px_0px_0px_#ccc]',
  },
};

export function HwStatus({ status, className = '' }: { status: TagHwStatus; className?: string }) {
  const { t } = useTranslation('common');
  const s = hwStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${s.className} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {t(s.labelKey)}
    </span>
  );
}

const signalMeta: Record<SignalStrength, { labelKey: string; bars: number; color: string }> = {
  strong: { labelKey: 'strong', bars: 3, color: 'text-churn-low' },
  weak: { labelKey: 'weak', bars: 2, color: 'text-churn-med' },
  none: { labelKey: 'noSignal', bars: 0, color: 'text-churn-high' },
};

export function SignalBars({ strength, className = '' }: { strength: SignalStrength; className?: string }) {
  const { t } = useTranslation('tags');
  const s = signalMeta[strength];
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.color} ${className}`}>
      <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden>
        <rect x="0" y="10" width="4" height="4" rx="1" fill={s.bars >= 1 ? 'currentColor' : 'currentColor'} opacity={s.bars >= 1 ? 1 : 0.2} />
        <rect x="6" y="5" width="4" height="9" rx="1" fill={s.bars >= 2 ? 'currentColor' : 'currentColor'} opacity={s.bars >= 2 ? 1 : 0.2} />
        <rect x="12" y="0" width="4" height="14" rx="1" fill={s.bars >= 3 ? 'currentColor' : 'currentColor'} opacity={s.bars >= 3 ? 1 : 0.2} />
      </svg>
      <span className="text-xs font-medium">{t(s.labelKey)}</span>
    </span>
  );
}
