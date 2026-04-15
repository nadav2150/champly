import { useEffect, useId, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import { renderLabel } from '../../lib/label-renderer';
import { encodeForTag } from '../../lib/minew-image-encoder';
import { minorUnitsToDecimalString, parseDecimalToMinorUnits } from '../../lib/money';
import { parseLayoutJson } from '../../lib/template-layout';
import { resolveScreen } from '../../lib/tag-screen-map';
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
  tagModel: string | null;
};

type TemplateVariantOption = {
  tagModel: string;
  width: number;
  height: number;
  layoutJson: string;
};

type TemplateOption = {
  id: string;
  name: string;
  layoutJson: string | null;
  variants?: TemplateVariantOption[];
};

type CategoryRow = DashboardOutletContext['categories'][number];

export type UnlinkedTagOption = {
  id: string;
  tagId: string;
  mac: string | null;
  tagModel: string | null;
  status: 'online' | 'offline';
};

type EditProductModalProps = {
  open: boolean;
  product: EditModalProduct | null;
  templates: TemplateOption[];
  categories: CategoryRow[];
  unlinkedTags: UnlinkedTagOption[];
  onClose: () => void;
  onSave: (payload: {
    id: string;
    name: string;
    priceCents: number;
    unit: UnitOption;
    templateId: string | null;
    categoryId: string | null;
    imageBase64: string | null;
    assignTagId: string | null;
    unassignTag: boolean;
  }) => void;
};

