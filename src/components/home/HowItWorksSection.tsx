
import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description: "Sign up for a free account and get access to our gifting services."
  },
  {
    number: "02",
    title: "Purchase Credits",
    description: "Buy credits using Stripe, PayPal, or Crypto to use in our shop."
  },
  {
    number: "03",
    title: "Choose Items",
    description: "Browse the Fortnite shop and select the items you want."
  },
  {
    number: "04",
    title: "Enter Epic Username",
    description: "Provide your Epic Games username to receive the gift."
  },
  {
    number: "05",
    title: "Accept Friend Request",
    description: "Accept the friend request from our gifting bot."
  },
  {
    number: "06",
    title: "Receive Your Gift",
    description: "After the 48hr waiting period, we'll send your item automatically."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-cyber-blue-dark relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 cyber-neon-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Getting your favorite Fortnite items is simple and secure with our step-by-step process.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="cyber-card p-6 h-full flex flex-col">
                <div className="text-5xl font-bold text-cyber-purple/30 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3 text-cyber-purple-light">{step.title}</h3>
                <p className="text-gray-400 flex-grow">{step.description}</p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                    <svg className="w-8 h-8 text-cyber-purple/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Timeline connector (visible on mobile only) */}
        <div className="md:hidden flex justify-center my-8">
          <div className="w-px h-12 bg-cyber-purple/30"></div>
        </div>
        
        <motion.div 
          className="mt-16 text-center border-t border-cyber-purple/20 pt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-white">Important Note About Gifting</h3>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Epic Games requires players to be friends for 48 hours before gifting items. 
            Our system automatically handles this process - we'll send you a friend request 
            immediately after purchase, then gift your item as soon as the waiting period ends.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
