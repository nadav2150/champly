import { eq } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { tags, zones } from './schema.server';

export async function listZonesWithStats(db: AppDatabase) {
  const zs = await db.select().from(zones);
  const result: Array<{
    id: string;
    name: string;
    storeId: string | null;
    totalTags: number;
    onlineTags: number;
    lowBattery: number;
  }> = [];

  for (const z of zs) {
    const zoneTags = await db.select().from(tags).where(eq(tags.zoneId, z.id));
    const totalTags = zoneTags.length;
    const onlineTags = zoneTags.filter((t) => t.status === 'online').length;
    const lowBattery = zoneTags.filter((t) => t.battery <= 25).length;
    result.push({
      id: z.id,
      name: z.name,
      storeId: z.storeId,
      totalTags,
      onlineTags,
      lowBattery,
    });
  }

  return result;
}
