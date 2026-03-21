import { drizzle } from 'drizzle-orm/d1';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type { AppLoadContext } from 'react-router';
import * as schema from './schema.server';

export type AppDatabase = DrizzleD1Database<typeof schema>;

export function getDb(context: AppLoadContext): AppDatabase {
  const db = context.cloudflare?.env.DB;
  if (!db) {
    throw new Error('D1 database binding DB is missing');
  }
  return drizzle(db, { schema });
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 1,
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error('Unreachable');
}
