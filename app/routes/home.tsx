import type { Route } from './+types/home';
import { HomeDashboard } from '../components/dashboard/home-dashboard';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Home — Tag Control' },
    {
      name: 'description',
      content: 'Store tag control overview and quick actions.',
    },
  ];
}

export default function Home() {
  return <HomeDashboard />;
}
