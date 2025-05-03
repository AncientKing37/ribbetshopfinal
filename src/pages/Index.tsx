import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import RotatingCreditsSection from '@/components/home/RotatingCreditsSection';
import RotatingCrewSection from '@/components/home/RotatingCrewSection';
// import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <Layout title="Home">
      <HeroSection />
      <ServicesSection />
      <RotatingCreditsSection />
      <RotatingCrewSection />
      {/* <TestimonialsSection /> */}
      <CallToAction />
    </Layout>
  );
};

export default Index;
