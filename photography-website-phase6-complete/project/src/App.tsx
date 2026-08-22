import { useScrollReveal } from '@/hooks/useScrollReveal';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Services from '@/components/Services';
import EditingServices from '@/components/EditingServices';
import CustomPackages from '@/components/CustomPackages';
import Portfolio from '@/components/Portfolio';
import WeddingFeature from '@/components/WeddingFeature';
import ModelingSection from '@/components/ModelingSection';
import Process from '@/components/Process';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function App() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Services />
        <EditingServices />
        <CustomPackages />
        <Portfolio />
        <WeddingFeature />
        <ModelingSection />
        <Process />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
