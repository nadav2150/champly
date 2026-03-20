import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

type UnitOption = 'per_unit' | 'per_kg';

type ModalProduct = {
  id: string;
  name: string;
  price: string;
  tagId: string;
};

type EditProductModalProps = {
  open: boolean;
  product: ModalProduct | null;
  onClose: () => void;
  onUpdateTag: (payload: {
    id: string;
    name: string;
    price: string;
    unit: UnitOption;
  }) => void;
};

export function EditProductModal({
  open,
  product,
  onClose,
  onUpdateTag,
}: EditProductModalProps) {
  const { t } = useTranslation(['common', 'products']);
  const formId = useId();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState<UnitOption>('per_kg');

  useEffect(() => {
    if (product && open) {
      setName(product.name);
      setPrice(product.price.replace(/[^\d.]/g, ''));
      setUnit('per_kg');
    }
  }, [product, open]);

  if (!open || !product) {
    return null;
  }

  const activeProduct = product;
  const displayPrice = `₪${price || '0.00'}`;
  const unitLabel = unit === 'per_kg' ? t('common:units.perKg') : t('common:units.perUnit');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onUpdateTag({
      id: activeProduct.id,
      name: name.trim() || activeProduct.name,
      price: price.trim() || activeProduct.price.replace(/[^\d.]/g, ''),
      unit,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
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
      <div className="relative w-full max-w-md rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.4)]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id={`${formId}-title`}
              className="text-lg font-medium text-white"
            >
              {t('products:editProduct')}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {t('common:table.tagId')} {activeProduct.tagId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-2 py-1 text-sm text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor={`${formId}-name`}
              className="mb-1 block text-xs font-medium text-white/60"
            >
              {t('products:productName')}
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor={`${formId}-price`}
              className="mb-1 block text-xs font-medium text-white/60"
            >
              {t('products:priceNis')}
            </label>
            <input
              id={`${formId}-price`}
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor={`${formId}-unit`}
              className="mb-1 block text-xs font-medium text-white/60"
            >
              {t('products:unit')}
            </label>
            <select
              id={`${formId}-unit`}
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value as UnitOption)
              }
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2 text-sm text-white focus:border-accent-mint focus:outline-none"
            >
              <option value="per_kg">{t('common:units.perKg')}</option>
              <option value="per_unit">{t('common:units.perUnit')}</option>
            </select>
          </div>

          <div className="rounded-lg border border-white/15 bg-black/20 p-4">
            <p className="mb-2 text-xs font-medium text-white/50">{t('products:tagPreview')}</p>
            <div className="mx-auto flex h-28 w-40 flex-col justify-between rounded-md border-2 border-white/30 bg-linear-to-b from-[#1a3a40] to-dashboard-bg p-3 shadow-inner">
              <span className="line-clamp-2 text-center text-xs font-semibold text-white">
                {name || activeProduct.name}
              </span>
              <span className="text-center text-xl font-bold text-accent-mint">
                {displayPrice}
              </span>
              <span className="text-center text-[10px] text-white/50">
                {unitLabel}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="submit"
              className="relative flex-1 rounded-full border border-white bg-accent-mint py-2.5 text-sm font-medium text-accent-mint-text shadow-[0px_0px_0px_1px_#162021]"
            >
              {t('common:actions.updateTag')}
              <span
                className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.35)]"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
            >
              {t('common:actions.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
