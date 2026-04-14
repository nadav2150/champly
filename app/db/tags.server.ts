import { and, eq, inArray, isNotNull, isNull, or } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { listOwnedProductIds, productOwnedByUser } from './products.server';
import type { TagVisibilityIds } from './stats.server';
import { listZoneIdsForUser } from './stats.server';
import { gateways, products, stores, tagCommands, tags, zones } from './schema.server';

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
  mac: string | null;
  bleKey: string | null;
  rssi: number | null;
  lastAdvertised: string | null;
  gatewayId: string | null;
  firmwareVersion: string | null;
  tagModel: string | null;
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
    mac: tag.mac,
    bleKey: tag.bleKey,
    rssi: tag.rssi,
    lastAdvertised: tag.lastAdvertised,
    gatewayId: tag.gatewayId,
    firmwareVersion: tag.firmwareVersion,
    tagModel: tag.tagModel,
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

export async function getTagByMac(
  db: AppDatabase,
  mac: string,
): Promise<TagTableRow | null> {
  const rows = await db
    .select({ tag: tags, productName: products.name })
    .from(tags)
    .leftJoin(products, eq(tags.linkedProductId, products.id))
    .where(eq(tags.mac, mac));

  if (rows.length === 0) return null;
  const { tag, productName } = rows[0];
  return {
    id: tag.id,
    tagId: tag.tagId,
    linkedProductId: tag.linkedProductId,
    linkedProductName: productName ?? null,
    battery: tag.battery,
    signal: tag.signal,
    status: tag.status,
    lastSync: tag.lastSync,
    zoneId: tag.zoneId,
    mac: tag.mac,
    bleKey: tag.bleKey,
    rssi: tag.rssi,
    lastAdvertised: tag.lastAdvertised,
    gatewayId: tag.gatewayId,
    firmwareVersion: tag.firmwareVersion,
    tagModel: tag.tagModel,
  };
}

export async function registerTag(
  db: AppDatabase,
  id: string,
  mac: string,
  bleKey: string,
  gatewayId: string,
): Promise<void> {
  await db.insert(tags).values({
    id,
    tagId: mac,
    mac,
    bleKey,
    gatewayId,
    status: 'offline',
    battery: 100,
    signal: 'none',
  });
}

export async function updateTagKey(
  db: AppDatabase,
  tagInternalId: string,
  bleKey: string,
): Promise<void> {
  await db
    .update(tags)
    .set({ bleKey })
    .where(eq(tags.id, tagInternalId));
}

export async function setTagModel(
  db: AppDatabase,
  tagInternalId: string,
  tagModel: string,
): Promise<void> {
  await db
    .update(tags)
    .set({ tagModel })
    .where(eq(tags.id, tagInternalId));
}

export async function getGatewayStatus(db: AppDatabase) {
  const rows = await db
    .select({
      id: gateways.id,
      apId: gateways.apId,
      alias: gateways.alias,
      mac: gateways.mac,
      status: gateways.status,
      lastSeen: gateways.lastSeen,
    })
    .from(gateways);
  return rows;
}

export async function listAllTags(db: AppDatabase) {
  const rows = await db
    .select({ tag: tags, productName: products.name })
    .from(tags)
    .leftJoin(products, eq(tags.linkedProductId, products.id));

  return rows.map(({ tag, productName }) => ({
    id: tag.id,
    tagId: tag.tagId,
    linkedProductId: tag.linkedProductId,
    linkedProductName: productName ?? null,
    battery: tag.battery,
    signal: tag.signal,
    status: tag.status,
    lastSync: tag.lastSync,
    zoneId: tag.zoneId,
    mac: tag.mac,
    bleKey: tag.bleKey,
    rssi: tag.rssi,
    lastAdvertised: tag.lastAdvertised,
    gatewayId: tag.gatewayId,
    firmwareVersion: tag.firmwareVersion,
    tagModel: tag.tagModel,
  }));
}

export async function getRecentCommands(db: AppDatabase, mac: string) {
  return db
    .select()
    .from(tagCommands)
    .where(eq(tagCommands.mac, mac))
    .orderBy(tagCommands.createdAt)
    .limit(20);
}
