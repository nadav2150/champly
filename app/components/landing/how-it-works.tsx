import { useTranslation } from 'react-i18next';

type WorkStep = {
  icon: string;
  title: string;
  text: string;
};

export function HowItWorks() {
  const { t } = useTranslation('landing');
  const steps: WorkStep[] = [
    { icon: '🗂', title: t('howItWorks.step1Title'), text: t('howItWorks.step1Text') },
    { icon: '✉️', title: t('howItWorks.step2Title'), text: t('howItWorks.step2Text') },
    { icon: '📋', title: t('howItWorks.step3Title'), text: t('howItWorks.step3Text') },
  ];

  return (
    <section className='bg-landing-surface py-14 sm:py-20'>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='text-center text-3xl font-bold text-[#26345d] sm:text-5xl'>
          <span className='me-2 rounded-full border border-[#f66bcc] px-4 py-1 text-[#6b4ad4]'>
            {t('howItWorks.titlePrefix')}
          </span>
          <span>{t('howItWorks.titleSuffix')}</span>
        </h2>

        <div className='mt-10 grid gap-5 lg:grid-cols-3'>
          {steps.map((step) => (
            <article
              key={step.title}
              className='rounded-2xl bg-gradient-to-r from-[#0c78ff] to-[#f66bcc] p-[1px]'
            >
              <div className='h-full rounded-2xl bg-white p-6'>
                <span className='inline-flex h-14 w-14 items-center justify-center rounded-lg bg-[#eef3ff] text-3xl'>
                  {step.icon}
                </span>
                <h3 className='mt-5 text-2xl font-bold text-[#2f3e69]'>{step.title}</h3>
                <p className='mt-3 text-base text-[#546285]'>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
