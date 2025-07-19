// This file is no longer used and can be deleted,
// but we are keeping it to avoid breaking changes if it's referenced elsewhere.
// The new architecture uses direct server actions instead of a generic API route.

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
 
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { prompt } = await req.json();
 
  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    prompt,
  });
 
  return result.toAIStreamResponse();
}
