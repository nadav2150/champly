import { useTranslation } from 'react-i18next';

export function LandingFooter() {
  const { t } = useTranslation('landing');
  const year = new Date().getFullYear();

  return (
    <footer className='bg-[#001218] py-10 text-white'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-6 lg:px-8'>
        <div className='inline-flex items-center gap-3'>
          <img src='/logo_no_text.svg' alt='Champty' className='h-8 w-auto opacity-80' />
          <span className='leading-tight'>
            <span className='block font-kindred text-base font-bold tracking-wider text-[#f5f5dc]'>
              {t('footer.brandName')}
            </span>
            <span className='block text-xs text-white/50'>
              {t('footer.brandByline')}
            </span>
          </span>
        </div>

        <p className='text-sm text-white/50'>
          {t('footer.copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
