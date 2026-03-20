import type { Route } from './+types/stores';
import { useTranslation } from 'react-i18next';
import {
  StoreCard,
  type StoreCardData,
} from '../components/dashboard/store-card';
import { isSupportedLanguage } from '../i18n/config';

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
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STORES.map((s) => {
          const storeNameKey =
            s.id === '1'
              ? 'storeNames.mainStreet'
              : s.id === '2'
                ? 'storeNames.northBranch'
                : 'storeNames.expressCorner';
          const storeAddressKey =
            s.id === '1'
              ? 'storeAddresses.mainStreet'
              : s.id === '2'
                ? 'storeAddresses.northBranch'
                : 'storeAddresses.expressCorner';
          return (
            <StoreCard
              key={s.id}
              store={{
                ...s,
                name: t(storeNameKey),
                address: t(storeAddressKey),
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
