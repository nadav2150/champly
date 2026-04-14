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
    <section className='bg-white py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <h2 className='text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
            {t('useCases.title')}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-slate-600'>
            {t('useCases.subtitle')}
          </p>
        </div>

        <div className='mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6'>
          {cases.map((c, index) => {
            const Icon = c.icon;
            return (
              <article
                key={c.key}
                className={`reveal reveal-delay-${index + 1} group flex flex-col items-center gap-3 rounded-2xl border border-landing-border bg-landing-surface p-6 text-center transition-all hover:-translate-y-1 hover:border-accent-mint/40 hover:shadow-md`}
              >
                <div className='flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b3a40] to-[#0f4a4f] shadow-md transition-transform group-hover:scale-110'>
                  <Icon className='h-7 w-7 text-accent-mint' />
                </div>
                <p className='text-sm font-semibold text-slate-800'>
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
