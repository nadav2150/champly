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
    <section className='bg-landing-surface py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-14 lg:grid-cols-2 lg:gap-24'>
          <div className='reveal'>
            <span className='section-badge'>{t('integration.title')}</span>
            <h2 className='mt-8 text-[2.5rem] font-bold capitalize leading-[1.1] tracking-tight text-slate-900 sm:text-[3rem]'>
              {t('integration.headline')}
            </h2>
            <p className='mt-5 text-lg leading-relaxed text-slate-600'>
              {t('integration.subtitle')}
            </p>
          </div>

          <div className='reveal reveal-delay-2'>
            <div className='glass-card space-y-3 rounded-3xl p-6 sm:p-8'>
              {integrationKeys.map((key, index) => (
                <div
                  key={key}
                  className={`reveal-delay-${index + 1} flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md`}
                >
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-landing-check shadow-sm'>
                    <HiOutlineCheck className='h-4 w-4 text-white' strokeWidth={3} />
                  </div>
                  <p className='text-base font-medium text-slate-800'>
                    {t(`integration.items.${key}`)}
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
