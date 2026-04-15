import { useTranslation } from 'react-i18next';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const traditionalKeys = [
  'manualUpdates',
  'slowPromos',
  'noConnection',
  'separateBranches',
  'noTesting',
] as const;

const champtyKeys = [
  'autoSync',
  'instantPromos',
  'fullSync',
  'oneDashboard',
  'abTesting',
] as const;

export function Comparison() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-landing-surface py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge'>{t('comparison.title')}</span>
          <h2 className='mt-8 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
            {t('comparison.title')}
          </h2>
        </div>

        <div className='mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8'>
          <div className='reveal reveal-delay-1 glass-card rounded-3xl p-8'>
            <h3 className='text-xl font-bold text-slate-900'>{t('comparison.traditional')}</h3>
            <div className='mt-8 space-y-4'>
              {traditionalKeys.map((key) => (
                <div key={key} className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-landing-cross/10'>
                    <HiOutlineXMark className='h-4 w-4 text-landing-cross' strokeWidth={3} />
                  </div>
                  <p className='text-base text-slate-600'>
                    {t(`comparison.traditionalItems.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='reveal reveal-delay-2 dark-banner animate-glow-pulse p-8 text-white'>
            <div className='pointer-events-none absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-accent-mint/8 blur-[60px]' />
            <h3 className='relative text-xl font-bold text-accent-mint'>{t('comparison.champty')}</h3>
            <div className='relative mt-8 space-y-4'>
              {champtyKeys.map((key) => (
                <div key={key} className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-mint/20'>
                    <HiOutlineCheck className='h-4 w-4 text-accent-mint' strokeWidth={3} />
                  </div>
                  <p className='text-base text-white/80'>
                    {t(`comparison.champtyItems.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='reveal reveal-delay-3 mt-12 text-center'>
          <p className='inline-block rounded-full bg-accent-mint/10 px-6 py-3 text-lg font-semibold text-slate-800'>
            {t('comparison.bottomLine')}
          </p>
        </div>
      </div>
    </section>
  );
}
