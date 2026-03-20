import { useEffect, useId, useRef } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';

export type DeleteStoreDialogProps = {
  open: boolean;
  storeId: string | null;
  storeName: string;
  onClose: () => void;
};

export function DeleteStoreDialog({
  open,
  storeId,
  storeName,
  onClose,
}: DeleteStoreDialogProps) {
  const { t } = useTranslation(['stores', 'common']);
  const titleId = useId();
  const fetcher = useFetcher<{ ok: boolean }>();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      submittedRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (!open || !submittedRef.current) return;
    if (fetcher.state !== 'idle') return;
    const d = fetcher.data;
    if (d?.ok) {
      submittedRef.current = false;
      onClose();
    } else if (d && d.ok === false) {
      submittedRef.current = false;
    }
  }, [open, fetcher.state, fetcher.data, onClose]);

  if (!open || !storeId) {
    return null;
  }

  const busy = fetcher.state !== 'idle';

  function handleDelete() {
    if (!storeId) return;
    submittedRef.current = true;
    const fd = new FormData();
    fd.set('intent', 'delete-store');
    fd.set('id', storeId);
    fetcher.submit(fd, { method: 'post' });
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center p-0 lg:items-center lg:p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label={t('common:actions.cancel')}
        onClick={onClose}
      />
      <div className="relative w-full max-w-none rounded-t-2xl border border-dashboard-border bg-dashboard-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0px_8px_32px_rgba(0,0,0,0.4)] lg:max-w-md lg:rounded-xl lg:p-6 lg:pb-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25 lg:hidden" aria-hidden />
        <h2 id={titleId} className="text-lg font-medium text-white">
          {t('stores:deleteConfirmTitle')}
        </h2>
        <p className="mt-2 text-sm text-white/55">
          <span className="font-semibold text-white/80">{storeName}</span>
          {' — '}
          {t('stores:deleteConfirmMessage')}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="rounded-full border border-red-400/50 bg-red-500/20 px-4 py-2.5 text-sm font-medium text-red-100 hover:bg-red-500/30 disabled:opacity-50 lg:py-2"
          >
            {busy ? '…' : t('common:actions.deleteStore')}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 disabled:opacity-50 lg:py-2"
          >
            {t('common:actions.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
