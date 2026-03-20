import { and, asc, eq, inArray } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { categories, products, tags } from './schema.server';

export type ProductTableRow = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  unit: 'per_unit' | 'per_kg';
  syncStatus: 'updated' | 'pending' | 'failed';
  templateId: string | null;
  hardwareTagId: string | null;
};

export async function listProductsForTable(db: AppDatabase) {
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categoryIcon: categories.icon,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  const allTags = await db.select().from(tags);
  const tagByProduct = new Map<string, string>();
  for (const t of allTags) {
    if (t.linkedProductId) {
      tagByProduct.set(t.linkedProductId, t.tagId);
    }
  }

  const out: ProductTableRow[] = rows.map(
    ({ product, categoryName, categoryIcon }) => ({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      categoryId: product.categoryId,
      categoryName: categoryName ?? '',
      categoryIcon: categoryIcon ?? '📦',
      unit: product.unit,
      syncStatus: product.syncStatus,
      templateId: product.templateId,
      hardwareTagId: tagByProduct.get(product.id) ?? null,
    }),
  );
  return out;
}

export async function listProductPairOptions(db: AppDatabase) {
  return db
    .select({ id: products.id, name: products.name })
    .from(products)
    .orderBy(asc(products.name));
}

export async function updateProductFields(
  db: AppDatabase,
  input: {
    id: string;
    name: string;
    priceCents: number;
    unit: 'per_unit' | 'per_kg';
    templateId: string | null;
  },
) {
  await db
    .update(products)
    .set({
      name: input.name,
      priceCents: input.priceCents,
      unit: input.unit,
      templateId: input.templateId,
      syncStatus: 'pending',
    })
    .where(eq(products.id, input.id));
}

export async function bulkSetProductsPending(db: AppDatabase, ids: string[]) {
  if (ids.length === 0) return;
  await db
    .update(products)
    .set({ syncStatus: 'pending' })
    .where(inArray(products.id, ids));
}
