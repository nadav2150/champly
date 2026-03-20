import { asc, count, eq } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { products, templates, templateVariants } from './schema.server';

export type TemplateRow = {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  createdAt: string;
  variantCount: number;
  linkedProductCount: number;
  firstVariant: {
    layoutJson: string;
    width: number;
    height: number;
    tagModel: string;
  } | null;
};

export type TemplateSelectRow = {
  id: string;
  name: string;
  layoutJson: string | null;
};

export async function listTemplatesForSelect(
  db: AppDatabase,
): Promise<TemplateSelectRow[]> {
  const allTemplates = await db
    .select({ id: templates.id, name: templates.name })
    .from(templates);

  const out: TemplateSelectRow[] = [];
  for (const t of allTemplates) {
    const [first] = await db
      .select({
        layoutJson: templateVariants.layoutJson,
      })
      .from(templateVariants)
      .where(eq(templateVariants.templateId, t.id))
      .orderBy(asc(templateVariants.id))
      .limit(1);
    out.push({
      id: t.id,
      name: t.name,
      layoutJson: first?.layoutJson ?? null,
    });
  }
  return out;
}

export async function listTemplatesWithVariants(
  db: AppDatabase,
): Promise<TemplateRow[]> {
  const all = await db.select().from(templates);
  const out: TemplateRow[] = [];

  for (const t of all) {
    const [variantRow] = await db
      .select({ n: count() })
      .from(templateVariants)
      .where(eq(templateVariants.templateId, t.id));

    const [productRow] = await db
      .select({ n: count() })
      .from(products)
      .where(eq(products.templateId, t.id));

    const [first] = await db
      .select({
        layoutJson: templateVariants.layoutJson,
        width: templateVariants.width,
        height: templateVariants.height,
        tagModel: templateVariants.tagModel,
      })
      .from(templateVariants)
      .where(eq(templateVariants.templateId, t.id))
      .orderBy(asc(templateVariants.id))
      .limit(1);

    out.push({
      id: t.id,
      name: t.name,
      description: t.description,
      kind: t.kind,
      createdAt: t.createdAt,
      variantCount: variantRow?.n ?? 0,
      linkedProductCount: productRow?.n ?? 0,
      firstVariant: first
        ? {
            layoutJson: first.layoutJson,
            width: first.width,
            height: first.height,
            tagModel: first.tagModel,
          }
        : null,
    });
  }

  return out;
}
