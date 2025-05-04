import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type Order = Database['public']['Tables']['orders']['Row'];

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
    .from('orders')
    .insert({
      user_id: userId,
      status: 'pending',
      amount: totalAmount,
      currency: 'USD',
      items: items.map(item => ({
        ...item,
        epic_username: epicUsername
      })),
      metadata: {
        epic_username: epicUsername,
        processed_by: 'system'
      }
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
};

export const processOrder = async (orderId: string): Promise<Order> => {
  // Update order status to processing
  const { data: order, error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'processing',
      processed_at: new Date().toISOString(),
      processed_by: 'system'
    })
    .eq('id', orderId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update order status: ${updateError.message}`);
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

    // Update order status to completed
    const { data: completedOrder, error: completeError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (completeError) {
      throw new Error(`Failed to complete order: ${completeError.message}`);
    }

    return completedOrder;
  } catch (error) {
    // If any error occurs, mark the order as failed
    const { data: failedOrder } = await supabase
      .from('orders')
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
    .from('orders')
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
    .from('orders')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get user orders: ${error.message}`);
  }

  return data;
}; 