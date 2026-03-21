import { data, Outlet, useLoaderData } from 'react-router';
import { Navbar } from '../components/dashboard/navbar';
import { getDb, withRetry } from '../db/client.server';
import { listCategoriesWithCounts } from '../db/categories.server';
import { listZonesWithStats } from '../db/zones.server';
import { requireUser } from '../lib/require-user.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';
import type { Route } from './+types/dashboard-layout';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { user, headers } = await requireUser(request, env);

  const db = getDb(context);

  let categories: Awaited<ReturnType<typeof listCategoriesWithCounts>> = [];
  let zones: Awaited<ReturnType<typeof listZonesWithStats>> = [];

  try {
    [categories, zones] = await Promise.all([
      withRetry(() => listCategoriesWithCounts(db, user.id)),
      withRetry(() => listZonesWithStats(db, user.id)),
    ]);
  } catch (err) {
    console.error('Failed to load dashboard data:', err);
  }

  return data({ user, categories, zones }, { headers });
}

export default function DashboardLayout() {
  const { user, categories, zones } = useLoaderData<typeof loader>();
  const outletContext: DashboardOutletContext = { categories, zones };
  const userName = user.user_metadata?.full_name ?? user.email ?? '';

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-dashboard-bg font-sans text-white">
      <div className="w-full shrink-0 lg:border-b lg:border-white/10 lg:px-8 lg:pt-5 lg:pb-4">
        <Navbar userName={userName} />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}
