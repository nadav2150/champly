import type { Route } from './+types/tags';
import { data, useLoaderData, useOutletContext } from 'react-router';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { getDb } from '../db/client.server';
import { listProductPairOptions } from '../db/products.server';
import { linkTagToProduct, listTagsForTable } from '../db/tags.server';
import { getTagHeaderStats } from '../db/stats.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);
  const [tags, tagStats, productOptions] = await Promise.all([
    listTagsForTable(db, user.id),
    getTagHeaderStats(db, user.id),
    listProductPairOptions(db, user.id),
  ]);
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
