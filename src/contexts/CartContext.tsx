import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  item_image: string;
  price: number;
  added_at: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'id' | 'user_id' | 'added_at'>) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const refreshCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', session.user.id)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart:', error);
      return;
    }

    setItems(data || []);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (item: Omit<CartItem, 'id' | 'user_id' | 'added_at'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('cart')
      .insert({
        ...item,
        user_id: session.user.id,
        added_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
      return;
    }

    await refreshCart();
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart.",
    });
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
      return;
    }

    await refreshCart();
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setItems([]);
  };

  const itemCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 