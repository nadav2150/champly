import { useTranslation } from 'react-i18next';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const traditionalKeys = [
  'closedBundle',
  'vendorLock',
  'limitedFlexibility',
  'noAutomation',
] as const;

const champtyKeys = [
  'systemNotManufacturer',
  'existingHardware',
  'flexible',
  'builtForIntegration',
  'allInOne',
] as const;

export function Comparison() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-landing-surface py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='reveal text-center text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
          {t('comparison.title')}
        </h2>

        <div className='mt-14 grid gap-8 lg:grid-cols-2'>
          <div className='reveal reveal-delay-1 rounded-2xl border border-landing-cross/20 bg-white p-8'>
            <h3 className='text-xl font-bold text-slate-900'>{t('comparison.traditional')}</h3>
            <div className='mt-6 space-y-4'>
              {traditionalKeys.map((key) => (
                <div key={key} className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-landing-cross/10'>
                    <HiOutlineXMark className='h-4 w-4 text-landing-cross' strokeWidth={3} />
                  </div>
                  <p className='text-base text-slate-600'>
                    {t(`comparison.traditionalItems.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='reveal reveal-delay-2 rounded-2xl border border-accent-mint/30 bg-gradient-to-br from-[#001d22] to-[#0b3a40] p-8 text-white'>
            <h3 className='text-xl font-bold text-accent-mint'>{t('comparison.champty')}</h3>
            <div className='mt-6 space-y-4'>
              {champtyKeys.map((key) => (
                <div key={key} className='flex items-start gap-3'>
                  <div className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-mint/20'>
                    <HiOutlineCheck className='h-4 w-4 text-accent-mint' strokeWidth={3} />
                  </div>
                  <p className='text-base text-white/85'>
                    {t(`comparison.champtyItems.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className='reveal reveal-delay-3 mt-10 text-center text-lg font-semibold text-slate-700 sm:text-xl'>
          {t('comparison.bottomLine')}
        </p>
      </div>
    </section>
  );
}
