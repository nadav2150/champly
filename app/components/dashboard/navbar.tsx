import { useEffect, useRef, useState } from 'react';
import { Form, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IoSettingsOutline, IoNotificationsOutline, IoLogOutOutline, IoLanguageOutline, IoHomeOutline, IoStorefrontOutline } from 'react-icons/io5';
import { BiBarcode } from 'react-icons/bi';
import {
  getLanguageFromPathname,
  isSupportedLanguage,
  toLocalizedPath,
  type SupportedLanguage,
} from '../../i18n/config';

function AvatarMenu({
  userName,
  initials,
  language,
  pathname,
  size = 'md',
}: {
  userName: string;
  initials: string;
  language: SupportedLanguage;
  pathname: string;
  size?: 'sm' | 'md';
}) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const sizeClass = size === 'sm'
    ? 'size-8 text-xs'
    : 'size-9 text-sm';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center rounded-full bg-accent-mint font-semibold text-accent-mint-text shadow-[0px_0px_0px_1px_#00161a] transition hover:brightness-110 ${sizeClass}`}
        aria-label={t('nav.avatar')}
      >
        {initials || '?'}
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-dashboard-border bg-dashboard-card shadow-[0px_8px_24px_rgba(0,0,0,0.4)]">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
          </div>
          <div className="border-b border-white/10">
            <Link
              to={toLocalizedPath(pathname, language === 'en' ? 'he' : 'en')}
              reloadDocument
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <IoLanguageOutline size={18} />
              {t('nav.switchLanguage')}
            </Link>
          </div>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition hover:bg-white/5"
            >
              <IoLogOutOutline size={18} />
              {t('nav.logout')}
            </button>
          </Form>
        </div>
      ) : null}
    </div>
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

function IconTemplate({ className }: { className?: string }) {
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
      <rect
        x="3"
        y="3"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M3 7h14M8 7v10"
        stroke="currentColor"
        strokeWidth="1.25"
      />
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

const navPillInactive =
  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-[-0.28px] text-white/70 transition hover:text-white/90';
const navPillActive =
  'flex items-center gap-2 rounded-full bg-white py-2 pl-2 pr-4 text-sm font-medium tracking-[-0.28px] text-dashboard-bg';

const mobileTabBase =
  'flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition';
const mobileTabInactive = `${mobileTabBase} text-white/50`;
const mobileTabActive = `${mobileTabBase} text-accent-mint`;

type NavbarProps = {
  userName?: string;
};

export function Navbar({ userName = '' }: NavbarProps) {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();

  const initials = userName
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');
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
  const isTemplates = normalizedPath === '/templates';

  return (
    <>
      {/* Mobile top bar -- avatar + logo, hidden on desktop */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <img src="/logo_no_text.svg" alt="Champly" className="h-20 w-auto" />
          <span className="translate-y-1 font-kindred text-xl leading-none tracking-widest text-[#f5f5dc]">CHAMPTY</span>
        </div>
        <AvatarMenu
          userName={userName}
          initials={initials}
          language={language}
          pathname={pathname}
          size="sm"
        />
      </div>

      {/* Desktop top navbar -- hidden on mobile */}
      <header
        className="hidden w-full max-w-none flex-wrap items-center justify-between gap-x-4 gap-y-4 lg:flex"
        aria-label={t('nav.main')}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-8 gap-y-3 lg:gap-12">
          <div className="flex items-center gap-2.5">
            <img src="/logo_no_text.svg" alt="Champly" className="h-20 w-auto" />
            <span className="translate-y-1 font-kindred text-xl leading-none tracking-widest text-[#f5f5dc]">CHAMPTY</span>
          </div>
          <nav className="flex items-center gap-1.5" aria-label="Primary">
            <Link
              to={toLocalizedPath('/', language)}
              className={isHome ? navPillActive : navPillInactive}
              aria-current={isHome ? 'page' : undefined}
            >
              <IoHomeOutline
                className={isHome ? 'text-dashboard-bg' : 'text-white/80'}
                size={20}
              />
              {t('nav.home')}
            </Link>
            <Link
              to={toLocalizedPath('/stores', language)}
              className={isStores ? navPillActive : navPillInactive}
              aria-current={isStores ? 'page' : undefined}
            >
              <IoStorefrontOutline
                className={isStores ? 'text-dashboard-bg' : 'text-white/80'}
                size={20}
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
              <BiBarcode
                className={isTags ? 'text-dashboard-bg' : 'text-white/80'}
                size={20}
              />
              {t('nav.tags')}
            </Link>
            <Link
              to={toLocalizedPath('/templates', language)}
              className={isTemplates ? navPillActive : navPillInactive}
              aria-current={isTemplates ? 'page' : undefined}
            >
              <IconTemplate
                className={isTemplates ? 'text-dashboard-bg' : 'text-white/80'}
              />
              {t('nav.templates')}
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
              <span className="truncate text-sm text-white/17">
                {t('nav.searchPlaceholder')}
              </span>
            </div>
          </div>
            <div className="relative flex items-center gap-2.5">
            <div className="relative">
              <button
                type="button"
                className="rounded-full border border-dashboard-tabbar bg-dashboard-bg p-2 shadow-[0px_0px_0px_1px_#00161a]"
                aria-label={t('nav.notifications')}
              >
                <IoNotificationsOutline className="text-white/80" size={20} />
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
              <IoSettingsOutline className="text-white/80" size={20} />
            </button>
            <AvatarMenu
              userName={userName}
              initials={initials}
              language={language}
              pathname={pathname}
            />
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
          <IoHomeOutline className="size-5" />
          {t('nav.home')}
        </Link>
        <Link
          to={toLocalizedPath('/stores', language)}
          className={isStores ? mobileTabActive : mobileTabInactive}
          aria-current={isStores ? 'page' : undefined}
        >
          <IoStorefrontOutline className="size-5" />
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
          <BiBarcode className="size-5" />
          {t('nav.tags')}
        </Link>
        <Link
          to={toLocalizedPath('/templates', language)}
          className={isTemplates ? mobileTabActive : mobileTabInactive}
          aria-current={isTemplates ? 'page' : undefined}
        >
          <IconTemplate className="size-5" />
          {t('nav.templates')}
        </Link>
      </nav>
    </>
  );
}
