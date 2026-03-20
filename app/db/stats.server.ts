import { count, eq, lte } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { products, tags } from './schema.server';

export async function getDashboardStats(db: AppDatabase) {
  const [totalProducts] = await db.select({ n: count() }).from(products);

  const [connectedTags] = await db
    .select({ n: count() })
    .from(tags)
    .where(eq(tags.status, 'online'));

  const [lowBattery] = await db
    .select({ n: count() })
    .from(tags)
    .where(lte(tags.battery, 25));

  const [offlineTags] = await db
    .select({ n: count() })
    .from(tags)
    .where(eq(tags.status, 'offline'));

  return {
    totalProducts: totalProducts?.n ?? 0,
    connectedTags: connectedTags?.n ?? 0,
    lowBattery: lowBattery?.n ?? 0,
    offlineTags: offlineTags?.n ?? 0,
  };
}

export async function getProductHeaderStats(db: AppDatabase) {
  const [total] = await db.select({ n: count() }).from(products);
  const [pending] = await db
    .select({ n: count() })
    .from(products)
    .where(eq(products.syncStatus, 'pending'));
  const [failed] = await db
    .select({ n: count() })
    .from(products)
    .where(eq(products.syncStatus, 'failed'));
  return {
    total: total?.n ?? 0,
    pending: pending?.n ?? 0,
    failed: failed?.n ?? 0,
  };
}

export async function getTagHeaderStats(db: AppDatabase) {
  const [online] = await db
    .select({ n: count() })
    .from(tags)
    .where(eq(tags.status, 'online'));
  const [lowBattery] = await db
    .select({ n: count() })
    .from(tags)
    .where(lte(tags.battery, 25));
  const [offline] = await db
    .select({ n: count() })
    .from(tags)
    .where(eq(tags.status, 'offline'));
  const [total] = await db.select({ n: count() }).from(tags);
  return {
    online: online?.n ?? 0,
    lowBattery: lowBattery?.n ?? 0,
    offline: offline?.n ?? 0,
    total: total?.n ?? 0,
  };
}
