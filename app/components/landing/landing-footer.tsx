import { useTranslation } from 'react-i18next';

export function LandingFooter() {
  const { t } = useTranslation('landing');
  const year = new Date().getFullYear();

  return (
    <footer className='bg-[#1a2460] py-8 text-white'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 sm:flex-row sm:px-6 lg:px-8'>
        <div className='inline-flex items-center gap-2'>
          <span aria-hidden className='text-lg text-accent-mint'>✦</span>
          <span className='leading-tight'>
            <span className='block text-lg font-bold'>{t('footer.brandName')}</span>
            <span className='block text-xs text-white/70'>{t('footer.brandByline')}</span>
          </span>
        </div>

        <p className='text-sm text-white/80'>{t('footer.copyright', { year })}</p>

        <div className='inline-flex items-center gap-2 text-sm text-white/80'>
          <span>{t('footer.poweredBy')}</span>
          <span className='font-semibold text-accent-mint'>Partisia Blockchain</span>
        </div>
      </div>
    </footer>
  );
}
