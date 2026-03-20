import { useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import { minorUnitsToDecimalString, parseDecimalToMinorUnits } from '../../lib/money';
import { parseLayoutJson } from '../../lib/template-layout';
import { LabelPreview } from './label-preview';

type UnitOption = 'per_unit' | 'per_kg';

export type EditModalProduct = {
  id: string;
  name: string;
  priceCents: number;
  hardwareTagId: string;
  unit: UnitOption;
  templateId: string | null;
  categoryId: string | null;
};

type TemplateOption = { id: string; name: string; layoutJson: string | null };

type CategoryRow = DashboardOutletContext['categories'][number];

type EditProductModalProps = {
  open: boolean;
  product: EditModalProduct | null;
  templates: TemplateOption[];
  categories: CategoryRow[];
  onClose: () => void;
  onSave: (payload: {
    id: string;
    name: string;
    priceCents: number;
    unit: UnitOption;
    templateId: string | null;
    categoryId: string | null;
  }) => void;
};

export function EditProductModal({
  open,
  product,
  templates,
  categories,
  onClose,
  onSave,
}: EditProductModalProps) {
  const { t } = useTranslation(['common', 'products']);
  const formId = useId();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState<UnitOption>('per_kg');
  const [templateId, setTemplateId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    if (product && open) {
      setName(product.name);
      setPrice(minorUnitsToDecimalString(product.priceCents));
      setUnit(product.unit);
      setTemplateId(product.templateId ?? '');
      setCategoryId(product.categoryId ?? '');
    }
  }, [product, open]);

  const selectedTemplate = useMemo(
    () => templates.find((tpl) => tpl.id === templateId),
    [templates, templateId],
  );

  const layout = useMemo(() => {
    const raw = selectedTemplate?.layoutJson;
    if (!raw) return null;
    return parseLayoutJson(raw);
  }, [selectedTemplate?.layoutJson]);

  const previewData = useMemo(() => {
    const cat = categories.find((c) => c.id === categoryId);
    const categoryDisplay = cat
      ? t(cat.name, { defaultValue: cat.name })
      : '';
    const unitLabel =
      unit === 'per_kg' ? t('common:units.perKg') : t('common:units.perUnit');
    const displayName = name.trim() || product?.name || '';
    const priceStr = price.trim() || '0.00';
    return {
      name: displayName,
      price: `₪${priceStr}`,
      unit: unitLabel,
      category: categoryDisplay || '—',
      currency: '₪',
    };
  }, [categories, categoryId, name, price, product?.name, t, unit]);

  if (!open || !product) {
    return null;
  }

  const activeProduct = product;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: activeProduct.id,
      name: name.trim() || activeProduct.name,
      priceCents: parseDecimalToMinorUnits(
        price.trim() || minorUnitsToDecimalString(activeProduct.priceCents),
      ),
      unit,
      templateId: templateId.length > 0 ? templateId : null,
      categoryId: categoryId.length > 0 ? categoryId : null,
    });
    onClose();
  }

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
      <div className="relative w-full max-w-none rounded-t-2xl border border-dashboard-border bg-dashboard-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0px_8px_32px_rgba(0,0,0,0.4)] lg:max-w-md lg:rounded-xl lg:p-6 lg:pb-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25 lg:hidden" aria-hidden />
        <div className="mb-5 flex items-start justify-between gap-4 lg:mb-6">
          <div>
            <h2
              id={`${formId}-title`}
              className="text-lg font-medium text-white"
            >
              {t('products:editProduct')}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {t('common:table.tagId')} {activeProduct.hardwareTagId || '—'}
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
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none lg:py-2"
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
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none lg:py-2"
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
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none lg:py-2"
            >
              <option value="per_kg">{t('common:units.perKg')}</option>
              <option value="per_unit">{t('common:units.perUnit')}</option>
            </select>
          </div>

          <div>
            <label
              htmlFor={`${formId}-category`}
              className="mb-1 block text-xs font-medium text-white/60"
            >
              {t('products:category')}
            </label>
            <select
              id={`${formId}-category`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none lg:py-2"
            >
              <option value="">{t('products:selectCategory')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.name, { defaultValue: c.name })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`${formId}-template`}
              className="mb-1 block text-xs font-medium text-white/60"
            >
              {t('products:template')}
            </label>
            <select
              id={`${formId}-template`}
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none lg:py-2"
            >
              <option value="">{t('products:templatePlaceholder')}</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-white/15 bg-black/20 p-3 lg:p-4">
            <p className="mb-2 text-xs font-medium text-white/50">{t('products:tagPreview')}</p>
            <div className="flex justify-center overflow-x-auto">
              {layout ? (
                <LabelPreview
                  layout={layout}
                  data={previewData}
                  scale={0.55}
                  aria-label={t('products:tagPreview')}
                />
              ) : (
                <div className="flex min-h-[88px] w-full max-w-[200px] items-center justify-center rounded-md border-2 border-dashed border-white/25 px-3 text-center text-xs text-white/45">
                  {t('products:noTemplatePreview')}
                </div>
              )}
            </div>
          </div>

          <div className="mt-1 flex flex-wrap gap-3 lg:mt-2">
            <button
              type="submit"
              className="relative flex-1 rounded-full border border-white bg-accent-mint py-3 text-sm font-medium text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] lg:py-2.5"
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
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10 lg:py-2.5"
            >
              {t('common:actions.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
