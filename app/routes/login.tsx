import {
  data,
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { createSupabaseServerClient } from '../lib/supabase.server';
import type { Route } from './+types/login';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { supabase } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    throw redirect('/');
  }
  return null;
}

export async function action({ request, context }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return data(
      { error: 'fieldsRequired' as const },
      { status: 400 }
    );
  }

  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return data(
      { error: 'invalidCredentials' as const },
      { status: 401 }
    );
  }

  throw redirect('/', { headers });
}

export function meta() {
  return [{ title: 'Sign In — Tag Control' }];
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { t } = useTranslation('auth');
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="flex min-h-dvh items-center justify-center bg-dashboard-bg px-4 font-sans text-white">
      <div className="w-full max-w-sm">
        <img
          src="/Champly.svg"
          alt="Champly"
          className="mx-auto mb-1 h-56 w-auto"
        />
        <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-8 shadow-[0px_0px_0px_1px_#0d171a]">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              {t('loginTitle')}
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {t('loginSubtitle')}
            </p>
          </div>

          {actionData?.error && (
            <div className="mb-4 rounded-lg border border-churn-high-border bg-churn-high/10 px-3 py-2 text-sm text-churn-high">
              {t(actionData.error)}
            </div>
          )}

          <Form method="post" className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-medium text-white/60">
                {t('email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('emailPlaceholder')}
                className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-medium text-white/60">
                {t('password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder={t('passwordPlaceholder')}
                className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-accent-mint py-3 text-sm font-medium text-accent-mint-text transition hover:bg-accent-mint/90 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? t('signingIn') : t('loginButton')}
            </button>
          </Form>

          <p className="mt-6 text-center text-sm text-white/50">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-accent-mint hover:underline">
              {t('register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
