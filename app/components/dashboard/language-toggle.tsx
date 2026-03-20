import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import {
  getLanguageFromPathname,
  toLocalizedPath,
  type SupportedLanguage,
} from '../../i18n/config';

export function LanguageToggle() {
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const currentLanguage = getLanguageFromPathname(pathname);
  const nextLanguage: SupportedLanguage = currentLanguage === 'en' ? 'he' : 'en';

  return (
    <Link
      to={toLocalizedPath(pathname, nextLanguage)}
      className='rounded-full border border-dashboard-tabbar bg-dashboard-bg px-3 py-2 text-sm font-medium text-white/80 shadow-[0px_0px_0px_1px_#00161a] hover:text-white'
    >
      {t('nav.switchLanguage')}
    </Link>
  );
}
