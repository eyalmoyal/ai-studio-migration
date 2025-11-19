import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/services/dbService';
import type { WizardFormData } from '@/types';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formData = location.state?.formData as WizardFormData | undefined;

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  if (!formData) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order in database
      await createOrder({
        orderNumber,
        recipientName: formData.recipientName,
        recipientAge: parseInt(formData.recipientAge),
        relationship: formData.relationship,
        genre: formData.genre,
        memories: formData.memories,
        email: formData.email,
        status: 'pending',
        lyrics: null,
        albumArtUrl: null,
      });

      toast({
        title: 'Order Confirmed!',
        description: `Your order number is ${orderNumber}`,
      });

      navigate('/track-order', { state: { orderNumber } });
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to process order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your custom song details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-medium">{formData.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Genre:</span>
              <span className="font-medium">{formData.genre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custom Song:</span>
              <span className="font-medium">$99.00</span>
            </div>
            <div className="border-t pt-2 mt-4 flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>$99.00</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter your card information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={isProcessing || !cardNumber || !expiryDate || !cvv}
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
