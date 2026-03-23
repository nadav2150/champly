import { and, eq, inArray, isNotNull, isNull, or } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { listOwnedProductIds, productOwnedByUser } from './products.server';
import type { TagVisibilityIds } from './stats.server';
import { listZoneIdsForUser } from './stats.server';
import { products, stores, tags, zones } from './schema.server';

export type TagTableRow = {
  id: string;
  tagId: string;
  linkedProductId: string | null;
  linkedProductName: string | null;
  battery: number;
  signal: 'strong' | 'weak' | 'none';
  status: 'online' | 'offline';
  lastSync: string | null;
  zoneId: string | null;
};

export async function tagOwnedByUser(
  db: AppDatabase,
  userId: string,
  tagInternalId: string,
): Promise<boolean> {
  const [tagRow] = await db
    .select()
    .from(tags)
    .where(eq(tags.id, tagInternalId));
  if (!tagRow) {
    return false;
  }

  if (tagRow.zoneId) {
    const [z] = await db
      .select({ id: zones.id })
      .from(zones)
      .innerJoin(stores, eq(zones.storeId, stores.id))
      .where(and(eq(zones.id, tagRow.zoneId), eq(stores.userId, userId)));
    return !!z;
  }

  if (tagRow.linkedProductId) {
    return productOwnedByUser(db, userId, tagRow.linkedProductId);
  }

  return false;
}

export async function listTagsForTable(
  db: AppDatabase,
  userId: string,
  visibilityIds?: TagVisibilityIds,
) {
  const zoneIds =
    visibilityIds?.zoneIds ?? (await listZoneIdsForUser(db, userId));
  const productIds =
    visibilityIds?.productIds ?? (await listOwnedProductIds(db, userId));

  const visibilityClauses: ReturnType<typeof and>[] = [];
  if (zoneIds.length > 0) {
    visibilityClauses.push(
      and(isNotNull(tags.zoneId), inArray(tags.zoneId, zoneIds)),
    );
  }
  if (productIds.length > 0) {
    visibilityClauses.push(
      and(
        isNull(tags.zoneId),
        isNotNull(tags.linkedProductId),
        inArray(tags.linkedProductId, productIds),
      ),
    );
  }

  if (visibilityClauses.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      tag: tags,
      productName: products.name,
    })
    .from(tags)
    .leftJoin(products, eq(tags.linkedProductId, products.id))
    .where(or(...visibilityClauses));

  const out: TagTableRow[] = rows.map(({ tag, productName }) => ({
    id: tag.id,
    tagId: tag.tagId,
    linkedProductId: tag.linkedProductId,
    linkedProductName: productName ?? null,
    battery: tag.battery,
    signal: tag.signal,
    status: tag.status,
    lastSync: tag.lastSync,
    zoneId: tag.zoneId,
  }));
  return out;
}

export async function linkTagToProduct(
  db: AppDatabase,
  userId: string,
  tagInternalId: string,
  productId: string | null,
): Promise<boolean> {
  const okTag = await tagOwnedByUser(db, userId, tagInternalId);
  if (!okTag) {
    return false;
  }
  if (productId) {
    const okProd = await productOwnedByUser(db, userId, productId);
    if (!okProd) {
      return false;
    }
  }
  await db
    .update(tags)
    .set({ linkedProductId: productId })
    .where(eq(tags.id, tagInternalId));
  return true;
}
