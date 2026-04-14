import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-28'>
      <div className='pointer-events-none absolute -left-20 top-20 h-72 w-72 animate-float rounded-full bg-accent-mint/10 blur-3xl' />
      <div className='pointer-events-none absolute -right-16 bottom-16 h-80 w-80 animate-float-delayed rounded-full bg-white/10 blur-3xl' />
      <div className='pointer-events-none absolute left-1/2 top-1/3 h-40 w-96 -translate-x-1/2 animate-pulse-soft rounded-full bg-accent-mint/5 blur-2xl' />

      <div className='relative mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8'>
        <div className='animate-fade-in'>
          <h1 className='text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl'>
            {t('hero.tagline')}
          </h1>
        </div>

        <p className='mx-auto mt-6 max-w-3xl animate-fade-in-up text-lg leading-relaxed text-landing-muted-text sm:text-xl lg:text-2xl'>
          {t('hero.subtitle')}
        </p>

        <div className='mt-10 flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row'>
          <a
            href='#cta'
            className='inline-flex rounded-lg bg-accent-mint px-8 py-3.5 text-base font-bold text-accent-mint-text shadow-lg shadow-accent-mint/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent-mint/30 hover:brightness-95 sm:text-lg'
          >
            {t('hero.requestDemo')}
          </a>
          <a
            href='#cta'
            className='inline-flex rounded-lg border border-white/25 px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 sm:text-lg'
          >
            {t('hero.contactUs')}
          </a>
        </div>

        <div className='mx-auto mt-16 max-w-2xl animate-fade-in-up'>
          <div className='relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-accent-mint/20'>
                <svg className='h-5 w-5 text-accent-mint' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <p className='text-base font-medium text-white/90 sm:text-lg'>
                {t('hero.bottomLine')}
              </p>
            </div>
          </div>
        </div>

        <p className='mx-auto mt-8 max-w-2xl animate-fade-in text-sm leading-relaxed text-white/60 sm:text-base'>
          {t('valueProposition.text')}
        </p>
      </div>
    </section>
  );
}
