import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import { parseDecimalToMinorUnits } from '../../lib/money';
import { parseLayoutJson } from '../../lib/template-layout';
import { LabelPreview } from './label-preview';

const CREATE_NEW_CATEGORY = '__new__';

type UnitOption = 'per_unit' | 'per_kg';

type TemplateOption = { id: string; name: string; layoutJson: string | null };

type FetcherData = { ok: boolean; id?: string; error?: string };

export type CreateProductModalProps = {
  open: boolean;
  onClose: () => void;
  categories: DashboardOutletContext['categories'];
  templates: TemplateOption[];
};

export function CreateProductModal({
  open,
  onClose,
  categories,
  templates,
}: CreateProductModalProps) {
  const { t } = useTranslation(['common', 'products']);
  const formId = useId();
  const fetcher = useFetcher<FetcherData>();
  const submittedRef = useRef(false);
  const lastSubmitRef = useRef<'idle' | 'create-category' | 'create-product'>('idle');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState<UnitOption>('per_kg');
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📦');
  const [templateId, setTemplateId] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      submittedRef.current = false;
      lastSubmitRef.current = 'idle';
      return;
    }
    setName('');
    setPrice('');
    setUnit('per_kg');
    setCategoryId(categories[0]?.id ?? CREATE_NEW_CATEGORY);
    setNewCategoryName('');
    setNewCategoryIcon('📦');
    setTemplateId('');
    setClientError(null);
  }, [open, categories]);

  useEffect(() => {
    if (!open || !submittedRef.current || fetcher.state !== 'idle') return;
    const d = fetcher.data;
    if (!d) return;

    if (lastSubmitRef.current === 'create-category') {
      if (d.ok && d.id) {
        lastSubmitRef.current = 'create-product';
        const fd = new FormData();
        fd.set('intent', 'create-product');
        fd.set('name', name.trim());
        fd.set(
          'priceCents',
          String(parseDecimalToMinorUnits(price.trim() || '0')),
        );
        fd.set('unit', unit);
        fd.set('categoryId', d.id);
        if (templateId) fd.set('templateId', templateId);
        fetcher.submit(fd, { method: 'post' });
      } else {
        submittedRef.current = false;
        lastSubmitRef.current = 'idle';
        setClientError(t('products:validationNamePrice'));
      }
      return;
    }

    if (lastSubmitRef.current === 'create-product') {
      if (d.ok) {
        submittedRef.current = false;
        lastSubmitRef.current = 'idle';
        onClose();
      } else {
        submittedRef.current = false;
        lastSubmitRef.current = 'idle';
        setClientError(t('products:validationNamePrice'));
      }
    }
  }, [open, fetcher.state, fetcher.data, name, price, unit, templateId, onClose, t]);

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
    const displayName = name.trim() || '—';
    const priceStr = price.trim() || '0.00';
    return {
      name: displayName,
      price: `₪${priceStr}`,
      unit: unitLabel,
      category: categoryDisplay || '—',
      currency: '₪',
    };
  }, [categories, categoryId, name, price, t, unit]);

  if (!open) {
    return null;
  }

  const busy = fetcher.state !== 'idle';

  function submitCreateProduct(resolvedCategoryId: string) {
    const fd = new FormData();
    fd.set('intent', 'create-product');
    fd.set('name', name.trim());
    fd.set(
      'priceCents',
      String(parseDecimalToMinorUnits(price.trim() || '0')),
    );
    fd.set('unit', unit);
    fd.set('categoryId', resolvedCategoryId);
    if (templateId) fd.set('templateId', templateId);
    lastSubmitRef.current = 'create-product';
    fetcher.submit(fd, { method: 'post' });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setClientError(null);
    if (!name.trim()) {
      setClientError(t('products:validationNamePrice'));
      return;
    }
    const priceCents = parseDecimalToMinorUnits(price.trim() || '0');
    if (priceCents <= 0) {
      setClientError(t('products:validationNamePrice'));
      return;
    }

    submittedRef.current = true;

    if (categoryId === CREATE_NEW_CATEGORY) {
      if (!newCategoryName.trim()) {
        submittedRef.current = false;
        setClientError(t('products:validationNamePrice'));
        return;
      }
      lastSubmitRef.current = 'create-category';
      const fd = new FormData();
      fd.set('intent', 'create-category');
      fd.set('name', newCategoryName.trim());
      fd.set('icon', newCategoryIcon.trim() || '📦');
      fetcher.submit(fd, { method: 'post' });
      return;
    }

    if (!categoryId) {
      submittedRef.current = false;
      setClientError(t('products:selectCategory'));
      return;
    }

    submitCreateProduct(categoryId);
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
      <div className="relative max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-dashboard-border bg-dashboard-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0px_8px_32px_rgba(0,0,0,0.4)] lg:max-w-2xl lg:rounded-xl lg:p-6 lg:pb-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25 lg:hidden" aria-hidden />
        <div className="mb-5 flex items-start justify-between gap-4 lg:mb-6">
          <h2
            id={`${formId}-title`}
            className="text-lg font-medium text-white"
          >
            {t('products:createProduct')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-2 py-1 text-sm text-white/80 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {clientError ? (
          <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {clientError}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
            {/* Left column — form fields */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div>
                <label
                  htmlFor={`${formId}-name`}
                  className="mb-1.5 block text-xs font-medium text-white/60"
                >
                  {t('products:productName')}
                </label>
                <input
                  id={`${formId}-name`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label
                    htmlFor={`${formId}-price`}
                    className="mb-1.5 block text-xs font-medium text-white/60"
                  >
                    {t('products:priceNis')}
                  </label>
                  <input
                    id={`${formId}-price`}
                    type="text"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
                  />
                </div>
                <div className="w-[120px] shrink-0">
                  <label
                    htmlFor={`${formId}-unit`}
                    className="mb-1.5 block text-xs font-medium text-white/60"
                  >
                    {t('products:unit')}
                  </label>
                  <select
                    id={`${formId}-unit`}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitOption)}
                    className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none"
                  >
                    <option value="per_kg">{t('common:units.perKg')}</option>
                    <option value="per_unit">{t('common:units.perUnit')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-category`}
                  className="mb-1.5 block text-xs font-medium text-white/60"
                >
                  {t('products:category')}
                </label>
                <select
                  id={`${formId}-category`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none"
                >
                  {categories.length === 0 ? (
                    <option value={CREATE_NEW_CATEGORY}>
                      {t('products:createCategory')}
                    </option>
                  ) : (
                    <>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {t(c.name, { defaultValue: c.name })}
                        </option>
                      ))}
                      <option value={CREATE_NEW_CATEGORY}>
                        {t('products:createCategory')}…
                      </option>
                    </>
                  )}
                </select>
              </div>

              {categoryId === CREATE_NEW_CATEGORY ? (
                <div className="flex flex-col gap-3 rounded-lg border border-white/15 bg-black/20 p-3">
                  <p className="text-xs font-medium text-white/50">
                    {t('products:createCategory')}
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label
                        htmlFor={`${formId}-newcat-name`}
                        className="mb-1.5 block text-xs font-medium text-white/60"
                      >
                        {t('products:categoryName')}
                      </label>
                      <input
                        id={`${formId}-newcat-name`}
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2 text-sm text-white focus:border-accent-mint focus:outline-none"
                      />
                    </div>
                    <div className="w-16 shrink-0">
                      <label
                        htmlFor={`${formId}-newcat-icon`}
                        className="mb-1.5 block text-xs font-medium text-white/60"
                      >
                        {t('products:categoryIcon')}
                      </label>
                      <input
                        id={`${formId}-newcat-icon`}
                        type="text"
                        value={newCategoryIcon}
                        onChange={(e) => setNewCategoryIcon(e.target.value)}
                        placeholder="📦"
                        className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2 text-center text-sm text-white focus:border-accent-mint focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right column — template + preview */}
            <div className="flex flex-col gap-4 lg:w-[260px] lg:shrink-0">
              <div>
                <label
                  htmlFor={`${formId}-template`}
                  className="mb-1.5 block text-xs font-medium text-white/60"
                >
                  {t('products:template')}
                </label>
                <select
                  id={`${formId}-template`}
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none"
                >
                  <option value="">{t('products:templatePlaceholder')}</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 flex-col rounded-lg border border-white/15 bg-black/20 p-4">
                <p className="mb-3 text-xs font-medium text-white/50">
                  {t('products:tagPreview')}
                </p>
                <div className="flex flex-1 items-center justify-center overflow-x-auto">
                  {layout ? (
                    <LabelPreview
                      layout={layout}
                      data={previewData}
                      scale={0.55}
                      aria-label={t('products:tagPreview')}
                    />
                  ) : (
                    <div className="flex min-h-[100px] w-full items-center justify-center rounded-md border-2 border-dashed border-white/25 px-3 text-center text-xs text-white/45">
                      {t('products:noTemplatePreview')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-white/10 pt-4">
            <button
              type="submit"
              disabled={busy}
              className="relative flex-1 rounded-full border border-white bg-accent-mint py-3 text-sm font-medium text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] disabled:opacity-50 lg:py-2.5"
            >
              {busy ? '…' : t('common:actions.createProduct')}
              <span
                className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.35)]"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10 disabled:opacity-50 lg:py-2.5"
            >
              {t('common:actions.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
