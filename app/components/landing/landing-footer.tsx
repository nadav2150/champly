import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import { getLanguageFromPathname, toLocalizedPath } from '../../i18n/config';

export function LandingFooter() {
  const { pathname } = useLocation();
  const { t } = useTranslation('landing');
  const lang = getLanguageFromPathname(pathname);
  const year = new Date().getFullYear();

  return (
    <footer className='bg-landing-hero-from text-white/80'>
      <div className='mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]'>
          <div>
            <Link to={toLocalizedPath('/', lang)} className='inline-flex items-center gap-2.5'>
              <img src='/logo_no_text.svg' alt='Champty' className='h-10 w-auto' />
              <span className='translate-y-0.5 font-kindred text-xl leading-none tracking-widest text-[#f5f5dc]'>
                CHAMPTY
              </span>
            </Link>
            <p className='mt-5 max-w-xs text-sm leading-relaxed text-white/50'>
              {t('footer.brandByline')}
            </p>
          </div>

          <div>
            <h4 className='text-xs font-semibold uppercase tracking-[3px] text-accent-mint'>
              {t('features.title')}
            </h4>
            <nav className='mt-5 flex flex-col gap-3'>
              <a href='#features' className='text-sm text-white/60 transition-colors hover:text-white'>
                {t('features.title')}
              </a>
              <a href='#faq' className='text-sm text-white/60 transition-colors hover:text-white'>
                FAQ
              </a>
            </nav>
          </div>

          <div>
            <h4 className='text-xs font-semibold uppercase tracking-[3px] text-accent-mint'>
              {t('nav.brandName')}
            </h4>
            <nav className='mt-5 flex flex-col gap-3'>
              <Link to={toLocalizedPath('/privacy', lang)} className='text-sm text-white/60 transition-colors hover:text-white'>
                Privacy
              </Link>
              <Link to={toLocalizedPath('/terms', lang)} className='text-sm text-white/60 transition-colors hover:text-white'>
                Terms
              </Link>
            </nav>
          </div>

          <div>
            <h4 className='text-xs font-semibold uppercase tracking-[3px] text-accent-mint'>
              {t('nav.contactUs')}
            </h4>
            <div className='mt-5 flex flex-col gap-3'>
              <a href='mailto:hello@champty.com' className='text-sm text-white/60 transition-colors hover:text-white'>
                hello@champty.com
              </a>
            </div>
          </div>
        </div>

        <div className='mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row'>
          <p className='text-xs text-white/40'>
            &copy; {t('footer.copyright', { year })}
          </p>
          <div className='flex items-center gap-4'>
            <Link to={toLocalizedPath('/privacy', lang)} className='text-xs text-white/40 transition-colors hover:text-white/60'>
              Privacy
            </Link>
            <span className='text-white/20'>|</span>
            <Link to={toLocalizedPath('/terms', lang)} className='text-xs text-white/40 transition-colors hover:text-white/60'>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
