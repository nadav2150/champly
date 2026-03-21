import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { minorUnitsToDecimalString } from '../../lib/money';
import type { TemplateSelectRow } from '../../db/templates.server';
import type { DashboardOutletContext } from '../../types/dashboard-outlet-context';
import type { ProductFilterTab } from './dashboard-header';
import { CreateProductModal } from './create-product-modal';
import { DeleteProductDialog } from './delete-product-dialog';
import { EditProductModal } from './edit-product-modal';
import type { Product } from './tag-product';
import { TagStatus, type TagSyncStatus } from './tag-status';

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

function IconLink({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6.5 9.5a3 3 0 004.24 0l2-2a3 3 0 00-4.24-4.24L7.5 4.26" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 6.5a3 3 0 00-4.24 0l-2 2a3 3 0 004.24 4.24l1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

type FilterKey = 'all' | TagSyncStatus;

const FILTER_PILLS: { key: FilterKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'products:allProductsFilter' },
  { key: 'updated', labelKey: 'products:syncedFilter' },
  { key: 'pending', labelKey: 'products:pendingFilter' },
  { key: 'failed', labelKey: 'products:failedFilter' },
];

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

type ProductsTableProps = {
  initialProducts: Product[];
  templates: TemplateSelectRow[];
  categories: DashboardOutletContext['categories'];
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
  headerFilter?: ProductFilterTab;
};

export function ProductsTable({
  initialProducts,
  templates,
  categories,
  createOpen: externalCreateOpen,
  onCreateOpenChange,
  headerFilter = 'all',
}: ProductsTableProps) {
  const { t } = useTranslation(['common', 'products']);
  const fetcher = useFetcher();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [internalCreateOpen, setInternalCreateOpen] = useState(false);
  const createOpen = externalCreateOpen ?? internalCreateOpen;
  const setCreateOpen = onCreateOpenChange ?? setInternalCreateOpen;
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const filtered = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const translatedName = t(productKeyByName[p.name] ?? p.name).toLowerCase();
        const translatedCategory = t(p.categoryName).toLowerCase();
        return translatedName.includes(q) || p.name.toLowerCase().includes(q) || translatedCategory.includes(q);
      });
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.syncStatus === statusFilter);
    }
    if (headerFilter === 'byCategory') {
      result = [...result].sort((a, b) =>
        (a.categoryName ?? '').localeCompare(b.categoryName ?? ''),
      );
    } else if (headerFilter === 'recentlyUpdated') {
      result = result.filter(
        (p) => p.syncStatus === 'pending' || p.syncStatus === 'failed',
      );
    }
    return result;
  }, [products, searchQuery, statusFilter, headerFilter, t]);

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
    }) => {
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
      fetcher.submit(fd, { method: 'post' });

      const cat = categories.find((c) => c.id === payload.categoryId);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === payload.id
            ? {
                ...p,
                name: payload.name,
                priceCents: payload.priceCents,
                unit: payload.unit,
                templateId: payload.templateId,
                categoryId: payload.categoryId,
                categoryName: cat?.name ?? p.categoryName,
                categoryIcon: cat?.icon ?? p.categoryIcon,
                syncStatus: 'pending',
              }
            : p,
        ),
      );
    },
    [categories, fetcher],
  );

  function handleBulkPriceUpdate() {
    if (selectedIds.size === 0) return;
    const fd = new FormData();
    fd.set('intent', 'bulk-price-update');
    fd.set('ids', JSON.stringify([...selectedIds]));
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

  const modalProduct = editProduct
    ? {
        id: editProduct.id,
        name: editProduct.name,
        priceCents: editProduct.priceCents,
        hardwareTagId: editProduct.hardwareTagId ?? '—',
        unit: editProduct.unit,
        templateId: editProduct.templateId,
        categoryId: editProduct.categoryId,
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
          <div className="shrink-0 flex flex-col gap-3 border-b border-black/4 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 text-base font-medium">
                  <span className="text-black">{t('products:catalogTitle')}</span>
                  <span className="text-sm text-black/30">{products.length}</span>
                </div>
                <span className="hidden h-[26px] w-px bg-black/10 sm:block" aria-hidden />
                <div className="flex w-full max-w-[270px] items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 ps-2 pe-3 sm:w-[270px]">
                  <IconSearch className="shrink-0 text-black/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common:table.searchProducts')}
                    className="w-full bg-transparent text-sm text-[#18171c] placeholder:text-black/40 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
                >
                  {t('common:actions.createProduct')}
                </button>
                <button
                  type="button"
                  onClick={handleBulkPriceUpdate}
                  disabled={selectedIds.size === 0 || fetcher.state !== 'idle'}
                  className="rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common:actions.bulkPriceUpdate')}
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible">
              {FILTER_PILLS.map(({ key, labelKey }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    statusFilter === key
                      ? 'bg-dashboard-card text-white shadow-sm'
                      : 'bg-white text-black/70 ring-1 ring-black/10 hover:bg-surface-subtle'
                  }`}
                >
                  {t(labelKey)}
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
                    <th className="w-32 p-3" scope="col"><HeaderCell>{t('common:table.syncStatus')}</HeaderCell></th>
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
                          <TagStatus status={product.syncStatus} />
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
                            {!product.hardwareTagId ? (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] border border-accent-mint/30 bg-accent-mint/10 px-3 py-1.5 text-xs font-medium text-churn-low shadow-sm"
                              >
                                <IconLink className="shrink-0" />
                                {t('common:actions.assignTag')}
                              </button>
                            ) : null}
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
                return (
                  <div
                    key={product.id}
                    className="flex w-full items-stretch gap-2 rounded-lg border border-content-border bg-white p-2 shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setEditProduct(product);
                        setModalOpen(true);
                      }}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 text-start active:bg-surface-subtle"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#d8d8d8] bg-white shadow-sm">
                        <span className="text-xl" aria-hidden>{emoji}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-[#18171c]">{translatedName}</span>
                          <span className="shrink-0 tabular-nums text-sm font-semibold text-[#18171c]">₪{minorUnitsToDecimalString(product.priceCents)}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs text-black/50">{translatedCategory}</span>
                          <span className="text-black/20">·</span>
                          <span className="text-xs text-black/50">
                            {product.unit === 'per_kg' ? t('common:units.perKg') : t('common:units.perUnit')}
                          </span>
                          <span className="text-black/20">·</span>
                          <TagStatus status={product.syncStatus} />
                        </div>
                      </div>
                      <IoCreateOutline className="shrink-0 text-black/30" size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDelete(product)}
                      className="flex shrink-0 items-center justify-center rounded-md border border-red-100 px-2 text-red-700"
                      aria-label={t('common:actions.deleteProduct')}
                    >
                      <IoTrashOutline size={16} />
                    </button>
                  </div>
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
