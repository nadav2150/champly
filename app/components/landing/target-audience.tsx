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
    <section className='bg-white py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-5xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge'>{t('targetAudience.title')}</span>
          <h2 className='mt-8 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
            {t('targetAudience.title')}
          </h2>
          <p className='mt-5 text-lg text-slate-600'>
            {t('targetAudience.subtitle')}
          </p>
        </div>

        <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {itemKeys.map((key, index) => (
            <div
              key={key}
              className={`reveal reveal-delay-${index + 1} group rounded-2xl border border-landing-border bg-landing-surface p-6 transition-all hover:-translate-y-1 hover:border-accent-mint/40 hover:shadow-lg hover:shadow-accent-mint/5`}
            >
              <div className='mb-4 h-1 w-12 rounded-full bg-linear-to-r from-accent-mint to-churn-low transition-all group-hover:w-20' />
              <div className='flex items-start gap-3'>
                <HiOutlineCheckCircle className='mt-0.5 h-6 w-6 shrink-0 text-churn-low' />
                <p className='text-base font-medium text-slate-800'>
                  {t(`targetAudience.items.${key}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
