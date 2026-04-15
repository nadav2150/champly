import { useTranslation } from 'react-i18next';

import { useReveal } from '../../lib/use-reveal';

const itemKeys = [
  'realTimeControl',
  'eslAdoption',
  'automationShift',
  'paperless',
  'operationalAccuracy',
] as const;

export function WhyNow() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-landing-surface py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-4xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge'>{t('whyNow.title')}</span>
          <h2 className='mt-8 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
            {t('whyNow.title')}
          </h2>
        </div>

        <div className='relative mt-14'>
          <div className='absolute bottom-0 left-6 top-0 w-px bg-linear-to-b from-accent-mint/40 via-landing-border to-transparent sm:left-8' />

          <div className='space-y-4'>
            {itemKeys.map((key, index) => (
              <div
                key={key}
                className={`reveal reveal-delay-${index + 1} relative flex items-center gap-5 ps-14 sm:ps-20`}
              >
                <div className='absolute left-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent-mint text-xs font-bold text-accent-mint-text shadow-md sm:left-5'>
                  {index + 1}
                </div>
                <div className='flex-1 rounded-2xl border border-landing-border bg-white p-5 shadow-sm transition-all hover:border-accent-mint/40 hover:shadow-md'>
                  <p className='text-base font-medium text-slate-800 sm:text-lg'>
                    {t(`whyNow.items.${key}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
