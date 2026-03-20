import type { TagSyncStatus } from './tag-status';

/** Business-layer product (catalog & pricing) */
export type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  unit: 'per_unit' | 'per_kg';
  tagId: string | null;
  syncStatus: TagSyncStatus;
};

/** Hardware-layer tag (physical ESL device) */
export type Tag = {
  id: string;
  tagId: string;
  linkedProduct: string | null;
  battery: number;
  signal: 'strong' | 'weak' | 'none';
  status: 'online' | 'offline';
  lastSync: string;
};

export const PRODUCTS_DATA: Product[] = [
  { id: 'p1', name: 'Tomato', price: '6.90', category: 'Fruits & Vegetables', unit: 'per_kg', tagId: '300001', syncStatus: 'updated' },
  { id: 'p2', name: 'Banana', price: '5.20', category: 'Fruits & Vegetables', unit: 'per_kg', tagId: '300002', syncStatus: 'pending' },
  { id: 'p3', name: 'Apple', price: '7.50', category: 'Fruits & Vegetables', unit: 'per_kg', tagId: '300003', syncStatus: 'failed' },
  { id: 'p4', name: 'Milk 1L', price: '6.90', category: 'Dairy', unit: 'per_unit', tagId: '300004', syncStatus: 'updated' },
  { id: 'p5', name: 'Cottage Cheese', price: '5.40', category: 'Dairy', unit: 'per_unit', tagId: '300005', syncStatus: 'updated' },
  { id: 'p6', name: 'Orange Juice', price: '12.90', category: 'Drinks', unit: 'per_unit', tagId: '300006', syncStatus: 'pending' },
  { id: 'p7', name: 'White Bread', price: '7.50', category: 'Bakery', unit: 'per_unit', tagId: '300007', syncStatus: 'updated' },
  { id: 'p8', name: 'Chocolate Bar', price: '4.90', category: 'Snacks & Sweets', unit: 'per_unit', tagId: '300008', syncStatus: 'updated' },
  { id: 'p9', name: 'Water 1.5L', price: '3.50', category: 'Drinks', unit: 'per_unit', tagId: '300009', syncStatus: 'updated' },
  { id: 'p10', name: 'Potato Chips', price: '8.90', category: 'Snacks & Sweets', unit: 'per_unit', tagId: '300010', syncStatus: 'failed' },
  { id: 'p11', name: 'Cucumber', price: '4.50', category: 'Fruits & Vegetables', unit: 'per_kg', tagId: null, syncStatus: 'updated' },
  { id: 'p12', name: 'Greek Yogurt', price: '8.90', category: 'Dairy', unit: 'per_unit', tagId: null, syncStatus: 'updated' },
];

export const TAGS_DATA: Tag[] = [
  { id: 't1', tagId: '300001', linkedProduct: 'Tomato', battery: 85, signal: 'strong', status: 'online', lastSync: '2 min ago' },
  { id: 't2', tagId: '300002', linkedProduct: 'Banana', battery: 70, signal: 'strong', status: 'online', lastSync: '5 min ago' },
  { id: 't3', tagId: '300003', linkedProduct: 'Apple', battery: 60, signal: 'weak', status: 'offline', lastSync: '1 hr ago' },
  { id: 't4', tagId: '300004', linkedProduct: 'Milk 1L', battery: 92, signal: 'strong', status: 'online', lastSync: '30 sec ago' },
  { id: 't5', tagId: '300005', linkedProduct: 'Cottage Cheese', battery: 78, signal: 'strong', status: 'online', lastSync: '4 min ago' },
  { id: 't6', tagId: '300006', linkedProduct: 'Orange Juice', battery: 55, signal: 'weak', status: 'online', lastSync: '12 min ago' },
  { id: 't7', tagId: '300007', linkedProduct: 'White Bread', battery: 88, signal: 'strong', status: 'online', lastSync: '1 min ago' },
  { id: 't8', tagId: '300008', linkedProduct: 'Chocolate Bar', battery: 72, signal: 'strong', status: 'online', lastSync: '8 min ago' },
  { id: 't9', tagId: '300009', linkedProduct: 'Water 1.5L', battery: 95, signal: 'strong', status: 'online', lastSync: '3 min ago' },
  { id: 't10', tagId: '300010', linkedProduct: 'Potato Chips', battery: 42, signal: 'none', status: 'offline', lastSync: '2 hr ago' },
  { id: 't11', tagId: '300011', linkedProduct: null, battery: 18, signal: 'weak', status: 'online', lastSync: '20 min ago' },
  { id: 't12', tagId: '300012', linkedProduct: null, battery: 65, signal: 'strong', status: 'online', lastSync: '6 min ago' },
];
