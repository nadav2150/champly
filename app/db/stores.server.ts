import { and, count, eq, inArray } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { products, stores, syncJobs, tags, zones } from './schema.server';

export async function listStoresWithAggregates(db: AppDatabase) {
  const storeList = await db.select().from(stores);
  const out: Array<{
    id: string;
    name: string;
    address: string;
    lastSync: string | null;
    connectedTags: number;
    pendingUpdates: number;
    failedUpdates: number;
  }> = [];

  for (const s of storeList) {
    const [connectedRow] = await db
      .select({ n: count() })
      .from(tags)
      .innerJoin(zones, eq(tags.zoneId, zones.id))
      .where(and(eq(zones.storeId, s.id), eq(tags.status, 'online')));

    const [pendingRow] = await db
      .select({ n: count() })
      .from(products)
      .where(
        and(eq(products.storeId, s.id), eq(products.syncStatus, 'pending')),
      );

    const [failedRow] = await db
      .select({ n: count() })
      .from(products)
      .where(
        and(eq(products.storeId, s.id), eq(products.syncStatus, 'failed')),
      );

    out.push({
      id: s.id,
      name: s.name,
      address: s.address,
      lastSync: s.lastSync,
      connectedTags: connectedRow?.n ?? 0,
      pendingUpdates: pendingRow?.n ?? 0,
      failedUpdates: failedRow?.n ?? 0,
    });
  }

  return out;
}

export type StoreZoneInput = { id?: string; name: string };

export async function getStoreById(db: AppDatabase, storeId: string) {
  const [row] = await db.select().from(stores).where(eq(stores.id, storeId));
  if (!row) {
    return null;
  }

  const storeZones = await db
    .select()
    .from(zones)
    .where(eq(zones.storeId, storeId));

  const assignedProducts = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.storeId, storeId));

  return {
    id: row.id,
    name: row.name,
    address: row.address,
    lastSync: row.lastSync,
    zones: storeZones.map((z) => ({ id: z.id, name: z.name })),
    productIds: assignedProducts.map((p) => p.id),
  };
}

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export async function createStore(
  db: AppDatabase,
  input: {
    name: string;
    address: string;
    zoneNames: string[];
    productIds: string[];
  },
) {
  const storeId = newId('store');

  await db.insert(stores).values({
    id: storeId,
    name: input.name.trim(),
    address: input.address.trim(),
    lastSync: null,
  });

  const trimmedZones = input.zoneNames
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  if (trimmedZones.length > 0) {
    await db.insert(zones).values(
      trimmedZones.map((name) => ({
        id: newId('zone'),
        name,
        storeId,
      })),
    );
  }

  if (input.productIds.length > 0) {
    await db
      .update(products)
      .set({ storeId })
      .where(inArray(products.id, input.productIds));
  }

  return { id: storeId };
}

export async function updateStore(
  db: AppDatabase,
  input: {
    id: string;
    name: string;
    address: string;
    zones: StoreZoneInput[];
    productIds: string[];
  },
) {
  const storeId = input.id;

  await db
    .update(stores)
    .set({
      name: input.name.trim(),
      address: input.address.trim(),
    })
    .where(eq(stores.id, storeId));

  const existingZones = await db
    .select()
    .from(zones)
    .where(eq(zones.storeId, storeId));

  const existingById = new Map(existingZones.map((z) => [z.id, z]));
  const keptIds = new Set(
    input.zones
      .map((z) => z.id)
      .filter((id): id is string => !!id && existingById.has(id)),
  );

  const toRemove = existingZones.filter((z) => !keptIds.has(z.id));
  if (toRemove.length > 0) {
    const removeIds = toRemove.map((z) => z.id);
    await db
      .update(tags)
      .set({ zoneId: null })
      .where(inArray(tags.zoneId, removeIds));
    await db.delete(zones).where(inArray(zones.id, removeIds));
  }

  for (const z of input.zones) {
    if (!z.id || !existingById.has(z.id)) continue;
    const name = z.name.trim();
    if (name.length === 0) continue;
    await db.update(zones).set({ name }).where(eq(zones.id, z.id));
  }

  const newZoneNames = input.zones
    .filter((z) => !z.id || !existingById.has(z.id))
    .map((z) => z.name.trim())
    .filter((n) => n.length > 0);

  if (newZoneNames.length > 0) {
    await db.insert(zones).values(
      newZoneNames.map((name) => ({
        id: newId('zone'),
        name,
        storeId,
      })),
    );
  }

  await db
    .update(products)
    .set({ storeId: null })
    .where(eq(products.storeId, storeId));

  if (input.productIds.length > 0) {
    await db
      .update(products)
      .set({ storeId })
      .where(inArray(products.id, input.productIds));
  }
}

export async function deleteStore(db: AppDatabase, storeId: string) {
  await db.delete(syncJobs).where(eq(syncJobs.storeId, storeId));

  const storeZones = await db
    .select({ id: zones.id })
    .from(zones)
    .where(eq(zones.storeId, storeId));

  if (storeZones.length > 0) {
    const zoneIds = storeZones.map((z) => z.id);
    await db
      .update(tags)
      .set({ zoneId: null })
      .where(inArray(tags.zoneId, zoneIds));
    await db.delete(zones).where(eq(zones.storeId, storeId));
  }

  await db
    .update(products)
    .set({ storeId: null })
    .where(eq(products.storeId, storeId));

  await db.delete(stores).where(eq(stores.id, storeId));
}
