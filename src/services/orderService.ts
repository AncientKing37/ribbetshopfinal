import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type Order = any;

export interface OrderItem {
  item_id: string;
  item_name: string;
  item_image: string;
  price: number;
  quantity: number;
  epic_username: string;
}

export const createOrder = async (
  userId: string,
  items: OrderItem[],
  epicUsername: string,
  totalAmount: number
): Promise<Order> => {
  const { data, error } = await supabase
    .from('itemshop_orders')
    .insert({
      user_id: userId,
      status: 'pending',
      amount: totalAmount,
      currency: 'V-Bucks',
      items: items.map(item => ({
        ...item,
        epic_username: epicUsername
      })),
      epic_username: epicUsername,
      processed_by: 'system'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
};

export const processOrder = async (orderId: string): Promise<Order> => {
  // Do NOT update order status to processing here. Let the Discord bot handle status changes.
  const { data: order, error } = await supabase
    .from('itemshop_orders')
    .select()
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  try {
    // Process each item in the order
    const items = order.items as OrderItem[];
    for (const item of items) {
      // Create purchase record
      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: order.user_id,
          item_eid: item.item_id,
          item_name: item.item_name,
          price: item.price,
          image_url: item.item_image,
          epic_username: item.epic_username,
          order_id: order.id,
          status: 'completed'
        });

      if (purchaseError) {
        throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
      }
    }

    // Do NOT set status to processing or completed here. Let the Discord bot do it after gifting.
    return order;
  } catch (error) {
    // If any error occurs, mark the order as failed
    const { data: failedOrder } = await supabase
      .from('itemshop_orders')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      .eq('id', orderId)
      .select()
      .single();

    throw error;
  }
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('itemshop_orders')
    .select()
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(`Failed to get order: ${error.message}`);
  }

  return data;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('itemshop_orders')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get user orders: ${error.message}`);
  }

  return data;
}; 