import { Capabilities } from '../components/landing/capabilities';
import { Comparison } from '../components/landing/comparison';
import { Cta } from '../components/landing/cta';
import { Faq } from '../components/landing/faq';
import { Features } from '../components/landing/features';
import { Hero } from '../components/landing/hero';
import { HowItWorks } from '../components/landing/how-it-works';
import { Integration } from '../components/landing/integration';
import { LandingFooter } from '../components/landing/landing-footer';
import { LandingNavbar } from '../components/landing/landing-navbar';
import { Sustainability } from '../components/landing/sustainability';
import { TargetAudience } from '../components/landing/target-audience';
import { UseCases } from '../components/landing/use-cases';
import { WhyItMatters } from '../components/landing/why-it-matters';
import { WhyNow } from '../components/landing/why-now';

export default function LandingPage() {
  return (
    <main className='overflow-x-hidden'>
      <div className='bg-linear-to-b from-landing-hero-from via-landing-hero-mid to-landing-hero-to text-white'>
        <LandingNavbar />
        <Hero />
      </div>

      <HowItWorks />
      <WhyItMatters />
      <Capabilities />
      <Integration />
      <Features />
      <Comparison />
      <UseCases />
      <Sustainability />
      <WhyNow />
      <TargetAudience />
      <Faq />
      <Cta />
      <LandingFooter />
    </main>
  );
}
