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
  quantity: number;
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

    setItems((data || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      item_id: item.item_id,
      item_name: item.item_name,
      item_image: item.item_image,
      price: item.price,
      quantity: item.quantity,
      added_at: item.added_at,
    })));
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

    // Check if item already exists in cart
    const { data: existingArr, error: selectError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('item_id', item.item_id);
    const existing = existingArr && existingArr.length > 0 ? existingArr[0] : null;

    if (existing) {
      // Optimistic update: increment quantity in local state
      setItems((prev) => prev.map((ci) =>
        ci.user_id === session.user.id && ci.item_id === item.item_id
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      ));
      toast({
        title: "Added to Cart",
        description: "Item quantity increased in your cart.",
      });
      // Update quantity in Supabase
      const { error: updateError } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
      if (updateError) {
        console.error('Error updating cart quantity:', updateError);
        toast({
          title: "Error",
          description: "Failed to update cart item. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Optimistic update: add new item
      const tempId = Math.random().toString(36).substr(2, 9);
      setItems((prev) => [
        ...prev,
        {
          ...item,
          id: tempId,
          user_id: session.user.id,
          added_at: new Date().toISOString(),
          quantity: 1,
        },
      ]);
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
      // Insert new row in Supabase
      const { error: insertError } = await supabase
        .from('cart')
        .insert({
          ...item,
          user_id: session.user.id,
          added_at: new Date().toISOString(),
          quantity: 1,
        });
      if (insertError) {
        console.error('Error adding to cart:', insertError);
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      }
    }
    // Always refresh to sync with server
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', itemId);

    await refreshCart();

    // Force clear if cart is empty after refresh
    setItems((prev) => (prev.length === 0 ? [] : prev));

    if (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
      return;
    }

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

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

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