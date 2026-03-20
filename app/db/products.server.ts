import { and, asc, eq, inArray, isNotNull, or } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { categories, products, stores, syncJobs, tags } from './schema.server';

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

export function productOwnedByUserOr(userId: string) {
  return or(
    and(isNotNull(products.storeId), eq(stores.userId, userId)),
    and(isNotNull(products.categoryId), eq(categories.userId, userId)),
  );
}

export async function listOwnedProductIds(
  db: AppDatabase,
  userId: string,
): Promise<string[]> {
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(productOwnedByUserOr(userId));
  return rows.map((r) => r.id);
}

export async function filterProductIdsOwnedByUser(
  db: AppDatabase,
  userId: string,
  ids: string[],
): Promise<string[]> {
  if (ids.length === 0) return [];
  const rows = await db
    .select({ id: products.id })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(inArray(products.id, ids), productOwnedByUserOr(userId)));
  return rows.map((r) => r.id);
}

export async function allProductIdsOwnedByUser(
  db: AppDatabase,
  userId: string,
  ids: string[],
): Promise<boolean> {
  if (ids.length === 0) return true;
  const owned = await filterProductIdsOwnedByUser(db, userId, ids);
  return owned.length === ids.length;
}

export async function productOwnedByUser(
  db: AppDatabase,
  userId: string,
  productId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ id: products.id })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.id, productId), productOwnedByUserOr(userId)));
  return !!row;
}

export async function listProductsForTable(db: AppDatabase, userId: string) {
  const rows = await db
    .select({
      product: products,
      categoryName: categories.name,
      categoryIcon: categories.icon,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(productOwnedByUserOr(userId));

  const ownedIds = new Set(rows.map((r) => r.product.id));
  const allTags = await db.select().from(tags);
  const tagByProduct = new Map<string, string>();
  for (const t of allTags) {
    if (t.linkedProductId && ownedIds.has(t.linkedProductId)) {
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

export async function listProductPairOptions(db: AppDatabase, userId: string) {
  return db
    .select({ id: products.id, name: products.name })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(productOwnedByUserOr(userId))
    .orderBy(asc(products.name));
}

export async function listProductsWithStoreForAssignment(
  db: AppDatabase,
  userId: string,
) {
  return db
    .select({
      id: products.id,
      name: products.name,
      storeId: products.storeId,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(productOwnedByUserOr(userId))
    .orderBy(asc(products.name));
}

function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '')}`;
}

export async function createProduct(
  db: AppDatabase,
  input: {
    userId: string;
    name: string;
    priceCents: number;
    currency?: string;
    unit: 'per_unit' | 'per_kg';
    categoryId: string | null;
    storeId?: string | null;
    templateId?: string | null;
  },
): Promise<{ id: string } | { error: 'validation' }> {
  if (!input.storeId && !input.categoryId) {
    return { error: 'validation' };
  }

  if (input.storeId) {
    const [s] = await db
      .select({ id: stores.id })
      .from(stores)
      .where(
        and(eq(stores.id, input.storeId), eq(stores.userId, input.userId)),
      );
    if (!s) {
      return { error: 'validation' };
    }
  }

  if (input.categoryId) {
    const [c] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(
          eq(categories.id, input.categoryId),
          eq(categories.userId, input.userId),
        ),
      );
    if (!c) {
      return { error: 'validation' };
    }
  }

  const id = newId('prod');
  await db.insert(products).values({
    id,
    name: input.name.trim(),
    priceCents: input.priceCents,
    currency: input.currency ?? 'ILS',
    storeId: input.storeId ?? null,
    categoryId: input.categoryId,
    unit: input.unit,
    syncStatus: 'pending',
    templateId: input.templateId ?? null,
  });
  return { id };
}

export async function deleteProduct(
  db: AppDatabase,
  userId: string,
  productId: string,
): Promise<boolean> {
  const ok = await productOwnedByUser(db, userId, productId);
  if (!ok) return false;
  await db.delete(syncJobs).where(eq(syncJobs.productId, productId));
  await db
    .update(tags)
    .set({ linkedProductId: null })
    .where(eq(tags.linkedProductId, productId));
  await db.delete(products).where(eq(products.id, productId));
  return true;
}

export async function updateProductFields(
  db: AppDatabase,
  userId: string,
  input: {
    id: string;
    name: string;
    priceCents: number;
    unit: 'per_unit' | 'per_kg';
    templateId: string | null;
    categoryId: string | null;
  },
): Promise<boolean> {
  const ok = await productOwnedByUser(db, userId, input.id);
  if (!ok) return false;

  if (input.categoryId) {
    const [c] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(
          eq(categories.id, input.categoryId),
          eq(categories.userId, userId),
        ),
      );
    if (!c) return false;
  }

  await db
    .update(products)
    .set({
      name: input.name,
      priceCents: input.priceCents,
      unit: input.unit,
      templateId: input.templateId,
      categoryId: input.categoryId,
      syncStatus: 'pending',
    })
    .where(eq(products.id, input.id));
  return true;
}

export async function bulkSetProductsPending(
  db: AppDatabase,
  userId: string,
  ids: string[],
) {
  if (ids.length === 0) return;
  const owned = await filterProductIdsOwnedByUser(db, userId, ids);
  if (owned.length === 0) return;
  await db
    .update(products)
    .set({ syncStatus: 'pending' })
    .where(inArray(products.id, owned));
}
