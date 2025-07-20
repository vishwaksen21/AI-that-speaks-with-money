
import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { type CoreMessage } from 'ai';
import { createStreamableValue, StreamData, StreamingTextResponse } from 'ai/rsc';
import { AIStream } from 'ai';

export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages, data }: { messages: CoreMessage[], data?: { financialData?: string } } = await req.json();

  const lastUserMessage = messages.findLast((m) => m.role === 'user');

  if (!lastUserMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const userQuestion = lastUserMessage.content as string;
  const financialData = data?.financialData;

  if (!userQuestion || !financialData) {
     return new Response('Missing user question or financial data', { status: 400 });
  }
 
  try {
    const resultStream = await generatePersonalizedFinancialInsights({
        userQuestion,
        financialData,
    });
    
    const aiStream = AIStream(resultStream, undefined);
    
    return new StreamingTextResponse(aiStream);

  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('An error occurred while processing your request.', { status: 500 });
  }
}
