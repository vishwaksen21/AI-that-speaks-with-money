
import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { type CoreMessage } from 'ai';

export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const lastUserMessage = messages.findLast((m) => m.role === 'user');

  if (!lastUserMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const userQuestion = lastUserMessage.content as string;
  const financialData = lastUserMessage.data?.financialData as string | undefined;

  if (!userQuestion || !financialData) {
     return new Response('Missing user question or financial data', { status: 400 });
  }
 
  const result = await generatePersonalizedFinancialInsights({
    userQuestion,
    financialData,
  });
 
  return result;
}
