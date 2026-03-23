import { useTranslation } from 'react-i18next';

const featureIcon = ['✧', '◉', '◎', '✦', '⬢', '◍'];

export function Features() {
  const { t } = useTranslation('landing');
  const options = t('features.surveyMock.options', { returnObjects: true }) as string[];
  const featureItems = [
    t('features.items.blockchainPowered'),
    t('features.items.instantCryptoPayments'),
    t('features.items.freeUnlimitedAccess'),
    t('features.items.dailyRewards'),
    t('features.items.builtInKyc'),
    t('features.items.privateData'),
  ];

  return (
    <section className='bg-landing-surface py-14 sm:py-20'>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='text-center text-3xl font-bold text-[#26345d] sm:text-4xl'>
          <span className='me-2 text-[#26345d]'>{t('features.titlePrefix')}</span>
          <span className='rounded-full border border-[#f66bcc] px-4 py-1 text-[#6b4ad4]'>
            {t('features.titleHighlight')}
          </span>
          <span className='ms-2 text-[#26345d]'>{t('features.titleSuffix')}</span>
        </h2>

        <div className='mt-10 grid gap-8 lg:grid-cols-2 lg:items-center'>
          <div className='relative rounded-2xl bg-[#e8eef0] p-5'>
            <div className='absolute -left-4 top-4 w-full max-w-xs rounded-xl border border-landing-border bg-white p-4 shadow-sm'>
              <p className='text-sm font-semibold text-[#26345d]'>{t('features.surveyMock.question')}</p>
              <div className='mt-3 space-y-2'>
                {options.map((option, index) => (
                  <div
                    key={option}
                    className='flex items-center gap-2 rounded-md border border-[#90bde6] bg-[#f8fbff] px-2 py-1 text-sm text-[#35538d]'
                  >
                    <span className='inline-flex h-5 w-5 items-center justify-center rounded bg-[#2b7de9] text-xs font-semibold text-white'>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                ))}
              </div>
              <button className='mt-3 rounded-md bg-gradient-to-r from-[#2b7de9] to-[#7d50ff] px-4 py-1.5 text-sm font-semibold text-white'>
                {t('features.surveyMock.submit')}
              </button>
            </div>

            <div className='ms-20 mt-20 max-w-sm rounded-2xl bg-white p-5 shadow-md'>
              <p className='text-2xl font-bold text-[#2f3e69]'>{t('features.surveyMock.completedTitle')}</p>
              <p className='mt-2 text-sm text-[#6a7699]'>{t('features.surveyMock.completedText')}</p>
              <div className='mt-4 flex items-center justify-between rounded-md bg-[#edf3fd] p-3'>
                <span className='text-xl font-semibold text-[#2f3e69]'>$5.00</span>
                <span className='text-xs text-[#6a7699]'>
                  {t('features.surveyMock.claimCodeLabel')} <b>F1BX20</b>
                </span>
              </div>
              <button className='mt-4 w-full rounded-md bg-[#0ac47a] py-2 font-semibold text-white'>
                {t('features.surveyMock.walletCta')}
              </button>
            </div>
          </div>

          <div className='space-y-3'>
            {featureItems.map((item, index) => (
              <article
                key={item}
                className='flex items-center gap-4 rounded-xl border border-landing-border bg-white px-4 py-4 shadow-sm'
              >
                <div className='h-10 w-1 rounded-full bg-[#3a43f0]' />
                <span className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e8fff6] text-[#0aaf7f]'>
                  {featureIcon[index]}
                </span>
                <p className='text-lg font-semibold text-[#2f3e69]'>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
