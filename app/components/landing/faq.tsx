import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useReveal } from '../../lib/use-reveal';

interface FaqItem {
  question: string;
  answer: string;
}

export function Faq() {
  const { t } = useTranslation('landing');
  const items = useMemo(
    () => t('faq.items', { returnObjects: true }) as FaqItem[],
    [t]
  );
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useReveal();

  return (
    <section className='bg-gradient-to-b from-landing-faq-from to-landing-faq-to py-16 text-white sm:py-24' ref={ref}>
      <div className='mx-auto max-w-4xl px-5 sm:px-6 lg:px-8'>
        <h2 className='reveal text-center text-3xl font-bold sm:text-4xl lg:text-5xl'>
          {t('faq.title')}
        </h2>

        <div className='mt-12 space-y-3'>
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <article
                key={item.question}
                className={`reveal reveal-delay-${Math.min(index + 1, 6)} overflow-hidden rounded-xl border transition-all ${
                  isOpen
                    ? 'border-accent-mint/30 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                } backdrop-blur-sm`}
              >
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className='flex w-full items-center justify-between gap-4 px-6 py-5 text-start'
                >
                  <span className='text-lg font-semibold sm:text-xl'>{item.question}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl transition-transform ${
                      isOpen ? 'rotate-45 bg-accent-mint/20 text-accent-mint' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className='overflow-hidden'>
                    <p className='px-6 pb-5 text-base leading-relaxed text-white/80'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
