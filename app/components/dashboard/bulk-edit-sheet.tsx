import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher, useFetchers } from 'react-router';
import { useTranslation } from 'react-i18next';
import { renderLabel } from '../../lib/label-renderer';
import { encodeForTag } from '../../lib/minew-image-encoder';
import { minorUnitsToDecimalString, parseDecimalToMinorUnits } from '../../lib/money';
import { resolveScreen } from '../../lib/tag-screen-map';
import { parseLayoutJson, parseTemplateStyle } from '../../lib/template-layout';
import type { TemplateSelectRow } from '../../db/templates.server';
import type { Product } from './tag-product';

type EditRow = {
  id: string;
  name: string;
  price: string;
  emoji: string;
  unit: 'per_unit' | 'per_kg';
  categoryName: string;
  templateId: string | null;
  templateStyle: string | null;
  tagModel: string | null;
  hardwareTagId: string | null;
  originalName: string;
  originalPrice: string;
};

type BulkEditSheetProps = {
  open: boolean;
  products: Product[];
  templates: TemplateSelectRow[];
  onClose: () => void;
  onSaved: (edits: Array<{ id: string; name: string; priceCents: number }>) => void;
};

const productKeyByName: Record<string, string> = {
  Tomato: 'products:items.tomato',
  Banana: 'products:items.banana',
  Apple: 'products:items.apple',
  'Milk 1L': 'products:items.milk1l',
  'Cottage Cheese': 'products:items.cottageCheese',
  'Orange Juice': 'products:items.orangeJuice',
  'White Bread': 'products:items.whiteBread',
  'Chocolate Bar': 'products:items.chocolateBar',
  'Water 1.5L': 'products:items.water15l',
  'Potato Chips': 'products:items.potatoChips',
  Cucumber: 'products:items.cucumber',
  'Greek Yogurt': 'products:items.greekYogurt',
};

function renderTagImage(
  row: EditRow,
  templates: TemplateSelectRow[],
  t: (key: string, opts?: Record<string, string>) => string,
): string | null {
  if (!row.hardwareTagId || !row.templateId || !row.tagModel) return null;

  const tagScreen = resolveScreen(row.tagModel);
  if (!tagScreen) return null;

  const tpl = templates.find((tp) => tp.id === row.templateId);
  if (!tpl) return null;

  let layoutJson: string | null = null;
  if (tpl.variants?.length) {
    const match = tpl.variants.find(
      (v) => v.width === tagScreen.w && v.height === tagScreen.h,
    );
    if (match) layoutJson = match.layoutJson;
  }
  if (!layoutJson) layoutJson = tpl.layoutJson;
  if (!layoutJson) return null;

  const layout = parseLayoutJson(layoutJson);
  if (!layout) return null;

  const unitLabel =
    row.unit === 'per_kg' ? t('common:units.perKg') : t('common:units.perUnit');
  const categoryDisplay = row.categoryName
    ? t(row.categoryName, { defaultValue: row.categoryName })
    : '';
  const priceStr = row.price.trim() || '0.00';

  const previewData: Record<string, string> = {
    name: row.name.trim(),
    price: `₪${priceStr}`,
    unit: unitLabel,
    category: categoryDisplay || '—',
    currency: '₪',
  };

  try {
    const style = parseTemplateStyle(row.templateStyle);
    const tplCanvas = document.createElement('canvas');
    renderLabel(tplCanvas, layout, previewData, { style });

    const tagCanvas = document.createElement('canvas');
    tagCanvas.width = tagScreen.w;
    tagCanvas.height = tagScreen.h;
    const ctx = tagCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(tplCanvas, 0, 0, tagScreen.w, tagScreen.h);
    }
    return encodeForTag(tagCanvas, tagScreen.colors, tagScreen.scan);
  } catch (err) {
    console.error(`Failed to render tag image for product ${row.id}:`, err);
    return null;
  }
}

let activeBatchId = 0;

function ImagePushSlot({ batchId, item }: { batchId: number; item: { productId: string; imageBase64: string } }) {
  const fetcher = useFetcher({ key: `img-push-${batchId}-${item.productId}` });
  const didSubmitRef = useRef(false);

  useEffect(() => {
    if (didSubmitRef.current || fetcher.state !== 'idle') return;
    didSubmitRef.current = true;
    const fd = new FormData();
    fd.set('intent', 'push-tag-image');
    fd.set('productId', item.productId);
    fd.set('imageBase64', item.imageBase64);
    fetcher.submit(fd, { method: 'post' });
  }, [fetcher.state, fetcher, item]);

  return null;
}

