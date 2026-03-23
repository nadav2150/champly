import { useTranslation } from 'react-i18next';

type ComparisonRow = {
  label: string;
  modern: 'yes' | 'tokens';
  legacy: 'no' | 'bar';
};

const paymentTokens = Array.from({ length: 8 });

function CheckCell() {
  return <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#10bf77] text-white'>✓</span>;
}

function XCell() {
  return <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ef4646] text-white'>✕</span>;
}

export function Comparison() {
  const { t } = useTranslation('landing');
  const rows: ComparisonRow[] = [
    { label: t('comparison.rows.blockchainPowered'), modern: 'yes', legacy: 'no' },
    { label: t('comparison.rows.instantPayments'), modern: 'tokens', legacy: 'bar' },
    { label: t('comparison.rows.freeUnlimitedAccess'), modern: 'yes', legacy: 'no' },
    { label: t('comparison.rows.dailyRewards'), modern: 'yes', legacy: 'no' },
    { label: t('comparison.rows.privateData'), modern: 'yes', legacy: 'no' },
    { label: t('comparison.rows.kycReady'), modern: 'yes', legacy: 'no' },
  ];

  return (
    <section className='bg-landing-surface pb-14 sm:pb-20'>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='text-center text-3xl font-bold text-[#26345d] sm:text-5xl'>
          <span className='me-2 rounded-full border border-[#f66bcc] px-4 py-1 text-[#6b4ad4]'>
            {t('comparison.titleHighlight')}
          </span>
          <span>{t('comparison.titleSuffix')}</span>
        </h2>

        <div className='mt-8 overflow-hidden rounded-2xl border border-[#dde3ec] bg-white'>
          <div className='grid grid-cols-[1.4fr_1fr_1fr] bg-[#e9edf5] px-4 py-5 text-sm font-semibold text-[#5d6788] sm:px-7 sm:text-3xl'>
            <p className='text-base sm:text-3xl'>{t('comparison.headerFeature')}</p>
            <p className='text-center text-base text-[#2f3e69] sm:text-3xl'>{t('comparison.headerModern')}</p>
            <p className='text-center text-base sm:text-3xl'>{t('comparison.headerLegacy')}</p>
          </div>
          <div className='grid grid-cols-[1.4fr_1fr_1fr] border-t border-[#dde3ec] px-4 py-5 text-xs text-[#5d6788] sm:px-7 sm:text-sm'>
            <div />
            <p className='px-1 text-center'>{t('comparison.modernDescription')}</p>
            <p className='px-1 text-center'>{t('comparison.legacyDescription')}</p>
          </div>

          {rows.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1.4fr_1fr_1fr] items-center px-4 py-4 sm:px-7 ${index % 2 === 0 ? 'bg-[#edf1f8]' : 'bg-white'}`}
            >
              <p className='text-sm font-semibold text-[#2f3e69] sm:text-[28px]'>{row.label}</p>
              <div className='flex justify-center'>
                {row.modern === 'yes' ? (
                  <CheckCell />
                ) : (
                  <div className='flex gap-1'>
                    {paymentTokens.map((_, dotIndex) => (
                      <span key={dotIndex} className='h-3.5 w-3.5 rounded-full bg-[#c4c4c4]' />
                    ))}
                  </div>
                )}
              </div>
              <div className='flex justify-center'>
                {row.legacy === 'no' ? <XCell /> : <span className='h-8 w-28 bg-[#c6c6c6]' />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
