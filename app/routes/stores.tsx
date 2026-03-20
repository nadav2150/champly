import type { Route } from './+types/stores';
import {
  StoreCard,
  type StoreCardData,
} from '../components/dashboard/store-card';

const STORES: StoreCardData[] = [
  {
    id: '1',
    name: 'Main Street',
    address: '12 Herzl St., Tel Aviv',
    connectedTags: 18,
    pendingUpdates: 2,
    failedUpdates: 0,
    lastSync: '12 sec ago',
  },
  {
    id: '2',
    name: 'North Branch',
    address: '4 Weizmann Blvd., Haifa',
    connectedTags: 12,
    pendingUpdates: 1,
    failedUpdates: 1,
    lastSync: '4 min ago',
  },
  {
    id: '3',
    name: 'Express Corner',
    address: 'Shop 3, Mall Center',
    connectedTags: 6,
    pendingUpdates: 0,
    failedUpdates: 0,
    lastSync: '1 min ago',
  },
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Stores' },
    { name: 'description', content: 'Manage store locations and ESL hubs.' },
  ];
}

export default function StoresPage() {
  return (
    <div className="flex w-full flex-1 flex-col overflow-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <section
        className="w-full max-w-none rounded-xl border border-dashboard-border bg-dashboard-card p-6 shadow-[0px_0px_0px_1px_#0d171a]"
        aria-labelledby="stores-heading"
      >
        <h1
          id="stores-heading"
          className="text-3xl font-medium text-white md:text-4xl"
        >
          Stores
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          Each location shows ESL health at a glance — connected tags, queue,
          failures, and last hub sync. Open the tag console to push prices and
          layouts.
        </p>
      </section>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STORES.map((s) => (
          <StoreCard key={s.id} store={s} />
        ))}
      </div>
    </div>
  );
}
