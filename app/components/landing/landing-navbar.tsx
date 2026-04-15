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
    <header className='sticky top-0 z-50 transition-all duration-300'>
      <div className={`mx-auto max-w-6xl px-3 sm:px-5 lg:px-8 ${scrolled ? 'py-2' : 'py-3 sm:py-4'}`}>
        <nav
          className={`flex items-center justify-between gap-2 rounded-full px-3 py-2 transition-all duration-300 sm:px-6 sm:py-2.5 ${
            scrolled
              ? 'border border-white/10 bg-[#001d22]/90 shadow-lg shadow-black/10 backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          <Link to={toLocalizedPath('/', currentLanguage)} className='inline-flex shrink-0 items-center gap-1.5 sm:gap-2.5'>
            <img src='/logo_no_text.svg' alt='Champty' className='h-7 w-auto sm:h-10' />
            <span className='translate-y-0.5 font-kindred text-sm leading-none tracking-widest text-[#f5f5dc] sm:text-lg'>
              CHAMPTY
            </span>
          </Link>

          <div className='flex shrink-0 items-center gap-1.5 sm:gap-3'>
            <Link
              to={toLocalizedPath(pathname, nextLanguage)}
              className='whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium text-white/80 transition-all hover:border-white/30 hover:bg-white/10 sm:px-4 sm:py-2 sm:text-sm'
            >
              {t('common:nav.switchLanguage')}
            </Link>
            <Link
              to='/login'
              className='whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold text-white/90 transition-colors hover:text-white sm:px-4 sm:py-2 sm:text-sm'
            >
              {t('landing:nav.login')}
            </Link>
            <a
              href='#cta'
              className='btn-primary-pill hidden rounded-full! px-5! py-2.5! text-sm! sm:inline-flex'
            >
              {t('landing:nav.requestDemo')}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
