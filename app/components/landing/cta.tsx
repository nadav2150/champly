import { Form } from 'react-router';
import { useTranslation } from 'react-i18next';

export function Cta() {
  const { t } = useTranslation('landing');

  return (
    <section className='relative overflow-hidden bg-landing-cta py-14 text-white sm:py-16'>
      <div className='pointer-events-none absolute -top-16 end-20 h-44 w-44 rounded-full bg-white/10' />
      <div className='pointer-events-none absolute -bottom-20 end-1/4 h-56 w-56 rotate-45 bg-white/5' />
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='text-4xl font-bold sm:text-5xl'>
          <span className='me-2 rounded-full border border-[#f66bcc] px-4 py-1 text-white'>{t('cta.titlePrefix')}</span>
          <span>{t('cta.titleSuffix')}</span>
        </h2>
        <p className='mt-4 text-lg text-white/85'>{t('cta.subtitle')}</p>

        <Form className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center'>
          <input
            type='email'
            name='email'
            placeholder={t('cta.emailPlaceholder')}
            className='w-full max-w-xl rounded-md border border-white/25 bg-[#1b2f66] px-4 py-3 text-base placeholder:text-white/55 focus:border-accent-mint focus:outline-none'
          />
          <button
            type='submit'
            className='rounded-md bg-[#39e8b4] px-6 py-3 text-base font-semibold text-[#17324d] hover:brightness-95'
          >
            {t('cta.button')}
          </button>
        </Form>
      </div>
    </section>
  );
}
