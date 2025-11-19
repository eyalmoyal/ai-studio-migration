import { supabase } from '@/integrations/supabase/client';
import type { Order } from '@/types';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('orderNumber', orderNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as Order;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data as Order[];
};

export const updateOrderStatus = async (
  orderNumber: string, 
  status: Order['status']
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('orderNumber', orderNumber)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};

export const updateOrderLyrics = async (
  orderNumber: string,
  lyrics: string
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ lyrics })
    .eq('orderNumber', orderNumber)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};

export const updateOrderAlbumArt = async (
  orderNumber: string,
  albumArtUrl: string
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ albumArtUrl })
    .eq('orderNumber', orderNumber)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
};
