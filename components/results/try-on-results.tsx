import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, MinusCircle, PlusCircle } from 'lucide-react';
import ReactCompareImage from 'react-compare-image';

interface TryOnResultProps {
  originalImage: string;
  generatedImage: string;
}

export function TryOnResult({ originalImage, generatedImage }: TryOnResultProps) {
  const [viewMode, setViewMode] = useState<'split' | 'compare'>('split');
  const [zoom, setZoom] = useState(100);

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'split' ? 'compare' : 'split')}
          >
            {viewMode === 'split' ? 'Compare Mode' : 'Split Mode'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(zoom + 10, 200))}
            disabled={zoom >= 200}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(zoom - 10, 50))}
            disabled={zoom <= 50}
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500">Zoom: {zoom}%</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {viewMode === 'split' ? (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-2 relative overflow-hidden">
                <div 
                  style={{ 
                    transform: `scale(${zoom / 100})`, 
                    transformOrigin: 'center' 
                  }}
                  className="transition-transform duration-200"
                >
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    Original
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-2 relative overflow-hidden">
                <div 
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'center'
                  }}
                  className="transition-transform duration-200"
                >
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    Generated
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-2">
              <ReactCompareImage
                leftImage={originalImage}
                rightImage={generatedImage}
                leftImageLabel="Original"
                rightImageLabel="Generated"
                sliderLineWidth={2}
                handleSize={40}
                hover
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}