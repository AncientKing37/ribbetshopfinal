import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export interface ItemshopOrderItem {
  item_id: number;
  offer_id: string;
  item_name: string;
  item_type: string;
  final_price: number;
  epic_username: string;
}

export interface ItemshopOrder {
  id: string;
  user_id: string;
  epic_username: string;
  item_id: number;
  offer_id: string;
  item_name: string;
  item_type: string;
  final_price: number;
  webhook_url: string;
  webhook_status: string | null;
  webhook_response: string | null;
  status: OrderStatus | null;
  error_message: string | null;
  processed_by: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export const createItemshopOrder = async (
  userId: string,
  item: ItemshopOrderItem,
  webhookUrl: string
): Promise<ItemshopOrder> => {
  const { data, error } = await supabase
    .from('itemshop_orders')
    .insert({
      user_id: userId,
      epic_username: item.epic_username,
      item_id: item.item_id,
      offer_id: item.offer_id,
      item_name: item.item_name,
      item_type: item.item_type,
      final_price: item.final_price,
      webhook_url: webhookUrl,
      status: 'pending',
      processed_by: 'system',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
};

export const processItemshopOrder = async (orderId: string): Promise<ItemshopOrder> => {
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
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`);
    }

    return { ...order, status: 'completed', completed_at: new Date().toISOString() };
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

export const getItemshopOrder = async (orderId: string): Promise<ItemshopOrder> => {
  const { data, error } = await supabase
    .from('itemshop_orders')
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

export const getUserItemshopOrders = async (userId: string): Promise<ItemshopOrder[]> => {
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