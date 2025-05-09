import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import ItemPage from "@/pages/item/[offerId]";

type OrderStatus = Database['public']['Enums']['order_status'];
type Order = any;

export interface OrderItem {
  offerId: string;
  item_name: string;
  item_image: string;
  price: number;
  quantity: number;
  epic_username: string;
}

export const createOrder = async (
  userId: string,
  item: OrderItem,
  epicUsername: string,
  totalAmount: number
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      offer_id: item.offerId,
      item_name: item.item_name,
      item_image: item.item_image,
      price: item.price,
      quantity: item.quantity,
      epic_username: epicUsername,
      status: 'pending',
      amount: totalAmount,
      processed_by: 'system',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
};

export const processOrder = async (orderId: string): Promise<Order> => {
  // Fetch the order
  const { data: order, error } = await supabase
    .from('itemshop_orders')
    .select()
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Multiple orders found with the same ID. Please check your database.');
    }
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
  if (!order) {
    throw new Error('Order not found.');
  }

  try {
    // Mark the order as completed
    const { error: updateError } = await supabase
      .from('itemshop_orders')
      .update({ status: 'completed' })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    return { ...order, status: 'completed' };
  } catch (error) {
    // Mark the order as failed if any error occurs
    await supabase
      .from('itemshop_orders')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error occurred',
      })
      .eq('id', orderId);

    throw error;
  }
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .select()
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Multiple orders found with the same ID. Please check your database.');
    }
    throw new Error(`Failed to get order: ${error.message}`);
  }
  if (!data) {
    throw new Error('Order not found.');
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