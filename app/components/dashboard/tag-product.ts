import type { TagSyncStatus } from './tag-status';

/** Catalog row used on the products screen (from D1). */
export type Product = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string;
  unit: 'per_unit' | 'per_kg';
  syncStatus: TagSyncStatus;
  templateId: string | null;
  hardwareTagId: string | null;
};

/** Hardware tag row used on the tags screen (from D1). */
export type Tag = {
  id: string;
  tagId: string;
  linkedProductId: string | null;
  linkedProductName: string | null;
  battery: number;
  signal: 'strong' | 'weak' | 'none';
  status: 'online' | 'offline';
  lastSync: string | null;
};
