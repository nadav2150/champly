import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

import { getLanguageFromPathname, toLocalizedPath } from '../../i18n/config';

const trustDots = Array.from({ length: 8 });

export function Hero() {
  const { pathname } = useLocation();
  const { t } = useTranslation('landing');
  const language = getLanguageFromPathname(pathname);

  return (
    <section className='relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-16'>
      <div className='pointer-events-none absolute -left-16 top-24 h-52 w-52 rounded-full bg-white/10 blur-3xl' />
      <div className='pointer-events-none absolute -right-12 bottom-10 h-64 w-64 rounded-full bg-accent-mint/20 blur-3xl' />
      <div className='pointer-events-none absolute left-1/2 top-1/3 h-32 w-80 -translate-x-1/2 rounded-full bg-white/10 blur-2xl' />

      <div className='relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl'>
          <span className='block'>{t('hero.titleLine1')}</span>
          <span className='block'>{t('hero.titleLine2')}</span>
        </h1>
        <p className='mx-auto mt-6 max-w-3xl text-base leading-7 text-landing-muted-text sm:text-lg'>
          {t('hero.subtitle')}
        </p>

        <Link
          to='/register'
          className='mt-8 inline-flex rounded-md bg-accent-mint px-6 py-3 text-base font-semibold text-accent-mint-text hover:brightness-95'
        >
          {t('hero.cta')}
        </Link>

        <div className='mt-8 flex items-center justify-center gap-2'>
          {trustDots.map((_, index) => (
            <span
              key={index}
              className='h-3 w-3 rounded-full bg-black/20 sm:h-4 sm:w-4'
              aria-hidden
            />
          ))}
        </div>

        <div className='mt-8 flex items-center justify-center gap-2 text-sm text-white/85 sm:text-base'>
          <span>{t('hero.poweredBy')}</span>
          <span className='inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 font-semibold'>
            <span className='text-accent-mint'>◈</span>
            Partisia
          </span>
        </div>

        <div className='mt-4 text-xs text-white/50'>
          <Link to={toLocalizedPath('/landing', language)}>{t('nav.brandName')}</Link>
        </div>
      </div>
    </section>
  );
}
