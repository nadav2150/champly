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
    <section className='bg-landing-surface py-20 sm:py-28' ref={ref}>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge'>{t('howItWorks.title')}</span>
        </div>

        <div className='relative mt-16 grid gap-6 lg:grid-cols-3 lg:gap-0'>
          <div className='pointer-events-none absolute left-[16%] right-[16%] top-[60px] z-0 hidden lg:block'>
            <div className='h-px w-full bg-linear-to-r from-transparent via-landing-border to-transparent' />
          </div>

          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <article
                key={step.title}
                className={`reveal reveal-delay-${index + 1} group relative z-10 px-4`}
              >
                <div className='flex flex-col items-center text-center'>
                  <div className='glass-card flex h-20 w-20 items-center justify-center rounded-3xl transition-all group-hover:-translate-y-1 group-hover:shadow-lg'>
                    <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-landing-hero-from to-landing-hero-to'>
                      <Icon className='h-7 w-7 text-accent-mint' />
                    </div>
                  </div>
                  <span className='mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-mint text-sm font-bold text-accent-mint-text shadow-md'>
                    {index + 1}
                  </span>
                  <h3 className='mt-5 text-xl font-bold text-slate-900'>{step.title}</h3>
                  <p className='mt-3 max-w-xs text-base leading-relaxed text-slate-600'>{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
