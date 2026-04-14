import { useTranslation } from 'react-i18next';
import {
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineBanknotes,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const benefits = [
  { key: 'savesTime', icon: HiOutlineClock },
  { key: 'reducesErrors', icon: HiOutlineShieldCheck },
  { key: 'looksProfessional', icon: HiOutlineSparkles },
  { key: 'savesMoney', icon: HiOutlineBanknotes },
  { key: 'increasesRevenue', icon: HiOutlineArrowTrendingUp },
] as const;

export function WhyItMatters() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-white py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='reveal text-center text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
          {t('whyItMatters.title')}
        </h2>

        <div className='mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {benefits.map((b, index) => {
            const Icon = b.icon;
            return (
              <article
                key={b.key}
                className={`reveal reveal-delay-${index + 1} group rounded-2xl border border-landing-border bg-landing-surface p-6 transition-all hover:-translate-y-1 hover:border-accent-mint/40 hover:shadow-lg hover:shadow-accent-mint/5`}
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-landing-accent-soft text-churn-low transition-colors group-hover:bg-accent-mint/20'>
                  <Icon className='h-6 w-6' />
                </div>
                <h3 className='mt-4 text-lg font-bold text-slate-900'>
                  {t(`whyItMatters.${b.key}`)}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-slate-600'>
                  {t(`whyItMatters.${b.key}Text`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
