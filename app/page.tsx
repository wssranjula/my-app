'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { TryOnResult } from '@/components/results/try-on-results';
import { useDropzone } from 'react-dropzone';

interface TryOnResponse {
  data: {
    images: Array<{
      url: string;
      content_type: string;
      file_name: string;
      file_size: number;
      width: number;
      height: number;
    }>;
  };
  requestId: string;
}

export default function VirtualTryOn() {
  const [modelImage, setModelImage] = useState('');
  const [garmentImage, setGarmentImage] = useState('');
  const [category, setCategory] = useState('tops');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const { toast } = useToast();

  const handleImageDrop = async (files: File[], type: 'model' | 'garment') => {
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const { url } = await response.json();
      if (type === 'model') setModelImage(url);
      else setGarmentImage(url);
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    }
  };

  const modelDropzone = useDropzone({
    onDrop: (files) => handleImageDrop(files, 'model'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  const garmentDropzone = useDropzone({
    onDrop: (files) => handleImageDrop(files, 'garment'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
  });

  const handleSubmit = async () => {
    if (!modelImage || !garmentImage) {
      toast({
        title: 'Missing images',
        description: 'Please upload both model and garment images',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelImage,
          garmentImage,
          category,
        }),
      });

      const data = await response.json();
      setResult(data);
      toast({
        title: 'Success',
        description: 'Try-on generated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process try-on request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">TFS Virtual Try-On</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...modelDropzone.getRootProps()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-primary"
            >
              <input {...modelDropzone.getInputProps()} />
              {modelImage ? (
                <img src={modelImage} alt="Model preview" className="w-full h-64 object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop model image here or click to upload
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Garment Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...garmentDropzone.getRootProps()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-primary"
            >
              <input {...garmentDropzone.getInputProps()} />
              {garmentImage ? (
                <img src={garmentImage} alt="Garment preview" className="w-full h-64 object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop garment image here or click to upload
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Try-On Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottoms">Bottoms</SelectItem>
                <SelectItem value="one-pieces">One Pieces</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Generate Try-On'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result?.data?.images?.[0] && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <TryOnResult
              originalImage={garmentImage}
              generatedImage={result.data.images[0].url}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}