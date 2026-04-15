import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden pb-24 pt-12 sm:pb-32 sm:pt-20 lg:pb-40 lg:pt-24'>
      <div className='pointer-events-none absolute -left-32 top-10 h-[400px] w-[400px] animate-float rounded-full bg-accent-mint/8 blur-[100px]' />
      <div className='pointer-events-none absolute -right-24 bottom-0 h-[500px] w-[500px] animate-float-delayed rounded-full bg-white/5 blur-[120px]' />
      <div className='pointer-events-none absolute left-1/3 top-1/4 h-[300px] w-[600px] animate-pulse-soft rounded-full bg-accent-mint/5 blur-[80px]' />
      <div className='pointer-events-none absolute right-1/4 top-1/3 h-[200px] w-[200px] animate-float-slow rounded-full bg-landing-hero-to/40 blur-[60px]' />

      <div className='relative mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-8'>
        <div className='animate-fade-in'>
          <h1 className='text-[2rem] font-extrabold capitalize leading-[1.1] tracking-tight text-white sm:text-[3.5rem] lg:text-[4rem]'>
            {t('hero.tagline')}
          </h1>
        </div>

        <p className='mx-auto mt-6 max-w-3xl animate-fade-in-up text-base leading-relaxed tracking-tight text-landing-muted-text sm:text-lg lg:text-xl'>
          {t('hero.subtitle')}
        </p>

        <div className='mt-10 flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row'>
          <a href='#cta' className='btn-primary-pill'>
            {t('hero.requestDemo')}
          </a>
          <a href='#cta' className='btn-outline-pill'>
            {t('hero.contactUs')}
          </a>
        </div>

        <div className='mx-auto mt-10 max-w-[280px] animate-fade-in-up sm:mt-16 sm:max-w-md md:max-w-lg lg:max-w-2xl'>
          <img src='/heroImage.svg' alt='' className='h-auto w-full' />
        </div>

        <p className='mx-auto mt-8 max-w-2xl animate-fade-in text-sm leading-relaxed text-white/50 sm:text-base'>
          {t('valueProposition.text')}
        </p>
      </div>
    </section>
  );
}
