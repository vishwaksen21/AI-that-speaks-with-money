
'use server';

import { generateFinancialHealthScore } from '@/ai/flows/health-score-agent';

export async function getFinancialHealthScore(financialData: string) {
  try {
    const response = await generateFinancialHealthScore({ financialData });
    return response;
  } catch (error: any) {
    const errorMessage = error?.message || 'An unknown error occurred with the financial health agent.';
    console.error('Error in getFinancialHealthScore action:', errorMessage);
    
    if (errorMessage.includes('429')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    
    throw new Error(`Failed to get a valid response from the health score agent. Error: ${errorMessage}`);
  }
}
