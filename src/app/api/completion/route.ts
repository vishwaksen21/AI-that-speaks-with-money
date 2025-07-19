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
