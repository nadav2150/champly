import { redirect } from 'react-router';
import { createSupabaseServerClient } from '../lib/supabase.server';
import type { Route } from './+types/auth.callback';

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const { supabase, headers } = createSupabaseServerClient(
      request,
      context.cloudflare.env,
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      throw redirect('/', { headers });
    }
  }

  throw redirect('/login');
}
