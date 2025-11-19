import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getOrderByNumber, updateOrderStatus, updateOrderLyrics } from '@/services/dbService';
import { generateLyrics } from '@/services/geminiService';
import type { Order, OrderStatus } from '@/types';

export default function AdminOrderDetails() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    if (orderNumber) {
      loadOrder(orderNumber);
    }
  }, [orderNumber]);

  const loadOrder = async (orderNum: string) => {
    setIsLoading(true);
    try {
      const foundOrder = await getOrderByNumber(orderNum);
      if (foundOrder) {
        setOrder(foundOrder);
        setLyrics(foundOrder.lyrics || '');
      } else {
        toast({
          title: 'Order not found',
          variant: 'destructive',
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      toast({
        title: 'Error loading order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!orderNumber) return;
    
    try {
      await updateOrderStatus(orderNumber, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: 'Status updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateLyrics = async () => {
    if (!order) return;
    
    setIsGenerating(true);
    try {
      const generatedLyrics = await generateLyrics(
        order.recipientName,
        order.recipientAge,
        order.relationship,
        order.genre,
        order.memories
      );
      setLyrics(generatedLyrics);
      toast({
        title: 'Lyrics generated',
        description: 'AI has generated the song lyrics',
      });
    } catch (error: any) {
      console.error('Failed to generate lyrics:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate lyrics',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveLyrics = async () => {
    if (!orderNumber) return;
    
    try {
      await updateOrderLyrics(orderNumber, lyrics);
      toast({
        title: 'Lyrics saved',
        description: 'Song lyrics have been saved to the order',
      });
    } catch (error) {
      console.error('Failed to save lyrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to save lyrics',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>#{order.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Recipient Name</Label>
                <p className="font-medium">{order.recipientName}</p>
              </div>
              <div>
                <Label>Age</Label>
                <p className="font-medium">{order.recipientAge}</p>
              </div>
              <div>
                <Label>Relationship</Label>
                <p className="font-medium">{order.relationship}</p>
              </div>
              <div>
                <Label>Genre</Label>
                <p className="font-medium">{order.genre}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <Label>Memories</Label>
                <p className="text-sm text-muted-foreground">{order.memories}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Order Status</Label>
                <Select value={order.status} onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="writing_lyrics">Writing Lyrics</SelectItem>
                    <SelectItem value="recording_vocals">Recording Vocals</SelectItem>
                    <SelectItem value="mixing">Mixing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Created At</Label>
                <p className="text-sm">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Song Lyrics</CardTitle>
              <Button onClick={handleGenerateLyrics} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
            <CardDescription>Edit or generate lyrics for this song</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={15}
              placeholder="Song lyrics will appear here..."
            />
            <Button onClick={handleSaveLyrics} disabled={!lyrics.trim()}>
              Save Lyrics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
