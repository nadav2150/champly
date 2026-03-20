import type { Route } from './+types/home';
import { useLoaderData } from 'react-router';
import { HomeDashboard } from '../components/dashboard/home-dashboard';
import { getDb } from '../db/client.server';
import { getDashboardStats } from '../db/stats.server';
import { isSupportedLanguage } from '../i18n/config';

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  const stats = await getDashboardStats(db);
  return { stats };
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
