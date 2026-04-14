import { useTranslation } from 'react-i18next';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const itemKeys = [
  'stopManual',
  'syncPosShelf',
  'fasterPromos',
  'multiBranch',
  'lookProfessional',
  'smartInfra',
] as const;

export function TargetAudience() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-white py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-4xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <h2 className='text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
            {t('targetAudience.title')}
          </h2>
          <p className='mt-4 text-lg text-slate-600'>
            {t('targetAudience.subtitle')}
          </p>
        </div>

        <div className='mt-12 grid gap-4 sm:grid-cols-2'>
          {itemKeys.map((key, index) => (
            <div
              key={key}
              className={`reveal reveal-delay-${index + 1} flex items-center gap-3 rounded-xl border border-landing-border bg-landing-surface p-4 transition-all hover:border-accent-mint/40 hover:shadow-md`}
            >
              <HiOutlineCheckCircle className='h-6 w-6 shrink-0 text-churn-low' />
              <p className='text-base font-medium text-slate-800'>
                {t(`targetAudience.items.${key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
