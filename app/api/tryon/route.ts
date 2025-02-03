import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = await fal.subscribe('fashn/tryon', {
      input: {
        model_image: body.modelImage,
        garment_image: body.garmentImage,
        category: body.category,
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