import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditProductModal } from './edit-product-modal';
import type { Product } from './tag-product';
import { PRODUCTS_DATA } from './tag-product';
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

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M8.5 2.5l5 5-8 8H2.5v-3L10.5 2.5z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
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

const CATEGORY_EMOJI: Record<string, string> = {
  'Fruits & Vegetables': '🥕',
  'Drinks': '🥤',
  'Dairy': '🧀',
  'Bakery': '🍞',
  'Snacks & Sweets': '⭐',
};

const categoryKeyByName: Record<string, string> = {
  'Fruits & Vegetables': 'products:categories.fruitsVegetables',
  Drinks: 'products:categories.drinks',
  Dairy: 'products:categories.dairy',
  Bakery: 'products:categories.bakery',
  'Snacks & Sweets': 'products:categories.snacksSweets',
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

export function ProductsTable() {
  const { t } = useTranslation(['common', 'products']);
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return products;
    return products.filter((p) => p.syncStatus === statusFilter);
  }, [products, statusFilter]);

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

  function handleUpdateProduct(payload: {
    id: string;
    name: string;
    price: string;
    unit: 'per_unit' | 'per_kg';
  }) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === payload.id
          ? { ...p, name: payload.name, price: payload.price, unit: payload.unit, syncStatus: 'pending' as const }
          : p,
      ),
    );
  }

  function handleBulkPriceUpdate() {
    if (selectedIds.size === 0) return;
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
    ? { id: editProduct.id, name: editProduct.name, price: editProduct.price, tagId: editProduct.tagId ?? '—', status: editProduct.syncStatus, battery: 0, lastUpdate: '' }
    : null;

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
                <span className="hidden h-[26px] w-px bg-black/10 sm:block" />
                <div className="flex w-full max-w-[270px] items-center gap-2 rounded-[10px] border border-[#ddd] bg-white py-1.5 ps-2 pe-3 sm:w-[270px]">
                  <IconSearch className="text-black/40" />
                  <span className="text-sm text-black/40">{t('common:table.searchProducts')}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBulkPriceUpdate}
                disabled={selectedIds.size === 0}
                className="rounded-full border border-dashboard-border bg-dashboard-card px-4 py-2 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t('common:actions.bulkPriceUpdate')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_PILLS.map(({ key, labelKey }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
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
          <div className="min-h-0 flex-1 overflow-auto p-3">
            <div className="overflow-x-auto rounded-lg border border-content-border bg-white shadow-sm">
              <table className="w-full min-w-[760px] border-collapse text-start text-sm">
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
                    <th className="w-32 p-3" scope="col"><HeaderCell>{t('common:table.syncStatus')}</HeaderCell></th>
                    <th className="w-36 p-3" scope="col"><HeaderCell>{t('common:table.action')}</HeaderCell></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => {
                    const selected = selectedIds.has(product.id);
                    const rowBg = selected ? 'bg-surface-muted' : 'bg-white hover:bg-surface-subtle/80';
                    const emoji = CATEGORY_EMOJI[product.category] ?? '📦';
                    const translatedName = t(productKeyByName[product.name] ?? product.name);
                    const translatedCategory = t(categoryKeyByName[product.category] ?? product.category);
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
                        <td className="p-3 align-middle tabular-nums text-[#18171c]">₪{product.price}</td>
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
                              <IconPencil className="shrink-0" />
                              {t('common:actions.edit')}
                            </button>
                            {!product.tagId ? (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-[10px] border border-accent-mint/30 bg-accent-mint/10 px-3 py-1.5 text-xs font-medium text-churn-low shadow-sm"
                              >
                                <IconLink className="shrink-0" />
                                {t('common:actions.assignTag')}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <EditProductModal
        open={modalOpen}
        product={modalProduct}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        onUpdateTag={handleUpdateProduct}
      />
    </>
  );
}
