import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with glowing effect */}
      <div className="absolute inset-0 bg-cyber-blue-dark bg-grid-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/10 to-cyber-magenta/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center cyber-card p-8 md:p-12 border-cyber-purple/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 cyber-neon-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to Get Your Favorite Fortnite Items?
          </motion.h2>
          
          <motion.p 
            className="text-gray-300 text-lg mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join thousands of satisfied players who trust Ribbet Shop for fast, secure Fortnite item gifting.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              className="cyber-button bg-cyber-purple hover:bg-cyber-purple/80 text-lg py-6 px-8" 
              asChild
            >
              <Link to="/shop">Browse Shop</Link>
            </Button>
            <Button 
              variant="outline" 
              className="cyber-button text-lg py-6 px-8" 
              asChild
            >
              <Link to="/register">Create Account</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Already have an account? <Link to="/login" className="text-cyber-purple hover:underline">Log in here</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
