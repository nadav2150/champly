import { asc, sql } from 'drizzle-orm';
import type { AppDatabase } from './client.server';
import { products, templates, templateVariants } from './schema.server';

export type TemplateVariantInfo = {
  layoutJson: string;
  width: number;
  height: number;
  tagModel: string;
};

export type TemplateRow = {
  id: string;
  name: string;
  description: string | null;
  kind: string;
  createdAt: string;
  variantCount: number;
  linkedProductCount: number;
  firstVariant: TemplateVariantInfo | null;
  variants: TemplateVariantInfo[];
};

export type TemplateSelectVariant = {
  tagModel: string;
  width: number;
  height: number;
  layoutJson: string;
};

export type TemplateSelectRow = {
  id: string;
  name: string;
  layoutJson: string | null;
  variants: TemplateSelectVariant[];
};

export async function listTemplatesForSelect(
  db: AppDatabase,
): Promise<TemplateSelectRow[]> {
  const [allTemplates, allVariants] = await Promise.all([
    db.select({ id: templates.id, name: templates.name }).from(templates),
    db
      .select({
        templateId: templateVariants.templateId,
        tagModel: templateVariants.tagModel,
        width: templateVariants.width,
        height: templateVariants.height,
        layoutJson: templateVariants.layoutJson,
        id: templateVariants.id,
      })
      .from(templateVariants)
      .orderBy(asc(templateVariants.id)),
  ]);

  if (allTemplates.length === 0) return [];

  const variantsByTemplate = new Map<string, TemplateSelectVariant[]>();
  for (const v of allVariants) {
    const list = variantsByTemplate.get(v.templateId) ?? [];
    list.push({
      tagModel: v.tagModel,
      width: v.width,
      height: v.height,
      layoutJson: v.layoutJson,
    });
    variantsByTemplate.set(v.templateId, list);
  }

  return allTemplates.map((t) => {
    const variants = variantsByTemplate.get(t.id) ?? [];
    return {
      id: t.id,
      name: t.name,
      layoutJson: variants[0]?.layoutJson ?? null,
      variants,
    };
  });
}

export async function listTemplatesWithVariants(
  db: AppDatabase,
): Promise<TemplateRow[]> {
  const [all, allVariants, productCounts] = await Promise.all([
    db
      .select({
        id: templates.id,
        name: templates.name,
        description: templates.description,
        kind: templates.kind,
        createdAt: templates.createdAt,
      })
      .from(templates),
    db
      .select({
        templateId: templateVariants.templateId,
        layoutJson: templateVariants.layoutJson,
        width: templateVariants.width,
        height: templateVariants.height,
        tagModel: templateVariants.tagModel,
        id: templateVariants.id,
      })
      .from(templateVariants)
      .orderBy(asc(templateVariants.id)),
    db
      .select({
        templateId: products.templateId,
        count: sql<number>`count(*)`,
      })
      .from(products)
      .groupBy(products.templateId),
  ]);

  if (all.length === 0) return [];

  const variantsByTemplate = new Map<string, TemplateVariantInfo[]>();
  for (const v of allVariants) {
    const list = variantsByTemplate.get(v.templateId) ?? [];
    list.push({
      layoutJson: v.layoutJson,
      width: v.width,
      height: v.height,
      tagModel: v.tagModel,
    });
    variantsByTemplate.set(v.templateId, list);
  }

  const productCountMap = new Map<string, number>();
  for (const p of productCounts) {
    if (p.templateId) productCountMap.set(p.templateId, Number(p.count));
  }

  return all.map((t) => {
    const variants = variantsByTemplate.get(t.id) ?? [];
    return {
      id: t.id,
      name: t.name,
      description: t.description,
      kind: t.kind,
      createdAt: t.createdAt,
      variantCount: variants.length,
      linkedProductCount: productCountMap.get(t.id) ?? 0,
      firstVariant: variants[0] ?? null,
      variants,
    };
  });
}
