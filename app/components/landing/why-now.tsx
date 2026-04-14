import { useTranslation } from 'react-i18next';
import { HiOutlineArrowRight } from 'react-icons/hi2';

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
    <section className='bg-landing-surface py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-4xl px-5 sm:px-6 lg:px-8'>
        <h2 className='reveal text-center text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
          {t('whyNow.title')}
        </h2>

        <div className='mt-12 space-y-4'>
          {itemKeys.map((key, index) => (
            <div
              key={key}
              className={`reveal reveal-delay-${index + 1} flex items-center gap-4 rounded-xl border border-landing-border bg-white p-5 transition-all hover:border-accent-mint/40 hover:shadow-md`}
            >
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-mint/15'>
                <HiOutlineArrowRight className='h-4 w-4 text-churn-low' strokeWidth={2.5} />
              </div>
              <p className='text-base font-medium text-slate-800 sm:text-lg'>
                {t(`whyNow.items.${key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
