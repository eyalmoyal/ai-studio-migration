import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getOrderByNumber } from '@/services/dbService';
import type { Order } from '@/types';

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  writing_lyrics: { label: 'Writing Lyrics', variant: 'default' },
  recording_vocals: { label: 'Recording Vocals', variant: 'default' },
  mixing: { label: 'Mixing', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'outline' },
};

export default function TrackOrder() {
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState(location.state?.orderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.orderNumber) {
      handleSearch();
    }
  }, [location.state]);

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const foundOrder = await getOrderByNumber(orderNumber.trim());
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found');
        setOrder(null);
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Track Your Order</CardTitle>
            <CardDescription>Enter your order number to see the status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ORD-1234567890-ABCDEF"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="mt-auto">
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {order && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Details</CardTitle>
                <Badge variant={STATUS_LABELS[order.status]?.variant || 'default'}>
                  {STATUS_LABELS[order.status]?.label || order.status}
                </Badge>
              </div>
              <CardDescription>Order #{order.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient:</span>
                  <span className="font-medium">{order.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Genre:</span>
                  <span className="font-medium">{order.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {order.lyrics && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Song Lyrics</h3>
                  <pre className="whitespace-pre-wrap text-sm">{order.lyrics}</pre>
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your song has been delivered to {order.email}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
