import { useTranslation } from 'react-i18next';
import {
  HiOutlineSquares2X2,
  HiOutlineBolt,
  HiOutlineRectangleGroup,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineCpuChip,
  HiOutlineCommandLine,
  HiOutlinePuzzlePiece,
} from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const featureCards = [
  { key: 'centralControl', icon: HiOutlineSquares2X2 },
  { key: 'realTimeUpdates', icon: HiOutlineBolt },
  { key: 'smartTemplates', icon: HiOutlineRectangleGroup },
  { key: 'timeAutomations', icon: HiOutlineCalendarDays },
  { key: 'abTesting', icon: HiOutlineChartBar },
  { key: 'hardwareMonitoring', icon: HiOutlineCpuChip },
  { key: 'remoteCommands', icon: HiOutlineCommandLine },
  { key: 'multiHardware', icon: HiOutlinePuzzlePiece },
] as const;

export function Features() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section id='features' className='bg-white py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge'>{t('features.title')}</span>
          <h2 className='mt-8 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
            {t('features.title')}
          </h2>
        </div>

        <div className='mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article
                key={card.key}
                className={`reveal reveal-delay-${(index % 4) + 1} group rounded-2xl border border-landing-border bg-landing-surface p-6 transition-all hover:-translate-y-1.5 hover:border-accent-mint/40 hover:shadow-xl hover:shadow-accent-mint/5`}
              >
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-landing-hero-from to-landing-hero-to shadow-lg shadow-landing-hero-from/20 transition-transform group-hover:scale-105'>
                  <Icon className='h-7 w-7 text-accent-mint' />
                </div>
                <h3 className='mt-5 text-lg font-bold text-slate-900'>
                  {t(`features.${card.key}`)}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-slate-600'>
                  {t(`features.${card.key}Text`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
