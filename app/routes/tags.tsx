import type { Route } from './+types/tags';
import { data, useLoaderData, useOutletContext } from 'react-router';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { getDb, withRetry } from '../db/client.server';
import { listOwnedProductIds, listProductPairOptions } from '../db/products.server';
import { getTagHeaderStats, listZoneIdsForUser } from '../db/stats.server';
import { linkTagToProduct, listTagsForTable } from '../db/tags.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';

const emptyTagStats = {
  online: 0,
  lowBattery: 0,
  offline: 0,
  total: 0,
} as const;

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);

  let tags: Awaited<ReturnType<typeof listTagsForTable>> = [];
  let tagStats: Awaited<ReturnType<typeof getTagHeaderStats>> = {
    ...emptyTagStats,
  };
  let productOptions: Awaited<ReturnType<typeof listProductPairOptions>> = [];

  try {
    const [zoneIds, productIds] = await Promise.all([
      withRetry(() => listZoneIdsForUser(db, user.id)),
      withRetry(() => listOwnedProductIds(db, user.id)),
    ]);
    const visibility = { zoneIds, productIds };
    [tags, tagStats, productOptions] = await Promise.all([
      withRetry(() => listTagsForTable(db, user.id, visibility)),
      withRetry(() => getTagHeaderStats(db, user.id, visibility)),
      withRetry(() => listProductPairOptions(db, user.id)),
    ]);
  } catch (err) {
    console.error('Failed to load tags data:', err);
  }

  return data({ tags, tagStats, productOptions }, { headers });
}

export async function action({ request, context }: Route.ActionArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '');
  const db = getDb(context);

  if (intent === 'link-product') {
    const tagInternalId = String(formData.get('tagInternalId') ?? '');
    const productIdRaw = formData.get('productId');
    const productId =
      productIdRaw && String(productIdRaw).length > 0
        ? String(productIdRaw)
        : null;
    const linked = await linkTagToProduct(
      db,
      user.id,
      tagInternalId,
      productId,
    );
    if (!linked) {
      return data({ ok: false as const, error: 'forbidden' }, { headers });
    }
    return data({ ok: true as const }, { headers });
  }

  return data({ ok: false as const }, { headers });
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'תגיות — ניטור חומרה' : 'Tags — Hardware Monitor' },
    {
      name: 'description',
      content: isHebrew
        ? 'ניטור ושליטה בתגיות מדף פיזיות: סוללה, קליטה, קישוריות ושיוך.'
        : 'Monitor and control physical shelf tags: battery levels, signal strength, connectivity, and pairing.',
    },
  ];
}

export default function TagsPage() {
  const { tags, tagStats, productOptions } = useLoaderData<typeof loader>();
  const { categories, zones } = useOutletContext<DashboardOutletContext>();

  return (
    <TagControlScreen
      variant="tags"
      categories={categories}
      zones={zones}
      tags={tags}
      tagStats={tagStats}
      productOptions={productOptions}
    />
  );
}
