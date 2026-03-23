import { asc, eq, sql } from 'drizzle-orm';
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

  if (allTemplates.length === 0) return [];

  const allVariants = await db
    .select({
      templateId: templateVariants.templateId,
      layoutJson: templateVariants.layoutJson,
      id: templateVariants.id,
    })
    .from(templateVariants)
    .orderBy(asc(templateVariants.id));

  const firstByTemplate = new Map<string, string | null>();
  for (const v of allVariants) {
    if (!firstByTemplate.has(v.templateId)) {
      firstByTemplate.set(v.templateId, v.layoutJson);
    }
  }

  return allTemplates.map((t) => ({
    id: t.id,
    name: t.name,
    layoutJson: firstByTemplate.get(t.id) ?? null,
  }));
}

export async function listTemplatesWithVariants(
  db: AppDatabase,
): Promise<TemplateRow[]> {
  const all = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      kind: templates.kind,
      createdAt: templates.createdAt,
      variantCount: sql<number>`(SELECT count(*) FROM ${templateVariants} WHERE ${templateVariants.templateId} = ${templates.id})`,
      linkedProductCount: sql<number>`(SELECT count(*) FROM ${products} WHERE ${products.templateId} = ${templates.id})`,
    })
    .from(templates);

  if (all.length === 0) return [];

  const allVariants = await db
    .select({
      templateId: templateVariants.templateId,
      layoutJson: templateVariants.layoutJson,
      width: templateVariants.width,
      height: templateVariants.height,
      tagModel: templateVariants.tagModel,
      id: templateVariants.id,
    })
    .from(templateVariants)
    .orderBy(asc(templateVariants.id));

  const firstByTemplate = new Map<
    string,
    { layoutJson: string; width: number; height: number; tagModel: string }
  >();
  for (const v of allVariants) {
    if (!firstByTemplate.has(v.templateId)) {
      firstByTemplate.set(v.templateId, {
        layoutJson: v.layoutJson,
        width: v.width,
        height: v.height,
        tagModel: v.tagModel,
      });
    }
  }

  return all.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    kind: t.kind,
    createdAt: t.createdAt,
    variantCount: Number(t.variantCount ?? 0),
    linkedProductCount: Number(t.linkedProductCount ?? 0),
    firstVariant: firstByTemplate.get(t.id) ?? null,
  }));
}
