import { useTranslation } from 'react-i18next';
import { HiOutlineComputerDesktop, HiOutlineCog6Tooth, HiOutlineSignal } from 'react-icons/hi2';

import { useReveal } from '../../lib/use-reveal';

const stepIcons = [HiOutlineComputerDesktop, HiOutlineCog6Tooth, HiOutlineSignal];

export function HowItWorks() {
  const { t } = useTranslation('landing');
  const ref = useReveal();

  const steps = [
    { title: t('howItWorks.step1Title'), text: t('howItWorks.step1Text') },
    { title: t('howItWorks.step2Title'), text: t('howItWorks.step2Text') },
    { title: t('howItWorks.step3Title'), text: t('howItWorks.step3Text') },
  ];

  return (
    <section className='bg-landing-surface py-16 sm:py-24' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='reveal text-center text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl'>
          {t('howItWorks.title')}
        </h2>

        <div className='relative mt-14 grid gap-8 lg:grid-cols-3'>
          <div className='pointer-events-none absolute left-0 right-0 top-16 z-0 hidden lg:block'>
            <div className='mx-auto h-0.5 w-3/4 bg-gradient-to-r from-transparent via-accent-mint/40 to-transparent' />
          </div>

          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <article
                key={step.title}
                className={`reveal reveal-delay-${index + 1} group relative z-10`}
              >
                <div className='flex flex-col items-center text-center'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b3a40] to-[#0f4a4f] shadow-lg shadow-[#0b3a40]/20 transition-transform group-hover:-translate-y-1'>
                    <Icon className='h-7 w-7 text-accent-mint' />
                  </div>
                  <span className='mt-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-mint text-sm font-bold text-accent-mint-text'>
                    {index + 1}
                  </span>
                  <h3 className='mt-4 text-xl font-bold text-slate-900'>{step.title}</h3>
                  <p className='mt-3 text-base leading-relaxed text-slate-600'>{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
