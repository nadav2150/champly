import { useTranslation } from 'react-i18next';

import { Comparison } from '../components/landing/comparison';
import { Cta } from '../components/landing/cta';
import { Faq } from '../components/landing/faq';
import { Features } from '../components/landing/features';
import { Hero } from '../components/landing/hero';
import { HowItWorks } from '../components/landing/how-it-works';
import { LandingFooter } from '../components/landing/landing-footer';
import { LandingNavbar } from '../components/landing/landing-navbar';

export default function LandingPage() {
  const { t } = useTranslation('landing');

  return (
    <main>
      <section className='bg-linear-to-b from-landing-hero-from via-landing-hero-mid to-landing-hero-to text-white'>
        <LandingNavbar />
        <Hero />
      </section>

      <Features />
      <Comparison />
      <HowItWorks />
      <Faq />
      <Cta />
      <LandingFooter />

      <span className='sr-only'>{t('nav.brandName')}</span>
    </main>
  );
}
