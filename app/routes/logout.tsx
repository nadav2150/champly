import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../lib/supabase.server';
import type { Route } from './+types/logout';

export async function action({ request, context }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  await supabase.auth.signOut();
  throw redirect('/login', { headers });
}

export async function loader() {
  throw redirect('/login');
}
