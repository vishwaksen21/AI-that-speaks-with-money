
'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';

export async function getChatResponse(userQuestion: string, financialData: string) {
  const stream = await generatePersonalizedFinancialInsights({
      financialData,
      userQuestion
  });
  
  return stream;
}
