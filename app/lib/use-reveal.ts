import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function useReveal() {
  const ref = useRef<HTMLElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    requestAnimationFrame(() => {
      const targets = el.querySelectorAll('.reveal');
      targets.forEach((t) => {
        t.classList.remove('visible');
        observer.observe(t);
      });
    });

    return () => observer.disconnect();
  }, [i18n.language]);

  return ref;
}
