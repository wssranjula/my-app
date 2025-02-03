import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface TryOnInput {
  modelImage: string;
  garmentImage: string;
  category: string;
  guidanceScale?: number;
  timesteps?: number;
  garmentPhotoType?: 'auto' | 'model' | 'flat-lay';
}

export function useTryOn() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateTryOn = async (input: TryOnInput) => {
    setLoading(true);
    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      setResult(data);
      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate try-on result',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    generateTryOn,
  };
}