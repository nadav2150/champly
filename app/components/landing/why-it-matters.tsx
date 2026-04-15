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
    <section className='bg-white py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='grid items-start gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24'>
          <div className='reveal'>
            <span className='section-badge'>{t('whyItMatters.title')}</span>
            <h2 className='mt-8 text-[2.5rem] font-bold capitalize leading-[1.1] tracking-tight text-slate-900 sm:text-[3rem]'>
              {t('whyItMatters.title')}
            </h2>
            <p className='mt-5 text-lg leading-relaxed text-slate-600'>
              {t('whyItMatters.savesTimeText')}
            </p>
            <a href='#cta' className='btn-primary-pill mt-8'>
              {t('hero.requestDemo')}
            </a>
          </div>

          <div className='space-y-4'>
            {benefits.map((b, index) => {
              const Icon = b.icon;
              return (
                <article
                  key={b.key}
                  className={`reveal reveal-delay-${index + 1} group flex items-start gap-5 rounded-2xl border border-landing-border bg-landing-surface p-5 transition-all hover:-translate-y-0.5 hover:border-accent-mint/40 hover:shadow-lg hover:shadow-accent-mint/5`}
                >
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-landing-hero-from to-landing-hero-to shadow-md'>
                    <Icon className='h-6 w-6 text-accent-mint' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-slate-900'>
                      {t(`whyItMatters.${b.key}`)}
                    </h3>
                    <p className='mt-1.5 text-sm leading-relaxed text-slate-600'>
                      {t(`whyItMatters.${b.key}Text`)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
