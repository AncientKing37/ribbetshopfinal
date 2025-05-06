import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const crewPackages = [
  {
    name: 'FN Crew 2 Months',
    months: 2,
    price: 9.00,
    image: '/uploads/crew/2m.png',
  },
  {
    name: 'FN Crew 3 Months',
    months: 3,
    price: 13.00,
    image: '/uploads/crew/3m.png',
  },
  {
    name: 'FN Crew 4 Months',
    months: 4,
    price: 17.00,
    image: '/uploads/crew/4m.png',
  },
  {
    name: 'FN Crew 5 Months',
    months: 5,
    price: 21.00,
    image: '/uploads/crew/5m.png',
  },
  {
    name: 'FN Crew 6 Months',
    months: 6,
    price: 24.00,
    image: '/uploads/crew/6m.png',
  },
  {
    name: 'FN Crew 12 Months',
    months: 12,
    price: 48.00,
    image: '/uploads/crew/12m.png',
  },
];

const FNCrew: React.FC = () => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = async (pkg) => {
    await addToCart({
      offerId: pkg.name,
      item_name: pkg.name,
      item_image: pkg.image,
      price: pkg.price,
      quantity: 1,
    });
  };

  const handleBuyNow = async (pkg) => {
    await addToCart({
      offerId: pkg.name,
      item_name: pkg.name,
      item_image: pkg.image,
      price: pkg.price,
      quantity: 1,
    });
    toast({ title: 'Redirecting to Cart', description: 'Proceed to checkout your Crew package!' });
    navigate('/cart');
  };

  return (
    <Layout title="FN Crew">
      <div className="py-8 md:py-16" style={{ background: 'url(/uploads/green-bg.png) center center / cover no-repeat', minHeight: '100vh' }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-black">Fortnite Crew</span>
            </h1>
            <p className="max-w-2xl mx-auto text-black">
              Fortnite Crew subscription at the best price!
            </p>
          </motion.div>
          <div className="w-full flex justify-center">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              style={{ maxWidth: '1360px' }}
            >
              {crewPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  className="flex flex-col rounded-2xl shadow-xl bg-cyber-blue-dark overflow-hidden"
                  style={{ maxWidth: 320, width: '100%' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  <div className="relative">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-[400px] object-contain rounded-t-2xl bg-black"
                    />
                  </div>
                  <div className="flex flex-col bg-[#181B23] p-6 rounded-b-2xl">
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{pkg.name}</div>
                      <div className="text-gray-400 text-sm mb-2">Best value for Fortnite Crew subscription!</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white text-lg font-bold">${pkg.price.toFixed(2)} USD</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md flex items-center justify-center gap-2"
                        onClick={() => handleAddToCart(pkg)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </Button>
                      <Button
                        className="flex-1 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-md flex items-center justify-center gap-2"
                        onClick={() => handleBuyNow(pkg)}
                      >
                        <Zap className="w-5 h-5" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FNCrew; 