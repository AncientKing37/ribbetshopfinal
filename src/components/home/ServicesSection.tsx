import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';

const ServicesSection = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show button when scrolling up and past 500px from top
      if (currentScrollY > 500) {
        setShowScrollButton(currentScrollY < lastScrollY);
      } else {
        setShowScrollButton(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4 cyber-neon-text">Our Services</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from our wide range of Fortnite services, from Save the World to V-Bucks packages.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Save the World */}
          <motion.div 
            className="relative group"
            variants={cardVariants}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-cyber-purple/20 transition-shadow duration-300">
              <OptimizedImage
                src="/uploads/stw.webp"
                alt="Save the World"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Save the World</h3>
                <p className="text-gray-200">Get access to the original Fortnite PvE experience.</p>
              </div>
            </div>
          </motion.div>

          {/* Fortnite Crew */}
          <motion.div 
            className="relative group"
            variants={cardVariants}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-cyber-purple/20 transition-shadow duration-300">
              <OptimizedImage
                src="/uploads/crew/12m.webp"
                alt="Fortnite Crew"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Fortnite Crew</h3>
                <p className="text-gray-200">Subscribe to get exclusive monthly rewards.</p>
              </div>
            </div>
          </motion.div>

          {/* V-Bucks */}
          <motion.div 
            className="relative group"
            variants={cardVariants}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-cyber-purple/20 transition-shadow duration-300">
              <OptimizedImage
                src="/uploads/vb.webp"
                alt="V-Bucks"
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">V-Bucks</h3>
                <p className="text-gray-200">Purchase V-Bucks at the best rates.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-50 bg-cyber-purple/90 hover:bg-cyber-purple p-3 rounded-full shadow-lg hover:shadow-cyber-purple/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUp className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ServicesSection; 