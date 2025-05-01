import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  return (
    <Layout title="Page Not Found">
      <div className="container mx-auto px-4 py-8">
        <div className="min-h-screen flex flex-col items-center justify-center bg-cyber-blue-dark">
          <motion.div 
            className="text-center py-12 px-4 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="cyber-glow mb-6 text-9xl font-bold text-cyber-purple">404</div>
            <h1 className="text-3xl font-bold mb-4 text-white">Page Not Found</h1>
            <p className="mb-8 text-gray-300">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button className="cyber-button py-6 px-8" asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
