import { useTranslation } from 'react-i18next';

import { useReveal } from '../../lib/use-reveal';

export function Cta() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section id='cta' className='relative py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='dark-banner px-6 py-16 sm:px-12 sm:py-24'>
          <div className='pointer-events-none absolute -right-16 -top-16 h-[400px] w-[400px] animate-float-slow rounded-full bg-accent-mint/6 blur-[100px]' />
          <div className='pointer-events-none absolute -bottom-20 left-1/4 h-[350px] w-[350px] animate-float rounded-full bg-white/3 blur-[80px]' />
          <div className='pointer-events-none absolute left-10 top-1/3 h-[200px] w-[200px] animate-pulse-soft rounded-full bg-landing-hero-to/20 blur-[60px]' />

          <div className='relative mx-auto max-w-3xl text-center'>
            <div className='reveal'>
              <span className='section-badge bg-white/10! text-accent-mint!'>{t('cta.title')}</span>
              <h2 className='mt-8 text-3xl font-bold text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
                {t('cta.title')}
              </h2>
            </div>
            <p className='reveal reveal-delay-1 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70'>
              {t('cta.subtitle')}
            </p>

            <div className='reveal reveal-delay-2 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <a
                href='mailto:hello@champty.com?subject=Demo%20Request'
                className='btn-primary-pill'
              >
                {t('cta.requestDemo')}
                <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </a>
              <a
                href='mailto:hello@champty.com?subject=Contact%20Us'
                className='btn-outline-pill'
              >
                {t('cta.contactUs')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
