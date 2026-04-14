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
  { key: 'realTimePricing', icon: HiOutlineBolt },
  { key: 'smartDisplays', icon: HiOutlineAdjustmentsHorizontal },
  { key: 'timeAutomations', icon: HiOutlineCalendarDays },
  { key: 'scheduledCampaigns', icon: HiOutlineMegaphone },
  { key: 'abTesting', icon: HiOutlineChartBar },
  { key: 'autoFit', icon: HiOutlineDevicePhoneMobile },
] as const;

export function Capabilities() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-gradient-to-b from-[#001d22] to-[#0b3a40] py-16 text-white sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <h2 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>
            {t('capabilities.title')}{' '}
            <span className='text-accent-mint'>{t('capabilities.titleHighlight')}</span>
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-lg text-white/70'>
            {t('capabilities.subtitle')}
          </p>
        </div>

        <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.key}
                className={`reveal reveal-delay-${index + 1} group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-accent-mint/30 hover:bg-white/10`}
              >
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-mint/15'>
                  <Icon className='h-5 w-5 text-accent-mint' />
                </div>
                <p className='text-base font-medium leading-relaxed text-white/90'>
                  {t(`capabilities.items.${item.key}`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
