import { supabase } from '@/integrations/supabase/client';
import type { Order } from '@/types';

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      order_number: orderData.orderNumber,
      recipient_name: orderData.recipientName,
      recipient_age: orderData.recipientAge,
      relationship: orderData.relationship,
      genre: orderData.genre,
      memories: orderData.memories,
      email: orderData.email,
      status: orderData.status,
      lyrics: orderData.lyrics,
      album_art_url: orderData.albumArtUrl,
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    orderNumber: data.order_number,
    recipientName: data.recipient_name,
    recipientAge: data.recipient_age,
    relationship: data.relationship,
    genre: data.genre,
    memories: data.memories,
    email: data.email,
    status: data.status,
    createdAt: data.created_at,
    lyrics: data.lyrics,
    albumArtUrl: data.album_art_url,
  } as Order;
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return {
    id: data.id,
    orderNumber: data.order_number,
    recipientName: data.recipient_name,
    recipientAge: data.recipient_age,
    relationship: data.relationship,
    genre: data.genre,
    memories: data.memories,
    email: data.email,
    status: data.status,
    createdAt: data.created_at,
    lyrics: data.lyrics,
    albumArtUrl: data.album_art_url,
  } as Order;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    orderNumber: row.order_number,
    recipientName: row.recipient_name,
    recipientAge: row.recipient_age,
    relationship: row.relationship,
    genre: row.genre,
    memories: row.memories,
    email: row.email,
    status: row.status,
    createdAt: row.created_at,
    lyrics: row.lyrics,
    albumArtUrl: row.album_art_url,
  })) as Order[];
};

export const updateOrderStatus = async (
  orderNumber: string, 
  status: Order['status']
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('order_number', orderNumber)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    orderNumber: data.order_number,
    recipientName: data.recipient_name,
    recipientAge: data.recipient_age,
    relationship: data.relationship,
    genre: data.genre,
    memories: data.memories,
    email: data.email,
    status: data.status,
    createdAt: data.created_at,
    lyrics: data.lyrics,
    albumArtUrl: data.album_art_url,
  } as Order;
};

export const updateOrderLyrics = async (
  orderNumber: string,
  lyrics: string
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ lyrics })
    .eq('order_number', orderNumber)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    orderNumber: data.order_number,
    recipientName: data.recipient_name,
    recipientAge: data.recipient_age,
    relationship: data.relationship,
    genre: data.genre,
    memories: data.memories,
    email: data.email,
    status: data.status,
    createdAt: data.created_at,
    lyrics: data.lyrics,
    albumArtUrl: data.album_art_url,
  } as Order;
};

export const updateOrderAlbumArt = async (
  orderNumber: string,
  albumArtUrl: string
): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ album_art_url: albumArtUrl })
    .eq('order_number', orderNumber)
    .select()
    .single();

  if (error) throw error;
  return {
    id: data.id,
    orderNumber: data.order_number,
    recipientName: data.recipient_name,
    recipientAge: data.recipient_age,
    relationship: data.relationship,
    genre: data.genre,
    memories: data.memories,
    email: data.email,
    status: data.status,
    createdAt: data.created_at,
    lyrics: data.lyrics,
    albumArtUrl: data.album_art_url,
  } as Order;
};
