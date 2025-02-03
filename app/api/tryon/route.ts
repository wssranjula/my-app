import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { initFalClient } from '@/lib/fal-client';

export async function POST(request: Request) {
  try {
    initFalClient();
    const body = await request.json();
    
    const result = await fal.subscribe('fashn/tryon', {
      input: {
        model_image: body.modelImage,
        garment_image: body.garmentImage,
        category: body.category,
        garment_photo_type: body.garmentPhotoType || 'auto',
        nsfw_filter: true,
        guidance_scale: body.guidanceScale || 2,
        timesteps: body.timesteps || 50,
      },
      pollInterval: 5000,
      logs: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Try-on error:', error);
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
  }
}