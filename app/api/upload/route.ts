import { NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get('file') as File;
 
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
 
  const url = await fal.storage.upload(file);  // Changed this line
  return NextResponse.json({ url });
}