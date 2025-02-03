import { fal } from '@fal-ai/client';

export const initFalClient = () => {
  fal.config({
    credentials: process.env.FAL_KEY!,
  });
};