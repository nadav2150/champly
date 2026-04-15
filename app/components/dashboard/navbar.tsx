import { useEffect, useRef, useState } from 'react';
import { Form, Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { IoSettingsOutline, IoNotificationsOutline, IoLogOutOutline, IoLanguageOutline, IoHomeOutline, IoStorefrontOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
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

const drawerLinkBase =
  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition';
const drawerLinkInactive = `${drawerLinkBase} text-white/70 hover:bg-white/5`;
const drawerLinkActive = `${drawerLinkBase} bg-accent-mint/10 text-accent-mint`;

type NavbarProps = {
  userName?: string;
};

export function Navbar({ userName = '' }: NavbarProps) {
  const { t } = useTranslation('common');
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

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
  const isHome = normalizedPath === '/dashboard' || normalizedPath === '/';
  const isStores = normalizedPath === '/dashboard/stores';
  const isProducts = normalizedPath === '/dashboard/products';
  const isTags = normalizedPath === '/dashboard/tags';
  const isTemplates = normalizedPath === '/dashboard/templates';

  const navLinks = [
    { to: '/dashboard', label: t('nav.home'), icon: <IoHomeOutline className="size-5" />, active: isHome },
    { to: '/dashboard/stores', label: t('nav.stores'), icon: <IoStorefrontOutline className="size-5" />, active: isStores },
    { to: '/dashboard/products', label: t('nav.products'), icon: <IconPackage className="size-5" />, active: isProducts },
    { to: '/dashboard/tags', label: t('nav.tags'), icon: <BiBarcode className="size-5" />, active: isTags },
    { to: '/dashboard/templates', label: t('nav.templates'), icon: <IconTemplate className="size-5" />, active: isTemplates },
  ];

  return (
    <>
      {/* Mobile top bar -- hamburger + logo + avatar, hidden on desktop */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/10"
          aria-label={t('nav.menu')}
        >
          <IoMenuOutline size={24} />
        </button>
        <div className="flex items-center gap-2.5">
          <img src="/logo_no_text.svg" alt="Champly" className="h-12 w-auto" />
          <span className="translate-y-0.5 font-kindred text-lg leading-none tracking-widest text-[#f5f5dc]">CHAMPTY</span>
        </div>
        <AvatarMenu
          userName={userName}
          initials={initials}
          language={language}
          pathname={pathname}
          size="sm"
        />
      </div>

      {/* Mobile drawer -- hidden on desktop */}
      <div
        className={`fixed inset-0 z-60 lg:hidden ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setDrawerOpen(false)}
        />
        {/* Drawer panel */}
        <nav
          className={`absolute inset-y-0 inset-s-0 flex w-72 flex-col bg-dashboard-bg shadow-2xl transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'}`}
          aria-label={t('nav.main')}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo_no_text.svg" alt="Champly" className="h-10 w-auto" />
              <span className="translate-y-0.5 font-kindred text-base leading-none tracking-widest text-[#f5f5dc]">CHAMPTY</span>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label={t('nav.close')}
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={toLocalizedPath(link.to, language)}
                  className={link.active ? drawerLinkActive : drawerLinkInactive}
                  aria-current={link.active ? 'page' : undefined}
                  onClick={() => setDrawerOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer -- language switch + logout */}
          <div className="border-t border-white/10 px-3 py-4">
            <div className="mb-2 truncate px-4 py-1 text-xs font-medium text-white/40">
              {userName}
            </div>
            <Link
              to={toLocalizedPath(pathname, language === 'en' ? 'he' : 'en')}
              reloadDocument
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
              onClick={() => setDrawerOpen(false)}
            >
              <IoLanguageOutline className="size-5" />
              {t('nav.switchLanguage')}
            </Link>
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-white/5"
              >
                <IoLogOutOutline className="size-5" />
                {t('nav.logout')}
              </button>
            </Form>
          </div>
        </nav>
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
              to={toLocalizedPath('/dashboard', language)}
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
              to={toLocalizedPath('/dashboard/stores', language)}
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
              to={toLocalizedPath('/dashboard/products', language)}
              className={isProducts ? navPillActive : navPillInactive}
              aria-current={isProducts ? 'page' : undefined}
            >
              <IconPackage
                className={isProducts ? 'text-dashboard-bg' : 'text-white/80'}
              />
              {t('nav.products')}
            </Link>
            <Link
              to={toLocalizedPath('/dashboard/tags', language)}
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
              to={toLocalizedPath('/dashboard/templates', language)}
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
    </>
  );
}
