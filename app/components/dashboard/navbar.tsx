import { Form, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './language-toggle';
import {
  getLanguageFromPathname,
  isSupportedLanguage,
  toLocalizedPath,
} from '../../i18n/config';

function IconHome({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 10.5L10 4l7 6.5V16a1 1 0 01-1 1h-4.5v-4H8.5v4H4a1 1 0 01-1-1v-5.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStore({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 8l7-5 7 5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 18v-5h4v5M6 8h.01M10 8h.01M14 8h.01"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPackage({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 6l7-3 7 3v10l-7 3-7-3V6z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M3 6l7 3 7-3M10 9v9" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IconTag({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3.5 11.5L11.5 3.5a2 2 0 012.8 0l2.2 2.2a2 2 0 010 2.8L8.5 16.5H3v-5.5l.5-.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 16V10M10 16V4M16 16v-6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M12.5 12.5L16 16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBell({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 3a4 4 0 00-4 4v2.5L4 12v1h12v-1l-2-2.5V7a4 4 0 00-4-4zM8 14a2 2 0 004 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M16.5 10.5v-1l-1.8-.6-.5-1.5 1-1.5-1.4-1.4-1.5 1-1.5-.5-1.8-1h-1l-.6 1.8-1.5.5-1.5-1-1.4 1.4 1 1.5-.5 1.5-1.8.6v1l1.8.6.5 1.5-1 1.5 1.4 1.4 1.5-1 1.5.5 1.8 1h1l.6-1.8 1.5-.5 1.5 1 1.4-1.4-1-1.5.5-1.5 1.8-.6z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navPillInactive =
  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-[-0.28px] text-white/70 transition hover:text-white/90';
const navPillActive =
  'flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 text-sm font-medium tracking-[-0.28px] text-dashboard-bg';

const mobileTabBase =
  'flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition';
const mobileTabInactive = `${mobileTabBase} text-white/50`;
const mobileTabActive = `${mobileTabBase} text-accent-mint`;

export function Navbar() {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const language = getLanguageFromPathname(pathname);
  const pathSegments = pathname.split('/').filter(Boolean);
  const basePath = isSupportedLanguage(pathSegments[0])
    ? `/${pathSegments.slice(1).join('/')}`
    : pathname;
  const normalizedPath = basePath === '/' ? '/' : basePath.replace(/\/$/, '') || '/';
  const isHome = normalizedPath === '/';
  const isStores = normalizedPath === '/stores';
  const isProducts = normalizedPath === '/products';
  const isTags = normalizedPath === '/tags';

  return (
    <>
      {/* Desktop top navbar -- hidden on mobile */}
      <header
        className="hidden w-full max-w-none flex-wrap items-center justify-between gap-x-4 gap-y-4 lg:flex"
        aria-label={t('nav.main')}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3 lg:gap-12">
          <div
            className="relative size-9 overflow-hidden rounded-lg border border-dashboard-border bg-dashboard-card shadow-[0px_0px_0px_1px_#0d171a]"
            aria-hidden
          >
            <div className="absolute start-[7px] top-2 h-5 w-2.5 rounded-sm bg-accent-mint" />
            <div className="absolute start-[17px] top-2 h-5 w-3 rounded-br-sm rounded-tr-sm rounded-bl-[32px] rounded-tl-[32px] bg-[#475c5f]" />
          </div>
          <nav className="flex items-center gap-1.5" aria-label="Primary">
            <Link
              to={toLocalizedPath('/', language)}
              className={isHome ? navPillActive : navPillInactive}
              aria-current={isHome ? 'page' : undefined}
            >
              <IconHome
                className={isHome ? 'text-dashboard-bg' : 'text-white/80'}
              />
              {t('nav.home')}
            </Link>
            <Link
              to={toLocalizedPath('/stores', language)}
              className={isStores ? navPillActive : navPillInactive}
              aria-current={isStores ? 'page' : undefined}
            >
              <IconStore
                className={isStores ? 'text-dashboard-bg' : 'text-white/80'}
              />
              {t('nav.stores')}
            </Link>
            <Link
              to={toLocalizedPath('/products', language)}
              className={isProducts ? navPillActive : navPillInactive}
              aria-current={isProducts ? 'page' : undefined}
            >
              <IconPackage
                className={isProducts ? 'text-dashboard-bg' : 'text-white/80'}
              />
              {t('nav.products')}
            </Link>
            <Link
              to={toLocalizedPath('/tags', language)}
              className={isTags ? navPillActive : navPillInactive}
              aria-current={isTags ? 'page' : undefined}
            >
              <IconTag
                className={isTags ? 'text-dashboard-bg' : 'text-white/80'}
              />
              {t('nav.tags')}
            </Link>
            <span className="mx-1 h-[18px] w-px bg-white/15" aria-hidden />
            <span className="flex cursor-default items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-[-0.28px] text-white/70">
              <IconChart />
              {t('nav.monitoring')}
            </span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative h-10 min-w-[200px] max-w-[349px] flex-1 overflow-hidden rounded-full border border-dashboard-border bg-dashboard-card shadow-[0px_0px_0px_1px_#00161a]">
            <div className="absolute start-3 top-1/2 flex -translate-y-1/2 items-center gap-2 pe-3">
              <IconSearch className="text-white/50" />
              <span className="text-sm text-white/17">
                {t('nav.searchPlaceholder')}
              </span>
            </div>
          </div>
            <div className="relative flex items-center gap-2.5">
              <LanguageToggle />
            <div className="relative">
              <button
                type="button"
                className="rounded-full border border-dashboard-tabbar bg-dashboard-bg p-2 shadow-[0px_0px_0px_1px_#00161a]"
                aria-label={t('nav.notifications')}
              >
                <IconBell className="text-white/80" />
              </button>
              <span
                className="absolute -end-0.5 -top-0.5 size-[7px] rounded-full bg-red-500 ring-2 ring-dashboard-bg"
                aria-hidden
              />
            </div>
            <button
              type="button"
              className="rounded-full border border-dashboard-tabbar bg-dashboard-bg p-2 shadow-[0px_0px_0px_1px_#00161a]"
              aria-label={t('nav.settings')}
            >
              <IconSettings className="text-white/80" />
            </button>
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="rounded-full border border-dashboard-tabbar bg-dashboard-bg p-2 shadow-[0px_0px_0px_1px_#00161a] transition hover:border-red-500/40 hover:bg-red-500/10"
                aria-label={t('nav.logout')}
                title={t('nav.logout')}
              >
                <IconLogout className="text-white/80" />
              </button>
            </Form>
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar -- hidden on desktop */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex items-center border-t border-dashboard-border bg-dashboard-bg pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label={t('nav.main')}
      >
        <Link
          to={toLocalizedPath('/', language)}
          className={isHome ? mobileTabActive : mobileTabInactive}
          aria-current={isHome ? 'page' : undefined}
        >
          <IconHome className="size-5" />
          {t('nav.home')}
        </Link>
        <Link
          to={toLocalizedPath('/stores', language)}
          className={isStores ? mobileTabActive : mobileTabInactive}
          aria-current={isStores ? 'page' : undefined}
        >
          <IconStore className="size-5" />
          {t('nav.stores')}
        </Link>
        <Link
          to={toLocalizedPath('/products', language)}
          className={isProducts ? mobileTabActive : mobileTabInactive}
          aria-current={isProducts ? 'page' : undefined}
        >
          <IconPackage className="size-5" />
          {t('nav.products')}
        </Link>
        <Link
          to={toLocalizedPath('/tags', language)}
          className={isTags ? mobileTabActive : mobileTabInactive}
          aria-current={isTags ? 'page' : undefined}
        >
          <IconTag className="size-5" />
          {t('nav.tags')}
        </Link>
      </nav>
    </>
  );
}
