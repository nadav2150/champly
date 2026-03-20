import { data, Outlet, redirect, useLoaderData } from 'react-router';
import { Navbar } from '../components/dashboard/navbar';
import { getDb } from '../db/client.server';
import { listCategoriesWithCounts } from '../db/categories.server';
import { listZonesWithStats } from '../db/zones.server';
import { createSupabaseServerClient } from '../lib/supabase.server';
import type { DashboardOutletContext } from '../types/dashboard-outlet-context';
import type { Route } from './+types/dashboard-layout';

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env;
  const { supabase, headers } = createSupabaseServerClient(request, env);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/login', { headers });
  }

  const db = getDb(context);
  const [categories, zones] = await Promise.all([
    listCategoriesWithCounts(db),
    listZonesWithStats(db),
  ]);

  return data({ user, categories, zones }, { headers });
}

export default function DashboardLayout() {
  const { categories, zones } = useLoaderData<typeof loader>();
  const outletContext: DashboardOutletContext = { categories, zones };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-dashboard-bg font-sans text-white">
      <div className="w-full shrink-0 lg:border-b lg:border-white/10 lg:px-8 lg:pt-5 lg:pb-4">
        <Navbar />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
}