function ImagePushQueue({ queue, onDone }: { queue: Array<{ productId: string; imageBase64: string }>; onDone?: () => void }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const [batchId] = useState(() => ++activeBatchId);

  const allFetchers = useFetchers();
  const batchPrefix = `img-push-${batchId}-`;

  const batchFetchers = useMemo(
    () => allFetchers.filter((f) => f.key?.startsWith(batchPrefix)),
    [allFetchers, batchPrefix],
  );

  const allSettled = queue.length > 0
    && batchFetchers.length === queue.length
    && batchFetchers.every((f) => f.state === 'idle' && f.data);

  const calledDoneRef = useRef(false);
  useEffect(() => {
    if (allSettled && !calledDoneRef.current) {
      calledDoneRef.current = true;
      onDoneRef.current?.();
    }
  }, [allSettled]);

  if (queue.length === 0) return null;

  return (
    <>
      {queue.map((item) => (
        <ImagePushSlot key={item.productId} batchId={batchId} item={item} />
      ))}
    </>
  );
}

export function BulkEditSheet({
  open,
  products,
  templates,
  onClose,
  onSaved,
}: BulkEditSheetProps) {
  const { t } = useTranslation(['common', 'products']);
  const fetcher = useFetcher();
  const busy = fetcher.state !== 'idle';
  const listRef = useRef<HTMLDivElement>(null);
  const didHandleRef = useRef(false);

  const [rows, setRows] = useState<EditRow[]>(() =>
    products.map((p) => ({
      id: p.id,
      name: t(productKeyByName[p.name] ?? p.name),
      price: minorUnitsToDecimalString(p.priceCents),
      emoji: p.categoryIcon,
      unit: p.unit,
      categoryName: p.categoryName,
      templateId: p.templateId,
      templateStyle: p.templateStyle,
      tagModel: p.tagModel,
      hardwareTagId: p.hardwareTagId,
      originalName: t(productKeyByName[p.name] ?? p.name),
      originalPrice: minorUnitsToDecimalString(p.priceCents),
    })),
  );
  const [imageQueue, setImageQueue] = useState<Array<{ productId: string; imageBase64: string }>>([]);

  const changedRows = useMemo(
    () => rows.filter((r) => r.name !== r.originalName || r.price !== r.originalPrice),
    [rows],
  );

  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const templatesRef = useRef(templates);
  templatesRef.current = templates;
  const changedRowsRef = useRef(changedRows);
  changedRowsRef.current = changedRows;

  const fetcherState = fetcher.state;
  const fetcherData = fetcher.data as { ok?: boolean } | undefined;

  useEffect(() => {
    if (fetcherState !== 'idle' || !fetcherData || didHandleRef.current) return;
    if (!fetcherData.ok) return;

    didHandleRef.current = true;

    const changed = changedRowsRef.current;
    const edits = changed.map((r) => ({
      id: r.id,
      name: r.name.trim(),
      priceCents: parseDecimalToMinorUnits(r.price),
    }));

    const imagePushes: Array<{ productId: string; imageBase64: string }> = [];
    for (const row of changed) {
      const imageBase64 = renderTagImage(row, templatesRef.current, t);
      if (imageBase64) {
        imagePushes.push({ productId: row.id, imageBase64 });
      }
    }
    if (imagePushes.length > 0) {
      setImageQueue(imagePushes);
    }

    onSavedRef.current(edits);
    onCloseRef.current();
  }, [fetcherState, fetcherData, t]);

  if (!open && imageQueue.length === 0) return null;

  function updateRow(id: string, field: 'name' | 'price', value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function handleSave() {
    const edits = changedRows.map((r) => ({
      id: r.id,
      name: r.name.trim() || r.originalName,
      priceCents: parseDecimalToMinorUnits(r.price),
    }));

    if (edits.length === 0) {
      onClose();
      return;
    }

    const fd = new FormData();
    fd.set('intent', 'bulk-edit-products');
    fd.set('edits', JSON.stringify(edits));
    fetcher.submit(fd, { method: 'post' });
  }

  const clearImageQueue = () => setImageQueue([]);

  if (!open) {
    return <ImagePushQueue queue={imageQueue} onDone={clearImageQueue} />;
  }

  return (
    <>
      <ImagePushQueue queue={imageQueue} onDone={clearImageQueue} />
      <div
        className="fixed inset-x-0 top-0 z-100 flex h-dvh flex-col lg:items-center lg:justify-center lg:p-6"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-label={t('common:actions.cancel')}
          onClick={onClose}
        />

        <div className="relative z-10 flex max-h-full w-full flex-1 flex-col bg-white lg:max-h-[85dvh] lg:max-w-xl lg:flex-initial lg:rounded-2xl lg:shadow-2xl">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-black/6 px-4 py-3 lg:px-6 lg:py-4">
            <div>
              <h2 className="text-base font-semibold text-[#18171c] lg:text-lg">
                {t('products:bulkEditTitle')}
              </h2>
              <p className="text-xs text-black/40">
                {t('products:bulkEditCount', { count: rows.length })}
                {changedRows.length > 0 && (
                  <span className="ms-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                    {changedRows.length} changed
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-black/40 hover:bg-black/5 active:bg-black/10"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Column labels — desktop only */}
          <div className="hidden shrink-0 border-b border-black/4 bg-surface-subtle/50 px-6 py-2 lg:flex">
            <span className="w-10 shrink-0" />
            <span className="flex-1 text-xs font-medium text-black/40">{t('common:table.name')}</span>
            <span className="w-32 shrink-0 text-xs font-medium text-black/40">{t('common:table.price')}</span>
          </div>

          {/* Scrollable list */}
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {rows.map((row) => {
              const nameChanged = row.name !== row.originalName;
              const priceChanged = row.price !== row.originalPrice;
              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-2 border-b border-black/4 px-4 py-3 last:border-b-0 lg:flex-row lg:items-center lg:gap-3 lg:px-6 lg:py-2.5"
                >
                  {/* Emoji — desktop */}
                  <div className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-surface-subtle lg:flex">
                    <span className="text-lg" aria-hidden>{row.emoji}</span>
                  </div>

                  {/* Mobile: emoji + name row */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                      <span className="text-xl" aria-hidden>{row.emoji}</span>
                    </div>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                      className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm font-medium text-[#18171c] focus:border-dashboard-card focus:outline-none ${
                        nameChanged ? 'border-amber-300 bg-amber-50/50' : 'border-black/10'
                      }`}
                    />
                  </div>

                  {/* Mobile: price row */}
                  <div className="flex items-center gap-2 lg:hidden">
                    <span className="w-9 shrink-0 text-center text-sm font-semibold text-black/30">₪</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.price}
                      onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                      className={`min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm tabular-nums font-semibold text-[#18171c] focus:border-dashboard-card focus:outline-none ${
                        priceChanged ? 'border-amber-300 bg-amber-50/50' : 'border-black/10'
                      }`}
                    />
                  </div>

                  {/* Desktop: name */}
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                    className={`hidden min-w-0 flex-1 rounded-md border bg-white px-2.5 py-1.5 text-sm text-[#18171c] focus:border-dashboard-card focus:outline-none lg:block ${
                      nameChanged ? 'border-amber-300 bg-amber-50/50' : 'border-transparent hover:border-black/10'
                    }`}
                  />

                  {/* Desktop: price */}
                  <div className="hidden w-32 shrink-0 items-center gap-1 lg:flex">
                    <span className="text-sm text-black/30">₪</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.price}
                      onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                      className={`w-full rounded-md border bg-white px-2 py-1.5 text-sm tabular-nums font-medium text-[#18171c] focus:border-dashboard-card focus:outline-none ${
                        priceChanged ? 'border-amber-300 bg-amber-50/50' : 'border-transparent hover:border-black/10'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 shrink-0 border-t border-black/6 bg-white px-4 py-3 lg:rounded-b-2xl lg:px-6 lg:py-4">
            <div className="flex gap-3" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <button
                type="button"
                onClick={handleSave}
                disabled={busy || changedRows.length === 0}
                className="flex-1 rounded-xl bg-dashboard-card py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-40 lg:py-2.5"
              >
                {busy ? '...' : changedRows.length > 0 ? t('products:bulkEditSave') : t('products:bulkEditDone')}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-xl border border-black/10 px-5 py-3 text-sm font-medium text-black/60 transition hover:bg-black/5 disabled:opacity-40 lg:py-2.5"
              >
                {t('common:actions.cancel')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
