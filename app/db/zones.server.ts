import { eq, inArray } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { stores, tags, zones } from './schema.server';

export async function listZonesWithStats(db: AppDatabase, userId: string) {
  const zs = await db
    .select()
    .from(zones)
    .innerJoin(stores, eq(zones.storeId, stores.id))
    .where(eq(stores.userId, userId));

  if (zs.length === 0) {
    return [];
  }

  const zoneIds = zs.map((row) => row.zones.id);
  const allZoneTags = await db
    .select()
    .from(tags)
    .where(inArray(tags.zoneId, zoneIds));

  const tagsByZoneId = new Map<string, typeof allZoneTags>();
  for (const t of allZoneTags) {
    if (!t.zoneId) continue;
    const list = tagsByZoneId.get(t.zoneId) ?? [];
    list.push(t);
    tagsByZoneId.set(t.zoneId, list);
  }

  return zs.map(({ zones: z }) => {
    const zoneTags = tagsByZoneId.get(z.id) ?? [];
    return {
      id: z.id,
      name: z.name,
      storeId: z.storeId,
      totalTags: zoneTags.length,
      onlineTags: zoneTags.filter((t) => t.status === 'online').length,
      lowBattery: zoneTags.filter((t) => t.battery <= 25).length,
    };
  });
}
