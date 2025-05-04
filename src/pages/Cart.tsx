import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Trash2, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { createOrder, processOrder } from '@/services/orderService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [epicUsername, setEpicUsername] = useState('');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const { items, removeFromCart, clearCart } = useCart();

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
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  // Update quantity for a cart item
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    const { error } = await supabase.from('cart').update({ quantity: newQuantity }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not update quantity', variant: 'destructive' });
    }
    setLoading(false);
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (!userId || !epicUsername) return;
    
    setCheckoutLoading(true);
    try {
      // Create order
      const order = await createOrder(
        userId,
        items.map(item => ({
          item_id: item.item_id,
          item_name: item.item_name,
          item_image: item.item_image,
          price: item.price,
          quantity: item.quantity,
          epic_username: epicUsername
        })),
        epicUsername,
        totalPrice
      );

      // Process order
      await processOrder(order.id);

      // Clear cart
      await clearCart();

      // Update user credits
      const { error: creditError } = await supabase
        .from('profiles')
        .update({ credits: credits - totalPrice })
        .eq('id', userId);

      if (creditError) {
        throw new Error('Failed to update credits');
      }

      toast({ 
        title: 'Order Successful', 
        description: 'Your items have been purchased and will be delivered to your Epic Games account shortly.' 
      });
      
      setShowCheckoutDialog(false);
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ 
        title: 'Checkout Failed', 
        description: error instanceof Error ? error.message : JSON.stringify(error),
        variant: 'destructive'
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

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

  if (items.length === 0) {
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
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg"
              >
                <div className="flex-1 flex items-center gap-4">
                  {item.item_image && (
                    <img src={item.item_image} alt={item.item_name} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="text-white font-semibold">{item.item_name}</h3>
                    <p className="text-cyber-purple font-bold">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={loading || item.quantity <= 1}><Minus className="w-4 h-4" /></Button>
                  <span className="mx-2 text-white font-bold">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={loading}><Plus className="w-4 h-4" /></Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
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
              <span className="text-white font-semibold">{items.reduce((sum, item) => sum + (item.quantity || 1), 0)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-cyber-purple font-bold text-xl">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={() => setShowCheckoutDialog(true)}
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

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="cyber-card">
          <DialogHeader>
            <DialogTitle>Confirm Checkout</DialogTitle>
            <DialogDescription>
              Please enter your Epic Games username to complete the purchase.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Epic Games Username</label>
              <Input
                value={epicUsername}
                onChange={(e) => setEpicUsername(e.target.value)}
                placeholder="Enter your Epic Games username"
                className="mt-1"
              />
            </div>
            
            <div className="text-sm text-gray-400">
              <p>Total Items: {items.reduce((sum, item) => sum + (item.quantity || 1), 0)}</p>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
              <p>Your Credits: {credits}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCheckoutDialog(false)}
              disabled={checkoutLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              className="bg-cyber-purple hover:bg-cyber-purple/90"
              disabled={!epicUsername || checkoutLoading || credits < totalPrice}
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Purchase'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Cart; 