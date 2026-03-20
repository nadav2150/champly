import { eq } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { products, tags } from './schema.server';

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

export async function listTagsForTable(db: AppDatabase) {
  const rows = await db
    .select({
      tag: tags,
      productName: products.name,
    })
    .from(tags)
    .leftJoin(products, eq(tags.linkedProductId, products.id));

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
  tagInternalId: string,
  productId: string | null,
) {
  await db
    .update(tags)
    .set({ linkedProductId: productId })
    .where(eq(tags.id, tagInternalId));
}
