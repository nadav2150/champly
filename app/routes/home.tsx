import type { Route } from './+types/home';
import { data, useLoaderData } from 'react-router';
import { HomeDashboard } from '../components/dashboard/home-dashboard';
import { getDb, withRetry } from '../db/client.server';
import { getDashboardStats } from '../db/stats.server';
import { isSupportedLanguage } from '../i18n/config';
import { requireUser } from '../lib/require-user.server';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);
  const db = getDb(context);

  let stats: Awaited<ReturnType<typeof getDashboardStats>> = {
    totalProducts: 0,
    connectedTags: 0,
    lowBattery: 0,
    offlineTags: 0,
  };

  try {
    stats = await withRetry(() => getDashboardStats(db, user.id));
  } catch (err) {
    console.error('Failed to load dashboard stats:', err);
  }

  return data({ stats }, { headers });
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'בית — שליטת תגיות' : 'Home — Tag Control' },
    {
      name: 'description',
      content: isHebrew
        ? 'סקירת שליטת תגיות בחנות ופעולות מהירות.'
        : 'Store tag control overview and quick actions.',
    },
  ];
}

export default function Home() {
  const { stats } = useLoaderData<typeof loader>();
  return <HomeDashboard stats={stats} />;
}
