import type { Route } from './+types/home';
import { HomeDashboard } from '../components/dashboard/home-dashboard';
import { isSupportedLanguage } from '../i18n/config';

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
  return <HomeDashboard />;
}
