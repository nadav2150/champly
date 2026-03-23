import {
  and,
  count,
  eq,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
} from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { listOwnedProductIds, productOwnedByUserOr } from './products.server';
import { categories, products, stores, tags, zones } from './schema.server';

/** Pre-fetched IDs for tag visibility queries (avoids duplicate D1 round-trips). */
export type TagVisibilityIds = {
  zoneIds: string[];
  productIds: string[];
};

export async function listZoneIdsForUser(db: AppDatabase, userId: string) {
  const rows = await db
    .select({ id: zones.id })
    .from(zones)
    .innerJoin(stores, eq(zones.storeId, stores.id))
    .where(eq(stores.userId, userId));
  return rows.map((r) => r.id);
}

function tagVisibilityOr(zoneIds: string[], productIds: string[]) {
  const parts: ReturnType<typeof and>[] = [];
  if (zoneIds.length > 0) {
    parts.push(and(isNotNull(tags.zoneId), inArray(tags.zoneId, zoneIds)));
  }
  if (productIds.length > 0) {
    parts.push(
      and(
        isNull(tags.zoneId),
        isNotNull(tags.linkedProductId),
        inArray(tags.linkedProductId, productIds),
      ),
    );
  }
  return parts.length > 0 ? or(...parts) : null;
}

export async function getDashboardStats(db: AppDatabase, userId: string) {
  const [totalProducts] = await db
    .select({ n: count() })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(productOwnedByUserOr(userId));

  const zoneIds = await listZoneIdsForUser(db, userId);
  const productIds = await listOwnedProductIds(db, userId);
  const tagVis = tagVisibilityOr(zoneIds, productIds);

  const emptyTagStats = {
    connectedTags: 0,
    lowBattery: 0,
    offlineTags: 0,
  };

  if (!tagVis) {
    return {
      totalProducts: totalProducts?.n ?? 0,
      ...emptyTagStats,
    };
  }

  const [connectedTags] = await db
    .select({ n: count() })
    .from(tags)
    .where(and(eq(tags.status, 'online'), tagVis));

  const [lowBattery] = await db
    .select({ n: count() })
    .from(tags)
    .where(and(lte(tags.battery, 25), tagVis));

  const [offlineTags] = await db
    .select({ n: count() })
    .from(tags)
    .where(and(eq(tags.status, 'offline'), tagVis));

  return {
    totalProducts: totalProducts?.n ?? 0,
    connectedTags: connectedTags?.n ?? 0,
    lowBattery: lowBattery?.n ?? 0,
    offlineTags: offlineTags?.n ?? 0,
  };
}

export async function getProductHeaderStats(db: AppDatabase, userId: string) {
  const [total] = await db
    .select({ n: count() })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(productOwnedByUserOr(userId));

  const [pending] = await db
    .select({ n: count() })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(
      and(eq(products.syncStatus, 'pending'), productOwnedByUserOr(userId)),
    );

  const [failed] = await db
    .select({ n: count() })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(
      and(eq(products.syncStatus, 'failed'), productOwnedByUserOr(userId)),
    );

  return {
    total: total?.n ?? 0,
    pending: pending?.n ?? 0,
    failed: failed?.n ?? 0,
  };
}

export async function getTagHeaderStats(
  db: AppDatabase,
  userId: string,
  visibilityIds?: TagVisibilityIds,
) {
  const zoneIds =
    visibilityIds?.zoneIds ?? (await listZoneIdsForUser(db, userId));
  const productIds =
    visibilityIds?.productIds ?? (await listOwnedProductIds(db, userId));
  const tagVis = tagVisibilityOr(zoneIds, productIds);

  const zeros = { online: 0, lowBattery: 0, offline: 0, total: 0 };
  if (!tagVis) {
    return zeros;
  }

  const [online] = await db
    .select({ n: count() })
    .from(tags)
    .where(and(eq(tags.status, 'online'), tagVis));

  const [lowBattery] = await db
    .select({ n: count() })
    .from(tags)
    .where(and(lte(tags.battery, 25), tagVis));

  const [offline] = await db
    .select({ n: count() })
    .from(tags)
    .where(and(eq(tags.status, 'offline'), tagVis));

  const [total] = await db
    .select({ n: count() })
    .from(tags)
    .where(tagVis);

  return {
    online: online?.n ?? 0,
    lowBattery: lowBattery?.n ?? 0,
    offline: offline?.n ?? 0,
    total: total?.n ?? 0,
  };
}
