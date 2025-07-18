'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { financialDataString } from '@/lib/mock-data';

export async function getChatResponse(userQuestion: string) {
  try {
    const response = await generatePersonalizedFinancialInsights({
      financialData: financialDataString,
      userQuestion: userQuestion,
    });
    return { insight: response.insights };
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw new Error('Failed to get response from AI.');
  }
}
