import { useTranslation } from 'react-i18next';
import { HiOutlineCheck } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const integrationKeys = [
  'posSync',
  'inventorySync',
  'noDoubleEntry',
  'noDuplicates',
  'worksWithExisting',
] as const;

export function Integration() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-landing-surface py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='reveal'>
            <p className='text-sm font-semibold uppercase tracking-widest text-churn-low'>
              {t('integration.title')}
            </p>
            <h2 className='mt-3 text-3xl font-bold text-slate-900 sm:text-4xl'>
              {t('integration.headline')}
            </h2>
            <p className='mt-4 text-lg leading-relaxed text-slate-600'>
              {t('integration.subtitle')}
            </p>
          </div>

          <div className='reveal reveal-delay-2 space-y-4'>
            {integrationKeys.map((key) => (
              <div
                key={key}
                className='flex items-center gap-4 rounded-xl border border-landing-border bg-white p-4 shadow-sm transition-all hover:border-accent-mint/40 hover:shadow-md'
              >
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-landing-check text-white'>
                  <HiOutlineCheck className='h-4 w-4' strokeWidth={3} />
                </div>
                <p className='text-base font-medium text-slate-800'>
                  {t(`integration.items.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
