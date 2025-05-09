import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlusCircle, BadgeDollarSign, ShoppingCart, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const creditPackages = [
  {
    name: "Starter",
    credits: 1000,
    price: 4.5,
    popular: false,
    color: "cyber-purple"
  },
  {
    name: "Basic",
    credits: 2800,
    price: 12,
    popular: true,
    color: "cyber-blue"
  },
  {
    name: "Standard",
    credits: 5000,
    price: 19,
    popular: false,
    color: "cyber-green"
  },
  {
    name: "Pro",
    credits: 8000,
    price: 26,
    popular: false,
    color: "cyber-yellow"
  },
  {
    name: "Elite",
    credits: 13500,
    price: 33,
    popular: false,
    color: "cyber-orange"
  },
  {
    name: "Legend",
    credits: 15000,
    price: 40,
    popular: false,
    color: "cyber-red"
  },
  {
    name: "Ultimate",
    credits: 20000,
    price: 55,
    popular: false,
    color: "cyber-magenta"
  }
];

const Credits = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSelectPackage = (index: number) => {
    setSelectedPackage(index);
  };

  // Fetch cart items for the current user
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      setCartLoading(true);
      setCartError(null);
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });
      if (error) {
        setCartError('Failed to fetch cart');
        setCartItems([]);
      } else {
        setCartItems(data || []);
      }
      setCartLoading(false);
    };
    fetchCart();
  }, [user]);

  const handleAddToCart = async (pkg: typeof creditPackages[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add to cart",
        variant: "destructive",
      });
      return;
    }
    await addToCart({
      offerId: String(pkg.credits),
      item_name: pkg.name,
      item_image: `/uploads/credits/${pkg.credits}.webp`,
      price: pkg.price,
      quantity: 1,
    });
  };

  const handlePurchase = async (pkg: typeof creditPackages[0]) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase credits",
        variant: "destructive",
      });
      return;
    }
    await addToCart({
      offerId: String(pkg.credits),
      item_name: pkg.name,
      item_image: `/uploads/credits/${pkg.credits}.webp`,
      price: pkg.price,
      quantity: 1,
    });
    toast({ title: 'Redirecting to Cart', description: 'Proceed to checkout your credits!' });
    navigate('/cart');
  };

  // Remove a cart item
  const handleRemoveCartItem = async (id: string) => {
    setCartLoading(true);
    const { error } = await supabase.from('cart').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not remove item', variant: 'destructive' });
    } else {
      setCartItems((items) => items.filter((item) => item.id !== id));
      toast({ title: 'Removed', description: 'Item removed from cart.' });
    }
    setCartLoading(false);
  };

  // Update quantity for a cart item
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartLoading(true);
    const { error } = await supabase.from('cart').update({ quantity: newQuantity }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not update quantity', variant: 'destructive' });
    } else {
      setCartItems((items) => items.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
    setCartLoading(false);
  };

  // Checkout: clear all cart items for the user
  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    const { error } = await supabase.from('cart').delete().eq('user_id', user.id);
    if (error) {
      toast({ title: 'Error', description: 'Checkout failed', variant: 'destructive' });
    } else {
      setCartItems([]);
      toast({ title: 'Checkout Successful', description: 'Thank you for your purchase!' });
    }
    setCheckoutLoading(false);
  };

  return (
    <Layout title="Purchase Credits">
      <div className="py-8 md:py-16" style={{ background: 'url(/uploads/common-bg.webp) center center / cover no-repeat', minHeight: '100vh' }}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Buy Credits</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Purchase credits to use across our platform. The more credits you buy, the better the value.
            </p>
          </motion.div>
          
          <div className="w-full flex justify-center">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              style={{ maxWidth: '1360px' }}
            >
              {creditPackages.map((pkg, index) => (
                <motion.div
                  key={`${pkg.name}-${pkg.credits}`}
                  className="flex flex-col rounded-2xl shadow-xl bg-cyber-blue-dark overflow-hidden"
                  style={{ maxWidth: 320, width: '100%' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  {/* Image section */}
                  <div className="relative">
                    <img
                      src={`/uploads/credits/${pkg.credits}.webp`}
                      alt={`${pkg.credits} Credits`}
                      className="w-full h-[400px] object-cover rounded-t-2xl bg-black"
                    />
                  </div>
                  {/* Bottom section */}
                  <div className="flex flex-col bg-[#181B23] p-6 rounded-b-2xl">
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{pkg.credits.toLocaleString()} Gift Credits</div>
                      <div className="text-gray-400 text-sm mb-2">Add credits, choose your item, and gift it straight to your own account.</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-white text-lg font-bold">${pkg.price.toFixed(2)} USD</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-cyber-purple hover:bg-cyber-purple/90 text-white font-semibold rounded-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--cyber-purple, #9b87f5)' }}
                        onClick={() => handleAddToCart(pkg)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </Button>
                      <Button
                        className="flex-1 bg-cyber-magenta hover:bg-cyber-magenta/90 text-white font-semibold rounded-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--cyber-magenta, #e84cff)' }}
                        onClick={() => handlePurchase(pkg)}
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

export default Credits;
