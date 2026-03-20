import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';

export type SupabaseWorkerEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export function createSupabaseServerClient(
  request: Request,
  env: SupabaseWorkerEnv,
) {
  const headers = new Headers();

  const supabase = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '').filter(
            (c): c is { name: string; value: string } => c.value !== undefined,
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              'Set-Cookie',
              serializeCookieHeader(name, value, options),
            );
          });
        },
      },
    },
  );

  return { supabase, headers };
}
