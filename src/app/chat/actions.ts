
'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
// Note: We get the data on the client and pass it in, so we don't need mock data here.

export async function getChatResponse(userQuestion: string, financialData: string) {
  try {
    const response = await generatePersonalizedFinancialInsights({
      financialData: financialData,
      userQuestion: userQuestion,
    });
    return { insight: response.insights };
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw new Error('Failed to get response from AI.');
  }
}
