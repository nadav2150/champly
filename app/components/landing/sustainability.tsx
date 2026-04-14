import { useTranslation } from 'react-i18next';
import { HiOutlineCheck } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const itemKeys = ['lessLabels', 'lessPrinting', 'lessManualWork', 'moreOrder'] as const;

export function Sustainability() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  return (
    <section className='bg-gradient-to-br from-[#0b3a40] to-[#001d22] py-16 text-white sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='reveal'>
            <h2 className='text-3xl font-bold sm:text-4xl lg:text-5xl'>
              {t('sustainability.title')}
            </h2>
            <p className='mt-4 text-lg text-white/70'>
              {t('sustainability.subtitle')}
            </p>
          </div>

          <div className='reveal reveal-delay-2 space-y-4'>
            {itemKeys.map((key) => (
              <div
                key={key}
                className='flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-accent-mint/30 hover:bg-white/10'
              >
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-mint/20'>
                  <HiOutlineCheck className='h-4 w-4 text-accent-mint' strokeWidth={3} />
                </div>
                <p className='text-base font-medium text-white/90'>
                  {t(`sustainability.items.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
