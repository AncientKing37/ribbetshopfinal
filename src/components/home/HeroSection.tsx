import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-cyber-blue-dark py-24 md:py-32 min-h-[90vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <OptimizedImage 
          src="/uploads/home-bg.webp" 
          alt="Background" 
          className="w-full h-full object-cover object-center" 
        />
        <div className="absolute inset-0 bg-cyber-blue-dark/40"></div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-purple via-cyber-magenta to-cyber-purple"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Hero content */}
          <motion.div className="md:w-2/3 text-left mb-8 md:mb-0 pl-0 md:pl-8" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Fortnite Skins,<br/>V-Bucks and More!</span>
              <span className="cyber-neon-text"></span>
            </h1>
            
            <p className="text-gray-300 text-xl md:text-2xl mb-10 max-w-2xl">Unbeatable Prices and Fast, Secure Delivery..</p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button className="cyber-button bg-cyber-purple hover:bg-cyber-purple/80 text-xl py-7 px-10" asChild>
                <Link to="/shop">Daily Item Shop</Link>
              </Button>
              <Button variant="outline" className="cyber-button text-xl py-7 px-10" asChild>
                <Link to="/how-it-works">Fortnite Crew</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyber-purple/20 rounded-full flex items-center justify-center border border-cyber-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyber-purple" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-300 text-lg">Instant Delivery</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyber-purple/20 rounded-full flex items-center justify-center border border-cyber-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyber-purple" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-300 text-lg">100% Secure</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyber-purple/20 rounded-full flex items-center justify-center border border-cyber-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyber-purple" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-300 text-lg">24/7 Support</span>
              </div>
            </div>
          </motion.div>
          
          {/* Hero image - right side space */}
          <motion.div className="md:w-1/3" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-cyber-magenta/10 rounded-full filter blur-xl animate-float"></div>
              <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-cyber-purple/20 rounded-full filter blur-xl animate-float" style={{
              animationDelay: '1s'
            }}></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bouncing Arrow */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={() => window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })}
      >
        <ChevronDown className="w-10 h-10 text-cyber-purple" />
      </motion.div>
    </div>
  );
};

export default HeroSection;