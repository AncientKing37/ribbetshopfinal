import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  return (
    <Layout title="Home">
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CallToAction />
    </Layout>
  );
};

export default Index;
