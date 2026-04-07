import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

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

  return (
    <header className='border-b border-white/10'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8'>
        <Link to={toLocalizedPath('/', currentLanguage)} className='inline-flex items-center gap-2.5'>
          <img src='/logo_no_text.svg' alt='Champty' className='h-14 w-auto' />
          <span className='translate-y-0.5 font-kindred text-xl leading-none tracking-widest text-[#f5f5dc]'>CHAMPTY</span>
        </Link>

        <nav className='flex items-center gap-2 sm:gap-3'>
          <Link
            to={toLocalizedPath(pathname, nextLanguage)}
            className='rounded-md border border-white/20 px-3 py-2 text-xs font-medium text-white/85 hover:bg-white/10 sm:text-sm'
          >
            {t('common:nav.switchLanguage')}
          </Link>
          <Link to='/login' className='px-3 py-2 text-xs font-semibold text-white/90 hover:text-white sm:text-sm'>
            {t('landing:nav.login')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
