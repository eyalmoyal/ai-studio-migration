export type OrderStatus = 
  | 'pending' 
  | 'writing_lyrics' 
  | 'recording_vocals' 
  | 'mixing' 
  | 'delivered';

export type Genre = 
  | 'pop' 
  | 'rock' 
  | 'country' 
  | 'hip-hop' 
  | 'jazz' 
  | 'classical';

export interface Order {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientAge: number;
  relationship: string;
  genre: Genre;
  memories: string;
  email: string;
  status: OrderStatus;
  createdAt: string;
  lyrics?: string | null;
  albumArtUrl?: string | null;
}

export interface WizardFormData {
  recipientName: string;
  recipientAge: string;
  relationship: string;
  genre: Genre;
  memories: string;
  email: string;
}

export type WizardStep = 'recipient' | 'genre' | 'memories' | 'summary';
