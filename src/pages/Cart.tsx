import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      // Fetch user credits
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', session.user.id)
        .maybeSingle();
      if (error) {
        console.error('Error fetching credits:', error);
      }
      
      if (profile) {
        setCredits(profile.credits || 0);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleCheckout = async () => {
    if (credits < totalPrice) {
      toast({
        title: "Insufficient Credits",
        description: "You don't have enough credits to complete this purchase.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Deduct credits
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits: credits - totalPrice })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Log purchases
      for (const item of items) {
        const { error: purchaseError } = await supabase
          .from('credit_purchases')
          .insert({
            user_id: session.user.id,
            amount: -item.price,
            credits: item.price,
            status: 'completed',
            created_at: new Date().toISOString()
          });

        if (purchaseError) throw purchaseError;
      }

      // Clear cart
      await clearCart();

      toast({
        title: "Purchase Successful",
        description: "Your items have been purchased successfully!",
      });

      navigate('/purchases');
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Error",
        description: "Failed to complete your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">Add some items to your cart to get started!</p>
            <Button
              onClick={() => navigate('/item-shop')}
              className="bg-cyber-purple hover:bg-cyber-purple/90"
            >
              Browse Items
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Shopping Cart">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>
          
          <div className="space-y-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg"
              >
                <img
                  src={item.item_image}
                  alt={item.item_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.item_name}</h3>
                  <p className="text-cyber-purple font-bold">{item.price} V-Bucks</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-900 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total Items:</span>
              <span className="text-white font-semibold">{items.length}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-cyber-purple font-bold text-xl">{totalPrice} V-Bucks</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Your Credits:</span>
              <span className={`font-semibold ${credits >= totalPrice ? 'text-green-500' : 'text-red-500'}`}>
                {credits} V-Bucks
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-cyber-purple hover:bg-cyber-purple/90"
              disabled={loading || credits < totalPrice}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Checkout with Credits'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Cart; 