import { useTranslation } from 'react-i18next';
import {
  HiOutlineShoppingCart,
  HiOutlineBuildingStorefront,
  HiOutlineTruck,
  HiOutlineBuildingOffice2,
  HiOutlineHeart,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const cases = [
  { key: 'retail', icon: HiOutlineShoppingCart },
  { key: 'warehouses', icon: HiOutlineBuildingStorefront },
  { key: 'logistics', icon: HiOutlineTruck },
  { key: 'offices', icon: HiOutlineBuildingOffice2 },
  { key: 'healthcare', icon: HiOutlineHeart },
  { key: 'operations', icon: HiOutlineWrenchScrewdriver },
] as const;

export function UseCases() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-white py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge'>{t('useCases.title')}</span>
          <h2 className='mt-8 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
            {t('useCases.title')}
          </h2>
          <p className='mx-auto mt-5 max-w-2xl text-lg text-slate-600'>
            {t('useCases.subtitle')}
          </p>
        </div>

        <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {cases.map((c, index) => {
            const Icon = c.icon;
            return (
              <article
                key={c.key}
                className={`reveal reveal-delay-${index + 1} group flex flex-col items-center gap-4 rounded-3xl border border-landing-border bg-landing-surface p-8 text-center transition-all hover:-translate-y-1.5 hover:border-accent-mint/40 hover:shadow-xl hover:shadow-accent-mint/5`}
              >
                <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-landing-hero-from to-landing-hero-to shadow-lg shadow-landing-hero-from/20 transition-transform group-hover:scale-110'>
                  <Icon className='h-8 w-8 text-accent-mint' />
                </div>
                <p className='text-lg font-semibold text-slate-800'>
                  {t(`useCases.${c.key}`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
