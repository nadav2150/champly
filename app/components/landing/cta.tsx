import { useTranslation } from 'react-i18next';

import { useReveal } from '../../lib/use-reveal';

export function Cta() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section id='cta' className='relative overflow-hidden bg-landing-cta py-20 text-white sm:py-28' ref={ref}>
      <div className='pointer-events-none absolute -top-20 end-10 h-56 w-56 rounded-full bg-accent-mint/10 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-24 start-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl' />

      <div className='relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8'>
        <h2 className='reveal text-3xl font-bold sm:text-4xl lg:text-5xl'>
          {t('cta.title')}
        </h2>
        <p className='reveal reveal-delay-1 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80'>
          {t('cta.subtitle')}
        </p>

        <div className='reveal reveal-delay-2 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <a
            href='mailto:hello@champty.com?subject=Demo%20Request'
            className='inline-flex rounded-lg bg-accent-mint px-8 py-3.5 text-base font-bold text-accent-mint-text shadow-lg shadow-accent-mint/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-mint/30 hover:brightness-95 sm:text-lg'
          >
            {t('cta.requestDemo')}
          </a>
          <a
            href='mailto:hello@champty.com?subject=Contact%20Us'
            className='inline-flex rounded-lg border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:text-lg'
          >
            {t('cta.contactUs')}
          </a>
        </div>
      </div>
    </section>
  );
}
