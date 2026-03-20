import { useEffect, useId, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';

export type StoreProductOption = {
  id: string;
  name: string;
  storeId: string | null;
};

type ZoneRow = { clientKey: string; name: string };

function newClientKey() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

export type CreateStoreModalProps = {
  open: boolean;
  onClose: () => void;
  products: StoreProductOption[];
  storeNameById: Record<string, string>;
};

export function CreateStoreModal({
  open,
  onClose,
  products,
  storeNameById,
}: CreateStoreModalProps) {
  const { t } = useTranslation(['stores', 'common']);
  const formId = useId();
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const submittedRef = useRef(false);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [zoneRows, setZoneRows] = useState<ZoneRow[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [productSearch, setProductSearch] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      submittedRef.current = false;
      return;
    }
    setStep(0);
    setName('');
    setAddress('');
    setZoneRows([]);
    setSelectedProductIds(new Set());
    setProductSearch('');
    setClientError(null);
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

  if (!open) {
    return null;
  }

  const filteredProducts = products.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return true;
    return p.name.toLowerCase().includes(q);
  });

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function addZoneRow() {
    setZoneRows((rows) => [...rows, { clientKey: newClientKey(), name: '' }]);
  }

  function removeZoneRow(clientKey: string) {
    setZoneRows((rows) => rows.filter((r) => r.clientKey !== clientKey));
  }

  function updateZoneName(clientKey: string, value: string) {
    setZoneRows((rows) =>
      rows.map((r) => (r.clientKey === clientKey ? { ...r, name: value } : r)),
    );
  }

  function goNext() {
    setClientError(null);
    if (step === 0) {
      if (!name.trim() || !address.trim()) {
        setClientError(t('stores:validationNameAddress'));
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  }

  function goBack() {
    setClientError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientError(null);
    if (!name.trim() || !address.trim()) {
      setClientError(t('stores:validationNameAddress'));
      setStep(0);
      return;
    }
    submittedRef.current = true;
    const fd = new FormData();
    fd.set('intent', 'create-store');
    fd.set('name', name.trim());
    fd.set('address', address.trim());
    const zoneNames = zoneRows
      .map((z) => z.name.trim())
      .filter((n) => n.length > 0);
    fd.set('zonesJson', JSON.stringify(zoneNames));
    fd.set('productIdsJson', JSON.stringify([...selectedProductIds]));
    fetcher.submit(fd, { method: 'post' });
  }

  const stepLabels = [t('stores:stepInfo'), t('stores:stepZones'), t('stores:stepProducts')];
  const busy = fetcher.state !== 'idle';

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center p-0 lg:items-center lg:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${formId}-title`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label={t('common:actions.cancel')}
        onClick={onClose}
      />
      <div className="relative max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-dashboard-border bg-dashboard-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0px_8px_32px_rgba(0,0,0,0.4)] lg:max-w-lg lg:rounded-xl lg:p-6 lg:pb-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25 lg:hidden" aria-hidden />
        <div className="mb-4 flex items-start justify-between gap-4 lg:mb-5">
          <div>
            <h2
              id={`${formId}-title`}
              className="text-lg font-medium text-white"
            >
              {t('stores:createStore')}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {stepLabels.map((label, i) => (
                <span
                  key={label}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    i === step
                      ? 'bg-accent-mint text-accent-mint-text'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {i + 1}. {label}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-2 py-1 text-sm text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {clientError ? (
          <p className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {clientError}
          </p>
        ) : null}

        <form onSubmit={step === 2 ? handleFinalSubmit : (e) => e.preventDefault()}>
          {step === 0 ? (
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor={`${formId}-name`}
                  className="mb-1 block text-xs font-medium text-white/60"
                >
                  {t('stores:storeName')}
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none lg:py-2"
                  autoComplete="organization"
                />
              </div>
              <div>
                <label
                  htmlFor={`${formId}-address`}
                  className="mb-1 block text-xs font-medium text-white/60"
                >
                  {t('stores:storeAddress')}
                </label>
                <input
                  id={`${formId}-address`}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none lg:py-2"
                  autoComplete="street-address"
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-white/50">{t('stores:noZonesYet')}</p>
              <button
                type="button"
                onClick={addZoneRow}
                className="w-fit rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10"
              >
                {t('stores:addZone')}
              </button>
              <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                {zoneRows.map((row) => (
                  <li
                    key={row.clientKey}
                    className="flex items-center gap-2 rounded-lg border border-white/15 bg-black/20 p-2"
                  >
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) =>
                        updateZoneName(row.clientKey, e.target.value)
                      }
                      placeholder={t('stores:zoneName')}
                      className="min-w-0 flex-1 rounded-md border border-white/20 bg-dashboard-bg px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeZoneRow(row.clientKey)}
                      className="shrink-0 rounded-md border border-white/20 px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                      aria-label={t('stores:removeZone')}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-col gap-3">
              <label
                htmlFor={`${formId}-search`}
                className="text-xs font-medium text-white/60"
              >
                {t('stores:searchProducts')}
              </label>
              <input
                id={`${formId}-search`}
                type="search"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
              />
              <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-white/10 p-2">
                {filteredProducts.length === 0 ? (
                  <li className="py-4 text-center text-sm text-white/40">
                    {t('stores:none')}
                  </li>
                ) : (
                  filteredProducts.map((p) => {
                    const otherId = p.storeId ?? null;
                    const otherName =
                      otherId && storeNameById[otherId]
                        ? storeNameById[otherId]
                        : otherId
                          ? otherId
                          : null;
                    return (
                      <li key={p.id}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/5">
                          <input
                            type="checkbox"
                            checked={selectedProductIds.has(p.id)}
                            onChange={() => toggleProduct(p.id)}
                            className="size-4 rounded border-white/30"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm text-white">
                            {p.name}
                          </span>
                          {otherName ? (
                            <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-100">
                              {t('stores:assignedToOther')}: {otherName}
                            </span>
                          ) : null}
                        </label>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={busy}
                className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 disabled:opacity-50 lg:py-2"
              >
                {t('common:actions.back')}
              </button>
            ) : null}
            {step < 2 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={busy}
                className="rounded-full border border-white bg-accent-mint px-4 py-2.5 text-sm font-medium text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] disabled:opacity-50 lg:py-2"
              >
                {t('common:actions.next')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={busy}
                className="rounded-full border border-white bg-accent-mint px-4 py-2.5 text-sm font-medium text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] disabled:opacity-50 lg:py-2"
              >
                {busy ? '…' : t('stores:create')}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full border border-white/30 px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 disabled:opacity-50 lg:py-2"
            >
              {t('common:actions.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
