import { eq, sql } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { categories, products, tags } from './schema.server';

export async function listCategoriesWithCounts(
  db: AppDatabase,
  userId: string,
) {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      icon: categories.icon,
      productCount: sql<number>`(SELECT count(*) FROM ${products} WHERE ${products.categoryId} = ${categories.id})`,
      pendingTags: sql<number>`(SELECT count(*) FROM ${products} WHERE ${products.categoryId} = ${categories.id} AND ${products.syncStatus} = 'pending')`,
      connectedTags: sql<number>`(SELECT count(*) FROM ${tags} INNER JOIN ${products} ON ${tags.linkedProductId} = ${products.id} WHERE ${products.categoryId} = ${categories.id})`,
    })
    .from(categories)
    .where(eq(categories.userId, userId));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    icon: r.icon,
    productCount: Number(r.productCount ?? 0),
    pendingTags: Number(r.pendingTags ?? 0),
    connectedTags: Number(r.connectedTags ?? 0),
  }));
}

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export async function createCategory(
  db: AppDatabase,
  input: { userId: string; name: string; icon: string },
) {
  const id = newId('cat');
  const name = input.name.trim();
  const icon = input.icon.trim() || '📦';
  await db.insert(categories).values({
    id,
    userId: input.userId,
    name,
    icon,
  });
  return { id, name, icon };
}
