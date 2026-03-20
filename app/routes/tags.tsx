import type { Route } from './+types/tags';
import { TagControlScreen } from '../components/dashboard/tag-control-screen';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Tags — Hardware Monitor' },
    {
      name: 'description',
      content:
        'Monitor and control physical shelf tags: battery levels, signal strength, connectivity, and pairing.',
    },
  ];
}

export default function TagsPage() {
  return <TagControlScreen variant="tags" />;
}
