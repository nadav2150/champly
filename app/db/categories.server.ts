import { and, count, eq } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { categories, products, tags } from './schema.server';

export async function listCategoriesWithCounts(db: AppDatabase) {
  const cats = await db.select().from(categories);
  const rows: Array<{
    id: string;
    name: string;
    icon: string;
    productCount: number;
    connectedTags: number;
    pendingTags: number;
  }> = [];

  for (const c of cats) {
    const [pc] = await db
      .select({ n: count() })
      .from(products)
      .where(eq(products.categoryId, c.id));
    const [pending] = await db
      .select({ n: count() })
      .from(products)
      .where(
        and(eq(products.categoryId, c.id), eq(products.syncStatus, 'pending')),
      );

    const [linked] = await db
      .select({ n: count() })
      .from(tags)
      .innerJoin(products, eq(tags.linkedProductId, products.id))
      .where(eq(products.categoryId, c.id));

    const productCount = pc?.n ?? 0;
    const pendingTags = pending?.n ?? 0;
    const connectedTags = linked?.n ?? 0;

    rows.push({
      id: c.id,
      name: c.name,
      icon: c.icon,
      productCount,
      connectedTags,
      pendingTags,
    });
  }

  return rows;
}
