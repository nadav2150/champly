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
    <section className='bg-white py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='reveal text-center text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
          {t('features.title')}
        </h2>

        <div className='mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article
                key={card.key}
                className={`reveal reveal-delay-${(index % 4) + 1} group rounded-2xl border border-landing-border bg-landing-surface p-6 transition-all hover:-translate-y-1 hover:border-accent-mint/40 hover:shadow-lg hover:shadow-accent-mint/5`}
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b3a40] to-[#0f4a4f] shadow-md'>
                  <Icon className='h-6 w-6 text-accent-mint' />
                </div>
                <h3 className='mt-4 text-lg font-bold text-slate-900'>
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
