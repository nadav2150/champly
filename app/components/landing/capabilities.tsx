import { useTranslation } from 'react-i18next';
import {
  HiOutlineBolt,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineCalendarDays,
  HiOutlineMegaphone,
  HiOutlineChartBar,
  HiOutlineDevicePhoneMobile,
} from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const items = [
  { key: 'realTimePricing', icon: HiOutlineBolt, span: 'col-span-1' },
  { key: 'smartDisplays', icon: HiOutlineAdjustmentsHorizontal, span: 'col-span-1 lg:col-span-2' },
  { key: 'timeAutomations', icon: HiOutlineCalendarDays, span: 'col-span-1' },
  { key: 'scheduledCampaigns', icon: HiOutlineMegaphone, span: 'col-span-1' },
  { key: 'abTesting', icon: HiOutlineChartBar, span: 'col-span-1 lg:col-span-2' },
  { key: 'autoFit', icon: HiOutlineDevicePhoneMobile, span: 'col-span-1' },
] as const;

export function Capabilities() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='relative overflow-hidden py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='dark-banner px-6 py-16 sm:px-12 sm:py-24'>
          <div className='pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-accent-mint/5 blur-[100px]' />
          <div className='pointer-events-none absolute -bottom-32 -left-16 h-[300px] w-[300px] rounded-full bg-landing-hero-to/30 blur-[80px]' />

          <div className='reveal relative text-center'>
            <span className='section-badge bg-white/10! text-accent-mint!'>{t('capabilities.title')}</span>
            <h2 className='mt-8 text-3xl font-bold text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
              {t('capabilities.title')}{' '}
              <span className='text-accent-mint'>{t('capabilities.titleHighlight')}</span>
            </h2>
            <p className='mx-auto mt-5 max-w-2xl text-lg text-white/60'>
              {t('capabilities.subtitle')}
            </p>
          </div>

          <div className='relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.key}
                  className={`reveal reveal-delay-${index + 1} ${item.span} group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm transition-all hover:border-accent-mint/25 hover:bg-white/8`}
                >
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-mint/10 transition-colors group-hover:bg-accent-mint/20'>
                    <Icon className='h-5 w-5 text-accent-mint' />
                  </div>
                  <p className='text-base font-medium leading-relaxed text-white/85'>
                    {t(`capabilities.items.${item.key}`)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
