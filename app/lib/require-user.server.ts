import { redirect } from 'react-router';
import {
  createSupabaseServerClient,
  type SupabaseWorkerEnv,
} from './supabase.server';

export async function requireUser(request: Request, env: SupabaseWorkerEnv) {
  const { supabase, headers } = createSupabaseServerClient(request, env);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect('/login', { headers });
  }

  return { user, supabase, headers };
}