export function EditProductModal({
  open,
  product,
  templates,
  categories,
  unlinkedTags,
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
  const [tagAction, setTagAction] = useState<'keep' | 'change' | 'remove'>('keep');
  const [selectedTagId, setSelectedTagId] = useState<string>('');

  useEffect(() => {
    if (product && open) {
      setName(product.name);
      setPrice(minorUnitsToDecimalString(product.priceCents));
      setUnit(product.unit);
      setTemplateId(product.templateId ?? '');
      setCategoryId(product.categoryId ?? '');
      setTagAction('keep');
      setSelectedTagId('');
    }
  }, [product, open]);

  const effectiveTagModel = useMemo(() => {
    if (tagAction === 'remove') return null;
    if (tagAction === 'change' && selectedTagId) {
      const tag = unlinkedTags.find((t) => t.id === selectedTagId);
      return tag?.tagModel ?? product?.tagModel ?? null;
    }
    return product?.tagModel ?? null;
  }, [tagAction, selectedTagId, unlinkedTags, product?.tagModel]);

  const tagScreen = useMemo(
    () => resolveScreen(effectiveTagModel),
    [effectiveTagModel],
  );

  const filteredTemplates = useMemo(() => {
    if (!tagScreen) return templates;
    return templates.filter((tpl) => {
      if (!tpl.variants || tpl.variants.length === 0) return true;
      return tpl.variants.some(
        (v) => v.width === tagScreen.w && v.height === tagScreen.h,
      );
    });
  }, [templates, tagScreen]);

  const matchingLayoutJson = useMemo(() => {
    const tpl = filteredTemplates.find((t) => t.id === templateId);
    if (!tpl) return null;
    if (tagScreen && tpl.variants) {
      const match = tpl.variants.find(
        (v) => v.width === tagScreen.w && v.height === tagScreen.h,
      );
      if (match) return match.layoutJson;
    }
    return tpl.layoutJson;
  }, [filteredTemplates, templateId, tagScreen]);

  const layout = useMemo(() => {
    if (!matchingLayoutJson) return null;
    return parseLayoutJson(matchingLayoutJson);
  }, [matchingLayoutJson]);

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

  const displayTagId = useMemo(() => {
    if (!product) return '—';
    if (tagAction === 'remove') return '—';
    if (tagAction === 'change' && selectedTagId) {
      const tag = unlinkedTags.find((t) => t.id === selectedTagId);
      return tag ? (tag.mac ?? tag.tagId) : product.hardwareTagId || '—';
    }
    return product.hardwareTagId || '—';
  }, [tagAction, selectedTagId, unlinkedTags, product]);

  if (!open || !product) {
    return null;
  }

  const activeProduct = product;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let imageBase64: string | null = null;
    if (layout && tagScreen) {
      try {
        // Render at template size first, then draw stretched to tag resolution
        const tplCanvas = document.createElement('canvas');
        renderLabel(tplCanvas, layout, previewData);

        const tagCanvas = document.createElement('canvas');
        tagCanvas.width = tagScreen.w;
        tagCanvas.height = tagScreen.h;
        const ctx = tagCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(tplCanvas, 0, 0, tagScreen.w, tagScreen.h);
        }
        imageBase64 = encodeForTag(tagCanvas, tagScreen.colors, tagScreen.scan);
      } catch (err) {
        console.error('Failed to encode image for tag:', err);
      }
    }

    onSave({
      id: activeProduct.id,
      name: name.trim() || activeProduct.name,
      priceCents: parseDecimalToMinorUnits(
        price.trim() || minorUnitsToDecimalString(activeProduct.priceCents),
      ),
      unit,
      templateId: templateId.length > 0 ? templateId : null,
      categoryId: categoryId.length > 0 ? categoryId : null,
      imageBase64,
      assignTagId: tagAction === 'change' && selectedTagId ? selectedTagId : null,
      unassignTag: tagAction === 'remove',
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm max-lg:hidden"
        aria-label={t('common:actions.cancel')}
        onClick={onClose}
      />
      <div className="relative h-full w-full overflow-y-auto bg-dashboard-card p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] lg:h-auto lg:max-h-[90dvh] lg:max-w-2xl lg:rounded-xl lg:border lg:border-dashboard-border lg:p-6 lg:pb-6 lg:shadow-[0px_8px_32px_rgba(0,0,0,0.4)]">
        <div className="mb-5 flex items-start justify-between gap-4 lg:mb-6">
          <div>
            <h2
              id={`${formId}-title`}
              className="text-lg font-medium text-white"
            >
              {t('products:editProduct')}
            </h2>
            <p className="mt-1 text-sm text-white/50">
              {t('common:table.tagId')} {displayTagId}
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
                  <option value="">{t('products:selectCategory')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {t(c.name, { defaultValue: c.name })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/60">
                  {t('products:linkedTag')}
                </label>
                {activeProduct.hardwareTagId && activeProduct.hardwareTagId !== '—' ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5">
                      <span className="font-mono text-sm text-white">{activeProduct.hardwareTagId}</span>
                      {activeProduct.tagModel && (
                        <span className="text-xs text-white/40">({activeProduct.tagModel})</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setTagAction(tagAction === 'change' ? 'keep' : 'change')}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          tagAction === 'change'
                            ? 'border border-accent-mint/50 bg-accent-mint/20 text-accent-mint'
                            : 'border border-white/20 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {t('products:switchTag')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTagAction(tagAction === 'remove' ? 'keep' : 'remove')}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          tagAction === 'remove'
                            ? 'border border-red-400/50 bg-red-500/20 text-red-400'
                            : 'border border-white/20 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {t('common:actions.unassignTag')}
                      </button>
                    </div>
                    {tagAction === 'change' && (
                      <select
                        value={selectedTagId}
                        onChange={(e) => setSelectedTagId(e.target.value)}
                        className="w-full rounded-lg border border-accent-mint/30 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none"
                      >
                        <option value="">{t('products:selectTag')}</option>
                        {unlinkedTags.map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.mac ?? tag.tagId}
                            {tag.tagModel ? ` (${tag.tagModel})` : ''}
                            {tag.status === 'online' ? ' ●' : ''}
                          </option>
                        ))}
                      </select>
                    )}
                    {tagAction === 'remove' && (
                      <p className="text-xs text-red-400/80">
                        {t('products:removeTagWarning')}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <select
                      value={selectedTagId}
                      onChange={(e) => {
                        setSelectedTagId(e.target.value);
                        if (e.target.value) setTagAction('change');
                        else setTagAction('keep');
                      }}
                      className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white focus:border-accent-mint focus:outline-none"
                    >
                      <option value="">{t('products:selectTag')}</option>
                      {unlinkedTags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.mac ?? tag.tagId}
                          {tag.tagModel ? ` (${tag.tagModel})` : ''}
                          {tag.status === 'online' ? ' ●' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
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
                  {filteredTemplates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
                {tagScreen && (
                  <p className="mt-1 text-[10px] text-white/40">
                    {t('products:filteredForTag', {
                      size: tagScreen.size,
                      w: tagScreen.w,
                      h: tagScreen.h,
                      defaultValue: `Showing templates for {{size}} ({{w}}×{{h}})`,
                    })}
                  </p>
                )}
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
