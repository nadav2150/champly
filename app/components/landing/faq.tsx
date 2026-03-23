import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type FaqItem = {
  question: string;
  answer: string;
};

export function Faq() {
  const { t } = useTranslation('landing');
  const items = useMemo(
    () => t('faq.items', { returnObjects: true }) as FaqItem[],
    [t]
  );
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className='bg-gradient-to-b from-landing-faq-from to-landing-faq-to py-14 text-white sm:py-20'>
      <div className='mx-auto max-w-6xl px-5 sm:px-6 lg:px-8'>
        <h2 className='text-center text-3xl font-bold sm:text-5xl'>{t('faq.title')}</h2>
        <div className='mt-8 space-y-3'>
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <article
                key={item.question}
                className='rounded-xl border border-white/60 bg-white/10 px-6 py-5 backdrop-blur-sm'
              >
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className='flex w-full items-center justify-between gap-4 text-start'
                >
                  <span className='text-2xl font-semibold'>{item.question}</span>
                  <span className='text-3xl leading-none'>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? <p className='mt-3 text-lg text-white/90'>{item.answer}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
