import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import {
  getLanguageFromPathname,
  toLocalizedPath,
  type SupportedLanguage,
} from '../../i18n/config';

export function LandingNavbar() {
  const { pathname } = useLocation();
  const { t } = useTranslation(['landing', 'common']);
  const currentLanguage = getLanguageFromPathname(pathname);
  const nextLanguage: SupportedLanguage = currentLanguage === 'en' ? 'he' : 'en';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/10 bg-[#001d22]/95 shadow-lg backdrop-blur-md'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8'>
        <Link to={toLocalizedPath('/', currentLanguage)} className='inline-flex items-center gap-2.5'>
          <img src='/logo_no_text.svg' alt='Champty' className='h-10 w-auto sm:h-12' />
          <span className='translate-y-0.5 font-kindred text-lg leading-none tracking-widest text-[#f5f5dc] sm:text-xl'>
            CHAMPTY
          </span>
        </Link>

        <nav className='flex items-center gap-1.5 sm:gap-3'>
          <Link
            to={toLocalizedPath(pathname, nextLanguage)}
            className='rounded-md border border-white/20 px-2.5 py-1.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 sm:px-3 sm:py-2 sm:text-sm'
          >
            {t('common:nav.switchLanguage')}
          </Link>
          <Link
            to='/login'
            className='px-2.5 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:text-white sm:px-3 sm:py-2 sm:text-sm'
          >
            {t('landing:nav.login')}
          </Link>
          <a
            href='#cta'
            className='hidden rounded-md bg-accent-mint px-4 py-2 text-sm font-semibold text-accent-mint-text transition-all hover:brightness-95 sm:inline-flex'
          >
            {t('landing:nav.requestDemo')}
          </a>
        </nav>
      </div>
    </header>
  );
}
