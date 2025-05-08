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
  // Do NOT update order status to processing here. Let the Discord bot handle status changes.
  const { data: order, error } = await supabase
    .from('orders')
    .select()
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`);
  }

  try {
    // Create purchase record for the single item
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: order.user_id,
        item_eid: order.offer_id,
        item_name: order.item_name,
        price: order.price,
        image_url: order.item_image,
        epic_username: order.epic_username,
        order_id: order.id,
        status: 'completed',
      });

    if (purchaseError) {
      throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
    }

    // Do NOT set status to processing or completed here. Let the Discord bot do it after gifting.
    return order;
  } catch (error) {
    // If any error occurs, mark the order as failed
    await supabase
      .from('orders')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error occurred',
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