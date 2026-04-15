import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { minorUnitsToDecimalString } from '../../lib/money';
import type { TemplateSelectRow } from '../../db/templates.server';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import { BulkEditSheet } from './bulk-edit-sheet';
import { CreateProductModal } from './create-product-modal';
import { DeleteProductDialog } from './delete-product-dialog';
import { EditProductModal } from './edit-product-modal';
import type { Product } from './tag-product';
function Spinner({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function IconSort({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 4.5L6 1.5 9 4.5M3 7.5L6 10.5 9 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLocate({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function LocateProductTagButton({ mac }: { mac: string }) {
  const { t } = useTranslation(['common']);
  const fetcher = useFetcher();
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; error?: string };
    if (res.ok) {
      toast.success(t('common:toast.locateSuccess'));
    } else {
      toast.error(res.error ?? t('common:toast.locateFailed'));
    }
  }, [fetcher.state, fetcher.data, t]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="send-locate" />
      <input type="hidden" name="mac" value={mac} />
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-1 rounded-[10px] border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 shadow-sm disabled:opacity-40"
      >
        {busy ? <Spinner className="size-3.5 text-blue-600" /> : <IconLocate className="shrink-0" />}
        <span className={busy ? 'sr-only' : ''}>{t('common:actions.locate')}</span>
      </button>
    </fetcher.Form>
  );
}

function ProductLocateIcon({ mac }: { mac: string }) {
  const { t } = useTranslation(['common']);
  const fetcher = useFetcher();
  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; error?: string };
    if (res.ok) {
      toast.success(t('common:toast.locateSuccess'));
    } else {
      toast.error(res.error ?? t('common:toast.locateFailed'));
    }
  }, [fetcher.state, fetcher.data, t]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="send-locate" />
      <input type="hidden" name="mac" value={mac} />
      <button
        type="submit"
        disabled={busy}
        className="flex items-center gap-1 text-blue-500 active:text-blue-700 disabled:opacity-40"
        aria-label={t('common:actions.locate')}
      >
        {busy ? <Spinner className="size-3.5 text-blue-500" /> : <IconLocate className="size-3.5" />}
        <span className="text-[10px]">{t('common:actions.locate')}</span>
      </button>
    </fetcher.Form>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium text-[#18171c]">
      {children}
      <IconSort className="text-black/40" />
    </div>
  );
}



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

type UnlinkedTag = {
  id: string;
  tagId: string;
  mac: string | null;
  tagModel: string | null;
  status: 'online' | 'offline';
};

type ProductsTableProps = {
  initialProducts: Product[];
  templates: TemplateSelectRow[];
  categories: DashboardOutletContext['categories'];
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
  unlinkedTags: UnlinkedTag[];
};

export function ProductsTable({
  initialProducts,
  templates,
  categories,
  createOpen: externalCreateOpen,
  onCreateOpenChange,
  unlinkedTags,
}: ProductsTableProps) {
  const { t } = useTranslation(['common', 'products']);
  const fetcher = useFetcher();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const createOpen = externalCreateOpen ?? internalCreateOpen;
  const setCreateOpen = onCreateOpenChange ?? setInternalCreateOpen;
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditKey, setBulkEditKey] = useState(0);
  const lastFetcherIntent = useRef<string | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const res = fetcher.data as { ok: boolean; error?: string };
    const intent = lastFetcherIntent.current;
    if (intent === 'update-product') {
      if (res.ok) toast.success(t('common:toast.productSaved'));
      else toast.error(res.error ?? t('common:toast.productSaveFailed'));
    } else if (intent === 'bulk-price-update') {
      if (res.ok) toast.success(t('common:toast.priceUpdateSuccess'));
      else toast.error(res.error ?? t('common:toast.priceUpdateFailed'));
    }
    lastFetcherIntent.current = null;
  }, [fetcher.state, fetcher.data, t]);

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const translatedName = t(productKeyByName[p.name] ?? p.name).toLowerCase();
        const translatedCategory = t(p.categoryName).toLowerCase();
        return translatedName.includes(q) || p.name.toLowerCase().includes(q) || translatedCategory.includes(q);
      });
    }
    return result;
  }, [products, categoryFilter, searchQuery, t]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  }

  const handleSaveProduct = useCallback(
    (payload: {
      id: string;
      name: string;
      priceCents: number;
      unit: 'per_unit' | 'per_kg';
      templateId: string | null;
      categoryId: string | null;
      templateData: string | null;
      templateStyle: string | null;
      imageBase64: string | null;
      assignTagId: string | null;
      unassignTag: boolean;
    }) => {
      if (payload.unassignTag) {
        const ufd = new FormData();
        ufd.set('intent', 'unassign-tag');
        ufd.set('productId', payload.id);
        fetcher.submit(ufd, { method: 'post' });
      } else if (payload.assignTagId) {
        const afd = new FormData();
        afd.set('intent', 'assign-tag');
        afd.set('productId', payload.id);
        afd.set('tagInternalId', payload.assignTagId);
        fetcher.submit(afd, { method: 'post' });
      }

      const fd = new FormData();
      fd.set('intent', 'update-product');
      fd.set('id', payload.id);
      fd.set('name', payload.name);
      fd.set('priceCents', String(payload.priceCents));
      fd.set('unit', payload.unit);
      if (payload.templateId) {
        fd.set('templateId', payload.templateId);
      }
      fd.set('categoryId', payload.categoryId ?? '');
      if (payload.templateData) {
        fd.set('templateData', payload.templateData);
      }
      if (payload.templateStyle) {
        fd.set('templateStyle', payload.templateStyle);
      }
      if (payload.imageBase64) {
        fd.set('imageBase64', payload.imageBase64);
      }
      lastFetcherIntent.current = 'update-product';
      fetcher.submit(fd, { method: 'post' });

      const cat = categories.find((c) => c.id === payload.categoryId);
      let newHardwareTagId: string | null | undefined;
      let newTagModel: string | null | undefined;
      if (payload.unassignTag) {
        newHardwareTagId = null;
        newTagModel = null;
      } else if (payload.assignTagId) {
        const assignedTag = unlinkedTags.find((t) => t.id === payload.assignTagId);
        if (assignedTag) {
          newHardwareTagId = assignedTag.mac ?? assignedTag.tagId;
          newTagModel = assignedTag.tagModel;
        }
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === payload.id
            ? {
                ...p,
                name: payload.name,
                priceCents: payload.priceCents,
                unit: payload.unit,
                templateId: payload.templateId,
                templateData: payload.templateData,
                templateStyle: payload.templateStyle,
                categoryId: payload.categoryId,
                categoryName: cat?.name ?? p.categoryName,
                categoryIcon: cat?.icon ?? p.categoryIcon,
                syncStatus: 'pending',
                ...(newHardwareTagId !== undefined && { hardwareTagId: newHardwareTagId }),
                ...(newTagModel !== undefined && { tagModel: newTagModel }),
              }
            : p,
        ),
      );
    },
    [categories, fetcher, unlinkedTags],
  );

  function handleBulkPriceUpdate() {
    if (selectedIds.size === 0) return;
    const fd = new FormData();
    fd.set('intent', 'bulk-price-update');
    fd.set('ids', JSON.stringify([...selectedIds]));
    lastFetcherIntent.current = 'bulk-price-update';
    fetcher.submit(fd, { method: 'post' });

    setProducts((prev) =>
      prev.map((p) =>
        selectedIds.has(p.id)
          ? { ...p, syncStatus: 'pending' as const }
          : p,
      ),
    );
    setSelectedIds(new Set());
  }

  const bulkEditProducts = useMemo(() => {
    if (selectedIds.size > 0) {
      return filtered.filter((p) => selectedIds.has(p.id));
    }
    return filtered;
  }, [filtered, selectedIds]);

  const handleBulkEditSaved = useCallback(
    (edits: Array<{ id: string; name: string; priceCents: number }>) => {
      const editMap = new Map(edits.map((e) => [e.id, e]));
      setProducts((prev) =>
        prev.map((p) => {
          const edit = editMap.get(p.id);
          if (!edit) return p;
          return { ...p, name: edit.name, priceCents: edit.priceCents, syncStatus: 'pending' as const };
        }),
      );
      setSelectedIds(new Set());
    },
    [],
  );

  const modalProduct = editProduct
    ? {
        id: editProduct.id,
        name: editProduct.name,
        priceCents: editProduct.priceCents,
        hardwareTagId: editProduct.hardwareTagId ?? '—',
        unit: editProduct.unit,
        templateId: editProduct.templateId,
        templateData: editProduct.templateData,
        templateStyle: editProduct.templateStyle,
        categoryId: editProduct.categoryId,
        tagModel: editProduct.tagModel,
      }
    : null;

  const openDelete = useCallback((p: Product) => {
    const displayName = t(productKeyByName[p.name] ?? p.name);
    setDeleteTarget({ id: p.id, name: displayName });
  }, [t]);

  const sharedModals = (
    <>
      <CreateProductModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        categories={categories}
        templates={templates}
      />
      <EditProductModal
        open={modalOpen}
        product={modalProduct}
        templates={templates}
        categories={categories}
        unlinkedTags={unlinkedTags}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSaveProduct}
      />
      <DeleteProductDialog
        open={deleteTarget !== null}
        productId={deleteTarget?.id ?? null}
        productName={deleteTarget?.name ?? ''}
        onClose={() => setDeleteTarget(null)}
      />
      <BulkEditSheet
        key={bulkEditKey}
        open={bulkEditOpen}
        products={bulkEditProducts}
        templates={templates}
        onClose={() => setBulkEditOpen(false)}
        onSaved={handleBulkEditSaved}
      />
    </>
  );

  if (products.length === 0) {
    return (
      <>
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-[#e2e2e4] bg-white shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)]">
          <div className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-[#e2e2e4] bg-surface-subtle">
              <span className="text-3xl">📦</span>
            </div>
            <h2 className="text-xl font-medium text-[#18171c]">{t('products:empty.title')}</h2>
            <p className="max-w-sm text-sm text-black/50">{t('products:empty.description')}</p>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="mt-2 rounded-full border border-dashboard-border bg-dashboard-card px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              {t('common:actions.createProduct')}
            </button>
          </div>
        </div>
        {sharedModals}
      </>
    );
  }

  return (
    <>
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#e2e2e4] bg-white shadow-[0px_4px_6px_0px_rgba(207,207,207,0.1)]">
        <div className="flex min-h-0 flex-1 flex-col bg-surface-muted">
          <div className="shrink-0 flex flex-col gap-3 border-b border-black/4 px-3 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-base font-medium">
                <span className="text-black">{t('products:catalogTitle')}</span>
                <span className="text-sm text-black/30">{products.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setBulkEditKey((k) => k + 1); setBulkEditOpen(true); }}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-700 shadow-sm transition hover:bg-amber-100 sm:text-sm"
                >
                  {t('products:bulkEdit')}
                  {selectedIds.size > 0 && (
                    <span className="ms-1 tabular-nums">({selectedIds.size})</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="hidden rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 sm:block"
                >
                  {t('common:actions.createProduct')}
                </button>
                <button
                  type="button"
                  onClick={handleBulkPriceUpdate}
                  disabled={selectedIds.size === 0 || fetcher.state !== 'idle'}
                  className="hidden items-center gap-1.5 rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
                >
                  {fetcher.state !== 'idle' && lastFetcherIntent.current === 'bulk-price-update' && (
                    <Spinner className="size-4" />
                  )}
                  {t('common:actions.bulkPriceUpdate')}
                </button>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 rounded-xl border border-[#ddd] bg-white py-2 ps-3 pe-3 sm:max-w-[270px]">
              <IconSearch className="shrink-0 text-black/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common:table.searchProducts')}
                className="w-full bg-transparent text-sm text-[#18171c] placeholder:text-black/40 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition lg:px-4 lg:py-1.5 lg:text-sm ${
                  categoryFilter === 'all'
                    ? 'bg-dashboard-card text-white shadow-sm'
                    : 'bg-white text-black/70 ring-1 ring-black/10 hover:bg-surface-subtle'
                }`}
              >
                {t('products:allProducts')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition lg:px-4 lg:py-1.5 lg:text-sm ${
                    categoryFilter === cat.id
                      ? 'bg-dashboard-card text-white shadow-sm'
                      : 'bg-white text-black/70 ring-1 ring-black/10 hover:bg-surface-subtle'
                  }`}
                >
                  {cat.icon} {t(cat.name, { defaultValue: cat.name })}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden min-h-0 flex-1 overflow-auto p-3 lg:block">
            <div className="overflow-x-auto rounded-lg border border-content-border bg-white shadow-sm">
              <table className="w-full min-w-[860px] border-collapse text-start text-sm">
                <thead>
                  <tr className="border-b border-content-border bg-surface-subtle/50">
                    <th className="w-12 p-3" scope="col">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="mx-auto flex size-5 items-center justify-center rounded border border-content-border bg-white shadow-sm"
                        aria-label={t('common:table.selectAllRows')}
                      >
                        {selectedIds.size === filtered.length && filtered.length > 0 ? (
                          <span className="text-churn-low">✓</span>
                        ) : null}
                      </button>
                    </th>
                    <th className="p-3" scope="col"><HeaderCell>{t('common:table.name')}</HeaderCell></th>
                    <th className="w-36 p-3" scope="col"><HeaderCell>{t('common:table.category')}</HeaderCell></th>
                    <th className="w-24 p-3" scope="col"><HeaderCell>{t('common:table.price')}</HeaderCell></th>
                    <th className="w-24 p-3" scope="col"><HeaderCell>{t('common:table.unit')}</HeaderCell></th>
                    <th className="w-44 p-3" scope="col"><HeaderCell>{t('common:table.tag')}</HeaderCell></th>
                    <th className="w-36 p-3" scope="col"><HeaderCell>{t('common:table.action')}</HeaderCell></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const selected = selectedIds.has(product.id);
                    const rowBg = selected ? 'bg-surface-muted' : 'bg-white hover:bg-surface-subtle/80';
                    const emoji = product.categoryIcon;
                    const translatedName = t(productKeyByName[product.name] ?? product.name);
                    const translatedCategory = t(product.categoryName);
                    return (
                      <tr key={product.id} className={`border-b border-black/6 ${rowBg}`}>
                        <td className="p-3 align-middle">
                          <button
                            type="button"
                            onClick={() => toggleSelect(product.id)}
                            className={`mx-auto flex size-5 items-center justify-center rounded border shadow-sm ${
                              selected
                                ? 'border-[#028254] bg-churn-low text-white'
                                : 'border-content-border bg-white'
                            }`}
                            aria-label={t('common:table.selectProduct', { name: translatedName })}
                          >
                            {selected ? '✓' : ''}
                          </button>
                        </td>
                        <td className="p-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-[#d8d8d8] bg-white p-1 shadow-sm">
                              <span className="text-lg" aria-hidden>{emoji}</span>
                            </div>
                            <span className="font-medium text-[#18171c]">{translatedName}</span>
                          </div>
                        </td>
                        <td className="p-3 align-middle text-xs text-black/60">{translatedCategory}</td>
                        <td className="p-3 align-middle tabular-nums text-[#18171c]">₪{minorUnitsToDecimalString(product.priceCents)}</td>
                        <td className="p-3 align-middle text-xs text-black/60">
                          {product.unit === 'per_kg' ? t('common:units.perKg') : t('common:units.perUnit')}
                        </td>
                        <td className="p-3 align-middle">
                          {product.hardwareTagId ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-[11px] text-[#18171c]">{product.hardwareTagId}</span>
                              {product.tagModel && (
                                <span className="text-[10px] text-black/40">({product.tagModel})</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-black/30">—</span>
                          )}
                        </td>
                        <td className="p-3 align-middle">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => { setEditProduct(product); setModalOpen(true); }}
                              className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#ddd] bg-white px-3 py-1.5 text-xs font-medium text-[#18171c] shadow-sm"
                            >
                              <IoCreateOutline className="shrink-0" size={16} />
                              {t('common:actions.edit')}
                            </button>
                            {product.hardwareTagId && (
                              <LocateProductTagButton mac={product.hardwareTagId} />
                            )}
                            <button
                              type="button"
                              onClick={() => openDelete(product)}
                              className="inline-flex items-center gap-1.5 rounded-[10px] border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm"
                              aria-label={t('common:actions.deleteProduct')}
                            >
                              <IoTrashOutline className="shrink-0" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-2 lg:hidden">
            <div className="flex flex-col gap-2">
              {filtered.map((product) => {
                const emoji = product.categoryIcon;
                const translatedName = t(productKeyByName[product.name] ?? product.name);
                const translatedCategory = t(product.categoryName);
                const unitLabel = product.unit === 'per_kg' ? t('common:units.perKg') : t('common:units.perUnit');
                return (
                  <article
                    key={product.id}
                    className="rounded-xl border border-content-border bg-white px-3 py-2.5 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditProduct(product);
                        setModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 text-start"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                        <span className="text-xl" aria-hidden>{emoji}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="truncate text-sm font-semibold text-[#18171c]">{translatedName}</span>
                        <div className="mt-0.5 text-[11px] text-black/40">{translatedCategory} · {unitLabel}</div>
                      </div>
                      <span className="shrink-0 tabular-nums text-sm font-bold text-[#18171c]">₪{minorUnitsToDecimalString(product.priceCents)}</span>
                    </button>
                    {product.hardwareTagId && (
                      <div className="mt-2 flex items-center border-t border-black/5 pt-2">
                        <div className="flex flex-1 items-center gap-1.5">
                          <span className="rounded bg-[#f0f4f5] px-1.5 py-px font-mono text-[9px] font-medium text-[#18171c]">
                            {product.tagModel ?? product.hardwareTagId}
                          </span>
                        </div>
                        <ProductLocateIcon mac={product.hardwareTagId} />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {sharedModals}
    </>
  );
}
