import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user and cart items
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setCartError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUserId(session.user.id);
      // Fetch user credits
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', session.user.id)
        .maybeSingle();
      if (profileError) {
        setCartError('Error fetching credits');
      }
      setCredits(profile?.credits || 0);
      // Fetch cart items
      const { data, error } = await supabase
        .from('credit_cart')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) {
        setCartError('Failed to fetch cart');
        setCartItems([]);
      } else {
        setCartItems(data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  // Remove a cart item
  const handleRemoveCartItem = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('credit_cart').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not remove item', variant: 'destructive' });
    } else {
      setCartItems((items) => items.filter((item) => item.id !== id));
      toast({ title: 'Removed', description: 'Item removed from cart.' });
    }
    setLoading(false);
  };

  // Update quantity for a cart item
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    const { error } = await supabase.from('credit_cart').update({ quantity: newQuantity }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not update quantity', variant: 'destructive' });
    } else {
      setCartItems((items) => items.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
    setLoading(false);
  };

  // Checkout: clear all cart items for the user
  const handleCheckout = async () => {
    if (!userId) return;
    setCheckoutLoading(true);
    const { error } = await supabase.from('credit_cart').delete().eq('user_id', userId);
    if (error) {
      toast({ title: 'Error', description: 'Checkout failed', variant: 'destructive' });
    } else {
      setCartItems([]);
      toast({ title: 'Checkout Successful', description: 'Thank you for your purchase!' });
    }
    setCheckoutLoading(false);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.package_price * (item.quantity || 1)), 0);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyber-purple mx-auto mb-4" />
          <div className="text-gray-400">Loading your cart...</div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-400 mb-8">Add some items to your cart to get started!</p>
            <Button
              onClick={() => navigate('/credits')}
              className="bg-cyber-purple hover:bg-cyber-purple/90"
            >
              Browse Credits
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
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>
          {cartError && <div className="text-red-500 mb-4">{cartError}</div>}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{item.package_credits.toLocaleString()} Credits</h3>
                  <p className="text-cyber-purple font-bold">${item.package_price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}><Minus className="w-4 h-4" /></Button>
                    <span className="mx-2 text-white font-bold">{item.quantity}</span>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={loading}><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCartItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                  disabled={loading}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-900 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total Items:</span>
              <span className="text-white font-semibold">{cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-cyber-purple font-bold text-xl">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Your Credits:</span>
              <span className={`font-semibold ${credits >= totalPrice ? 'text-green-500' : 'text-red-500'}`}>
                {credits}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-cyber-purple hover:bg-cyber-purple/90"
              disabled={checkoutLoading || credits < totalPrice}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Checkout'
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Cart; 