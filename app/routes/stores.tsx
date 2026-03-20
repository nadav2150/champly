import type { Route } from './+types/stores';
import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  StoreCard,
  type StoreCardData,
} from '../components/dashboard/store-card';
import { getDb } from '../db/client.server';
import { listStoresWithAggregates } from '../db/stores.server';
import { isSupportedLanguage } from '../i18n/config';

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  const stores = await listStoresWithAggregates(db);
  return { stores };
}

export function meta({ params }: Route.MetaArgs) {
  const isHebrew = isSupportedLanguage(params.lang) && params.lang === 'he';
  return [
    { title: isHebrew ? 'סניפים' : 'Stores' },
    {
      name: 'description',
      content: isHebrew
        ? 'ניהול מיקומי סניפים ורכזות ESL.'
        : 'Manage store locations and ESL hubs.',
    },
  ];
}

export default function StoresPage() {
  const { t } = useTranslation('stores');
  const { stores } = useLoaderData<typeof loader>();

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
          {t('heading')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          {t('description')}
        </p>
      </section>
      {stores.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-dashboard-border bg-dashboard-card">
            <span className="text-3xl">🏪</span>
          </div>
          <h2 className="text-xl font-medium text-white">{t('empty.title')}</h2>
          <p className="max-w-sm text-sm text-white/50">{t('empty.description')}</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-2">
          {stores.map((s) => {
            const card: StoreCardData = {
              id: s.id,
              name: s.name,
              address: s.address,
              connectedTags: s.connectedTags,
              pendingUpdates: s.pendingUpdates,
              failedUpdates: s.failedUpdates,
              lastSync: s.lastSync ?? '—',
            };
            return <StoreCard key={s.id} store={card} />;
          })}
        </div>
      )}
    </div>
  );
}
