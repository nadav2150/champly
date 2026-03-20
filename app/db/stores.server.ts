import { and, count, eq } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { products, stores, tags, zones } from './schema.server';

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
