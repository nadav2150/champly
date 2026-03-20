import type { AppDatabase } from './client.server';
import { templates } from './schema.server';

export async function listTemplatesForSelect(db: AppDatabase) {
  return db.select({ id: templates.id, name: templates.name }).from(templates);
}
