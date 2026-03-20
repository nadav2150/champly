import type { Route } from './+types/stores';
import { useCallback, useMemo, useState } from 'react';
import { data, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { CreateStoreModal } from '../components/dashboard/create-store-modal';
import { DeleteStoreDialog } from '../components/dashboard/delete-store-dialog';
import {
  EditStoreModal,
  type EditStoreDetail,
} from '../components/dashboard/edit-store-modal';
import {
  StoreCard,
  type StoreCardData,
} from '../components/dashboard/store-card';
import { getDb } from '../db/client.server';
import {
  allProductIdsOwnedByUser,
  listProductsWithStoreForAssignment,
} from '../db/products.server';
import {
  createStore,
  deleteStore,
  getStoreById,
  listStoresWithAggregates,
  type StoreZoneInput,
  updateStore,
} from '../db/stores.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';

function parseStringIdArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function parseZoneNamesCreate(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .map((x) => String(x).trim())
      .filter((n) => n.length > 0);
  } catch {
    return [];
  }
}

function parseZonesUpdate(raw: string): StoreZoneInput[] {
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v
      .filter(
        (item): item is { id?: unknown; name: unknown } =>
          !!item &&
          typeof item === 'object' &&
          'name' in item &&
          typeof (item as { name: unknown }).name === 'string',
      )
      .map((item) => {
        const idRaw = (item as { id?: unknown }).id;
        const id =
          typeof idRaw === 'string' && idRaw.length > 0 ? idRaw : undefined;
        return { id, name: String((item as { name: string }).name) };
      });
  } catch {
    return [];
  }
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);
  const [stores, catalogProducts] = await Promise.all([
    listStoresWithAggregates(db, user.id),
    listProductsWithStoreForAssignment(db, user.id),
  ]);

  const details = await Promise.all(
    stores.map((s) => getStoreById(db, user.id, s.id)),
  );

  const editStoreById: Record<string, EditStoreDetail> = {};
  for (let i = 0; i < stores.length; i++) {
    const d = details[i];
    if (d) {
      editStoreById[stores[i].id] = {
        id: d.id,
        name: d.name,
        address: d.address,
        zones: d.zones,
        productIds: d.productIds,
      };
    }
  }

  const storeNameById = Object.fromEntries(
    stores.map((s) => [s.id, s.name] as const),
  );

  return data(
    { stores, catalogProducts, storeNameById, editStoreById },
    { headers },
  );
}

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const db = getDb(context);

  if (intent === 'create-store') {
    const name = String(formData.get('name') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    if (!name || !address) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const zoneNames = parseZoneNamesCreate(
      String(formData.get('zonesJson') ?? '[]'),
    );
    const productIds = parseStringIdArray(
      String(formData.get('productIdsJson') ?? '[]'),
    );
    if (productIds.length > 0) {
      const allOwned = await allProductIdsOwnedByUser(db, user.id, productIds);
      if (!allOwned) {
        return data({ ok: false as const, error: 'forbidden' }, { headers });
      }
    }
    await createStore(db, {
      userId: user.id,
      name,
      address,
      zoneNames,
      productIds,
    });
    return data({ ok: true as const }, { headers });
  }

  if (intent === 'update-store') {
    const id = String(formData.get('id') ?? '').trim();
    const name = String(formData.get('name') ?? '').trim();
    const address = String(formData.get('address') ?? '').trim();
    if (!id || !name || !address) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const zones = parseZonesUpdate(String(formData.get('zonesJson') ?? '[]'));
    const productIds = parseStringIdArray(
      String(formData.get('productIdsJson') ?? '[]'),
    );
    const updated = await updateStore(db, user.id, {
      id,
      name,
      address,
      zones,
      productIds,
    });
    if (!updated) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
    }
    return data({ ok: true as const }, { headers });
  }

  if (intent === 'delete-store') {
    const id = String(formData.get('id') ?? '').trim();
    if (!id) {
      return data({ ok: false as const, error: 'validation' }, { headers });
    }
    const deleted = await deleteStore(db, user.id, id);
    if (!deleted) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
    }
    return data({ ok: true as const }, { headers });
  }

  return data({ ok: false as const, error: 'unknown' }, { headers });
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'סניפים' : 'Stores' },
    {
      name: 'description',
      content: isHebrew
        ? 'ניהול מיקומי סניפים ורכזות ESL.'
        : 'Manage store locations and ESL hubs.',
    },
  ];
}

export default function StoresPage() {
  const { t } = useTranslation('stores');
  const { stores, catalogProducts, storeNameById, editStoreById } =
    useLoaderData<typeof loader>();

  const [createOpen, setCreateOpen] = useState(false);
  const [editStoreId, setEditStoreId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const editStore = editStoreId ? editStoreById[editStoreId] ?? null : null;

  const handleEdit = useCallback((id: string) => {
    setEditStoreId(id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const row = stores.find((s) => s.id === id);
    setDeleteTarget({ id, name: row?.name ?? id });
  }, [stores]);

  const closeEdit = useCallback(() => setEditStoreId(null), []);
  const closeDelete = useCallback(() => setDeleteTarget(null), []);

  const deleteName = useMemo(
    () => deleteTarget?.name ?? '',
    [deleteTarget?.name],
  );

  return (
    <div className="flex w-full flex-1 flex-col overflow-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <section
        className="w-full max-w-none rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]"
        aria-labelledby="stores-heading"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1
              id="stores-heading"
              className="text-3xl font-medium text-white md:text-4xl"
            >
              {t('heading')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/50">
              {t('description')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="shrink-0 rounded-full border border-white bg-accent-mint px-4 py-2.5 text-sm font-semibold text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] transition hover:brightness-95 sm:mt-1"
          >
            {t('createStore')}
          </button>
        </div>
      </section>
      {stores.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-dashboard-border bg-dashboard-card">
            <span className="text-3xl">🏪</span>
          </div>
          <h2 className="text-xl font-medium text-white">{t('empty.title')}</h2>
          <p className="max-w-sm text-sm text-white/50">{t('empty.description')}</p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="mt-2 rounded-full border border-white bg-accent-mint px-5 py-2.5 text-sm font-semibold text-accent-mint-text shadow-[0px_0px_0px_1px_#162021] transition hover:brightness-95"
          >
            {t('createStore')}
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-2">
          {stores.map((s) => {
            const card: StoreCardData = {
              id: s.id,
              name: s.name,
              address: s.address,
              connectedTags: s.connectedTags,
              pendingUpdates: s.pendingUpdates,
              failedUpdates: s.failedUpdates,
              lastSync: s.lastSync ?? '—',
            };
            return (
              <StoreCard
                key={s.id}
                store={card}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

      <CreateStoreModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        products={catalogProducts}
        storeNameById={storeNameById}
      />
      <EditStoreModal
        open={editStoreId !== null}
        store={editStore}
        onClose={closeEdit}
        products={catalogProducts}
        storeNameById={storeNameById}
      />
      <DeleteStoreDialog
        open={deleteTarget !== null}
        storeId={deleteTarget?.id ?? null}
        storeName={deleteName}
        onClose={closeDelete}
      />
    </div>
  );
}
