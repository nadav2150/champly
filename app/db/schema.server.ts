import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stores = sqliteTable(
  'stores',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    lastSync: text('last_sync'),
  },
  (table) => ({
    userIdx: index('idx_stores_user_id').on(table.userId),
  }),
);

export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    icon: text('icon').notNull(),
  },
  (table) => ({
    userIdx: index('idx_categories_user_id').on(table.userId),
  }),
);

export const zones = sqliteTable('zones', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  storeId: text('store_id').references(() => stores.id),
});

export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  kind: text('kind').notNull(),
  createdAt: text('created_at').notNull(),
});

export const templateVariants = sqliteTable('template_variants', {
  id: text('id').primaryKey(),
  templateId: text('template_id')
    .notNull()
    .references(() => templates.id),
  tagModel: text('tag_model').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  layoutJson: text('layout_json').notNull(),
  previewUrl: text('preview_url'),
});

export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    priceCents: integer('price_cents').notNull(),
    currency: text('currency').notNull().default('ILS'),
    storeId: text('store_id').references(() => stores.id),
    categoryId: text('category_id').references(() => categories.id),
    unit: text('unit', { enum: ['per_unit', 'per_kg'] }).notNull(),
    syncStatus: text('sync_status', {
      enum: ['updated', 'pending', 'failed'],
    })
      .notNull()
      .default('updated'),
    templateId: text('template_id').references(() => templates.id),
  },
  (table) => ({
    categoryIdx: index('idx_products_category_id').on(table.categoryId),
    templateIdx: index('idx_products_template_id').on(table.templateId),
    storeIdx: index('idx_products_store_id').on(table.storeId),
  }),
);

export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey(),
    tagId: text('tag_id').notNull().unique(),
    linkedProductId: text('linked_product_id').references(() => products.id),
    battery: integer('battery').notNull().default(100),
    signal: text('signal', { enum: ['strong', 'weak', 'none'] })
      .notNull()
      .default('strong'),
    status: text('status', { enum: ['online', 'offline'] })
      .notNull()
      .default('online'),
    lastSync: text('last_sync'),
    zoneId: text('zone_id').references(() => zones.id),
  },
  (table) => ({
    zoneIdx: index('idx_tags_zone_id').on(table.zoneId),
    linkedProductIdx: index('idx_tags_linked_product_id').on(
      table.linkedProductId,
    ),
  }),
);

export const syncJobs = sqliteTable(
  'sync_jobs',
  {
    id: text('id').primaryKey(),
    storeId: text('store_id')
      .notNull()
      .references(() => stores.id),
    productId: text('product_id').references(() => products.id),
    tagId: text('tag_id').references(() => tags.id),
    token: integer('token'),
    status: text('status', {
      enum: ['pending', 'sent', 'acked', 'failed'],
    }).notNull(),
    errorMessage: text('error_message'),
    createdAt: text('created_at').notNull(),
    sentAt: text('sent_at'),
    completedAt: text('completed_at'),
  },
  (table) => ({
    statusIdx: index('idx_sync_jobs_status').on(table.status),
  }),
);
