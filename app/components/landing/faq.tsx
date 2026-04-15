import { useCallback, useMemo, useRef, useState } from 'react';
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
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const ref = useReveal();

  const handleRef = useCallback(
    (el: HTMLElement | null) => {
      (ref as React.MutableRefObject<HTMLElement | null>).current = el;
      sectionRef.current = el;
      if (!el) return;
      const observer = new MutationObserver(() => {
        const firstCard = el.querySelector('.reveal.visible');
        if (firstCard) {
          setRevealed(true);
          observer.disconnect();
        }
      });
      observer.observe(el, { subtree: true, attributes: true, attributeFilter: ['class'] });
    },
    [ref]
  );

  return (
    <section id='faq' className='bg-linear-to-b from-landing-faq-from to-landing-faq-to py-20 text-white sm:py-28' ref={handleRef}>
      <div className='mx-auto max-w-4xl px-5 sm:px-6 lg:px-8'>
        <div className='reveal text-center'>
          <span className='section-badge bg-white/10! text-accent-mint!'>FAQ</span>
          <h2 className='mt-8 text-3xl font-bold sm:text-4xl lg:text-[3.25rem] lg:leading-[1.1]'>
            {t('faq.title')}
          </h2>
        </div>

        <div className='mt-14 space-y-3'>
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <article
                key={item.question}
                className={`reveal reveal-delay-${Math.min(index + 1, 6)}${revealed ? ' visible' : ''} overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-accent-mint/25 bg-white/10'
                    : 'border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/6'
                } backdrop-blur-sm`}
              >
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className='flex w-full items-center justify-between gap-4 px-7 py-6 text-start'
                >
                  <span className='text-lg font-semibold sm:text-xl'>{item.question}</span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-medium transition-all duration-300 ${
                      isOpen ? 'rotate-45 bg-accent-mint/20 text-accent-mint' : 'bg-white/10 text-white/60'
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
                    <p className='px-7 pb-6 text-base leading-relaxed text-white/70'>
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
