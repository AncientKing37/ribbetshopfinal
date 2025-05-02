import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ServicesSection = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    <section
      style={{
        background: 'url(/uploads/common-bg.png) center center / cover no-repeat',
        position: 'relative',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      {/* Top Gradient Overlay - taller and more gradual */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '220px',
        background: 'linear-gradient(to bottom, #18192b 0%, rgba(24,25,43,0.85) 40%, rgba(24,25,43,0.0) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      {/* Optional: Subtle dark overlay for extra blend */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '120px',
        background: 'linear-gradient(to bottom, rgba(24,25,43,0.4) 0%, rgba(24,25,43,0) 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      {/* Bottom Gradient Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'linear-gradient(to top, #18192b 0%, rgba(24,25,43,0) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Section Header */}
        <motion.div 
          className="relative z-10 text-center mb-24 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Our services</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Find out what we do and how we do it
          </p>
        </motion.div>

        {/* Gifting & Battle Pass Section */}
        <div className="relative mb-32">
          {/* Text Content */}
          <motion.div 
            className="relative z-10 max-w-xl mx-auto md:mx-0 md:ml-[15%] px-4 md:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-cyber-purple">
              Gifting & Battle Pass
            </h3>
            <div className="space-y-4 text-gray-300 mb-8">
              <p className="text-lg">
                Get your favorite Fortnite skins and Battle Pass instantly through our 
                automated gifting system.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-cyber-purple rounded-full mr-3"></span>
                  Instant delivery with automated gifting
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-cyber-purple rounded-full mr-3"></span>
                  Best prices guaranteed
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-cyber-purple rounded-full mr-3"></span>
                  Secure and reliable service
                </li>
              </ul>
            </div>
            <Link 
              to="/shop" 
              className="inline-flex items-center text-lg text-cyber-purple hover:text-cyber-purple-light transition-colors"
            >
              Browse Shop <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          {/* Showcase Images */}
          <div className="relative mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 right-0 w-full md:w-[60%] h-[500px]">
            {/* Left small image */}
            <motion.div 
              className="absolute z-10 top-20 right-[50%] w-48 h-64 bg-cyber-blue-darker rounded-lg border border-cyber-purple/20 overflow-hidden transform -rotate-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Small showcase image */}
            </motion.div>
            {/* Center large image */}
            <motion.div 
              className="absolute z-20 top-0 right-[25%] w-80 h-[400px] bg-cyber-blue-darker rounded-lg border border-cyber-purple/20 overflow-hidden transform rotate-0"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Main showcase image */}
            </motion.div>
            {/* Right small image */}
            <motion.div 
              className="absolute z-10 top-20 right-[5%] w-48 h-64 bg-cyber-blue-darker rounded-lg border border-cyber-purple/20 overflow-hidden transform rotate-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Small showcase image */}
            </motion.div>
          </div>
        </div>

        {/* V-Bucks & Packs Section */}
        <div className="relative">
          {/* Text Content */}
          <motion.div 
            className="relative z-10 max-w-xl mx-auto md:mx-0 md:ml-auto md:mr-[15%] px-4 md:px-0 text-right"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-cyber-purple">
              V-Bucks & Packs
            </h3>
            <div className="space-y-4 text-gray-300 mb-8">
              <p className="text-lg">
                Get more value with our discounted V-Bucks, exclusive packs, and 
                Fortnite Crew subscriptions.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center justify-end">
                  <span className="h-2 w-2 bg-cyber-purple rounded-full mr-3"></span>
                  Regional pricing advantages
                </li>
                <li className="flex items-center justify-end">
                  <span className="h-2 w-2 bg-cyber-purple rounded-full mr-3"></span>
                  Multiple payment methods
                </li>
                <li className="flex items-center justify-end">
                  <span className="h-2 w-2 bg-cyber-purple rounded-full mr-3"></span>
                  Exclusive pack deals
                </li>
              </ul>
            </div>
            <Link 
              to="/v-bucks" 
              className="inline-flex items-center text-lg text-cyber-purple hover:text-cyber-purple-light transition-colors"
            >
              View Offers <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          {/* Showcase Images */}
          <div className="relative mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 left-0 w-full md:w-[60%] h-[500px]">
            {/* Left small image - Save the World */}
            <motion.div 
              className="absolute z-10 top-20 left-[5%] w-48 h-64 bg-cyber-blue-darker rounded-[20px] overflow-hidden transform -rotate-6 shadow-xl hover:shadow-cyber-purple/20 transition-shadow duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="/uploads/stw.png" 
                alt="Save the World" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Center large image - Crew */}
            <motion.div 
              className="absolute z-20 top-0 left-[25%] w-80 h-[400px] bg-cyber-blue-darker rounded-[30px] overflow-hidden transform rotate-0 shadow-xl hover:shadow-cyber-purple/20 transition-shadow duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img 
                src="/uploads/crew12.png" 
                alt="Fortnite Crew" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Right small image - V-Bucks */}
            <motion.div 
              className="absolute z-10 top-20 left-[50%] w-48 h-64 bg-cyber-blue-darker rounded-[20px] overflow-hidden transform rotate-6 shadow-xl hover:shadow-cyber-purple/20 transition-shadow duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img 
                src="/uploads/vb.png" 
                alt="V-Bucks" 
                className="w-full h-full object-contain p-4"
              />
            </motion.div>
          </div>
        </div>

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