
import { getChatResponse } from '@/app/chat/actions';
import {AIStream} from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const lastUserMessage = messages[messages.length - 1];
  const financialData = data.financialData;
  const userQuestion = lastUserMessage.content;
  
  const stream = await getChatResponse(userQuestion, financialData);
  
  return new Response(stream);
}
