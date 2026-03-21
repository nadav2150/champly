import { data, Form, Link, redirect, useActionData, useNavigation } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSupabaseServerClient } from '../lib/supabase.server';
import type { Route } from './+types/register';

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
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!email || !password || !confirmPassword) {
    return data(
      { error: 'fieldsRequired' as const, success: false },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return data(
      { error: 'passwordsMismatch' as const, success: false },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return data(
      { error: 'passwordTooShort' as const, success: false },
      { status: 400 }
    );
  }

  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
    },
  });

  if (error) {
    return data(
      { error: 'signUpFailed' as const, success: false },
      { status: 400 }
    );
  }

  return data({ error: null, success: true }, { headers });
}

export function meta() {
  return [{ title: 'Register — Tag Control' }];
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { t } = useTranslation('auth');
  const isSubmitting = navigation.state === 'submitting';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  if (actionData?.success) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-dashboard-bg px-4 font-sans text-white">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-dashboard-border bg-dashboard-card p-8 shadow-[0px_0px_0px_1px_#0d171a] text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-churn-low">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              {t('checkEmailTitle')}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {t('checkEmailDescription')}
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block text-sm text-accent-mint hover:underline"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              {t('registerTitle')}
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {t('registerSubtitle')}
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
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full rounded-lg border border-white/20 bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent-mint focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-xs font-medium text-white/60">
                {t('confirmPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('confirmPasswordPlaceholder')}
                className={`w-full rounded-lg border bg-dashboard-bg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none ${
                  mismatch
                    ? 'border-churn-high focus:border-churn-high'
                    : 'border-white/20 focus:border-accent-mint'
                }`}
              />
              {mismatch && (
                <p className="mt-1 text-xs text-churn-high">{t('passwordsMismatch')}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || mismatch}
              className="mt-2 w-full rounded-full bg-accent-mint py-3 text-sm font-medium text-accent-mint-text transition hover:bg-accent-mint/90 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? t('creatingAccount') : t('registerButton')}
            </button>
          </Form>

          <p className="mt-6 text-center text-sm text-white/50">
            {t('hasAccount')}{' '}
            <Link to="/login" className="text-accent-mint hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
