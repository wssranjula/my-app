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
  
  // Upload to fal.ai storage
  const url = await fal.storage.upload(buffer, {
    mimeType: file.type,
    name: file.name,
  });

  return NextResponse.json({ url });
}