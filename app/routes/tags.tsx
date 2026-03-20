import type { Route } from './+types/tags';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';
import { isSupportedLanguage } from '../i18n/config';

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
  return <TagControlScreen variant="tags" />;
}
