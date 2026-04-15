import { useTranslation } from 'react-i18next';
import { HiOutlineCheck } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const itemKeys = ['lessLabels', 'lessPrinting', 'lessManualWork', 'moreOrder'] as const;

export function Sustainability() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='relative py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='dark-banner px-6 py-16 sm:px-12 sm:py-24'>
          <div className='pointer-events-none absolute -left-20 top-1/4 h-[350px] w-[350px] animate-float-slow rounded-full bg-accent-mint/5 blur-[100px]' />
          <div className='pointer-events-none absolute -bottom-20 right-10 h-[250px] w-[250px] animate-float rounded-full bg-landing-hero-to/20 blur-[80px]' />

          <div className='relative grid items-center gap-14 lg:grid-cols-2 lg:gap-24'>
            <div className='reveal'>
              <span className='section-badge bg-white/10! text-accent-mint!'>{t('sustainability.title')}</span>
              <h2 className='mt-8 text-3xl font-bold text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
                {t('sustainability.title')}
              </h2>
              <p className='mt-5 text-lg text-white/60'>
                {t('sustainability.subtitle')}
              </p>
            </div>

            <div className='reveal reveal-delay-2 space-y-4'>
              {itemKeys.map((key, index) => (
                <div
                  key={key}
                  className={`reveal-delay-${index + 1} flex items-center gap-4 rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm transition-all hover:border-accent-mint/25 hover:bg-white/8`}
                >
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-mint/15'>
                    <HiOutlineCheck className='h-4 w-4 text-accent-mint' strokeWidth={3} />
                  </div>
                  <p className='text-base font-medium text-white/85'>
                    {t(`sustainability.items.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
