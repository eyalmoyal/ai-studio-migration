import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { WizardFormData, WizardStep } from '@/types';

const GENRES = ['pop', 'rock', 'country', 'hip-hop', 'jazz', 'classical'] as const;

export default function SongWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('recipient');
  const [formData, setFormData] = useState<WizardFormData>({
    recipientName: '',
    recipientAge: '',
    relationship: '',
    genre: 'pop',
    memories: '',
    email: '',
  });

  const updateFormData = (field: keyof WizardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    const steps: WizardStep[] = ['recipient', 'genre', 'memories', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: WizardStep[] = ['recipient', 'genre', 'memories', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    navigate('/checkout', { state: { formData } });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 'recipient':
        return formData.recipientName && formData.recipientAge && formData.relationship;
      case 'genre':
        return formData.genre;
      case 'memories':
        return formData.memories.trim().length > 20;
      case 'summary':
        return formData.email;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Create Your Custom Song</CardTitle>
          <CardDescription>
            Step {['recipient', 'genre', 'memories', 'summary'].indexOf(currentStep) + 1} of 4
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 'recipient' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipientName">Recipient's Name</Label>
                <Input
                  id="recipientName"
                  value={formData.recipientName}
                  onChange={(e) => updateFormData('recipientName', e.target.value)}
                  placeholder="Who is this song for?"
                />
              </div>
              <div>
                <Label htmlFor="recipientAge">Age</Label>
                <Input
                  id="recipientAge"
                  type="number"
                  value={formData.recipientAge}
                  onChange={(e) => updateFormData('recipientAge', e.target.value)}
                  placeholder="Their age"
                />
              </div>
              <div>
                <Label htmlFor="relationship">Your Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => updateFormData('relationship', e.target.value)}
                  placeholder="e.g., Mother, Best Friend, Partner"
                />
              </div>
            </div>
          )}

          {currentStep === 'genre' && (
            <div className="space-y-4">
              <Label>Choose a Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => updateFormData('genre', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 'memories' && (
            <div className="space-y-4">
              <Label htmlFor="memories">Share Your Memories</Label>
              <Textarea
                id="memories"
                value={formData.memories}
                onChange={(e) => updateFormData('memories', e.target.value)}
                placeholder="Tell us about special moments, inside jokes, or what makes this person special..."
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                {formData.memories.length} characters (minimum 20)
              </p>
            </div>
          )}

          {currentStep === 'summary' && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p><strong>For:</strong> {formData.recipientName}, {formData.recipientAge}</p>
                <p><strong>Relationship:</strong> {formData.relationship}</p>
                <p><strong>Genre:</strong> {formData.genre}</p>
                <p><strong>Memories:</strong> {formData.memories.substring(0, 100)}...</p>
              </div>
              <div>
                <Label htmlFor="email">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="We'll send your song here"
                />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 'recipient'}
          >
            Back
          </Button>
          {currentStep === 'summary' ? (
            <Button onClick={handleSubmit} disabled={!isStepValid()}>
              Continue to Checkout
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
