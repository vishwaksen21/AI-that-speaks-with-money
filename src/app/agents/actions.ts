
'use server';

import { generateInvestmentAdvice } from '@/ai/flows/investment-agent';
import { generateSavingsAdvice } from '@/ai/flows/savings-agent';
import { generateExpenseAdvice } from '@/ai/flows/expense-agent';

function handleApiError(error: any, agentName: string) {
  console.error(`Error getting ${agentName} advice:`, error);
  if (error.message && error.message.includes('429')) {
    throw new Error('API quota exceeded. Please try again later.');
  }
  throw new Error(`Failed to get response from ${agentName} AI. Details: ${error.message}`);
}

export async function getInvestmentAdvice(financialData: string) {
  try {
    const response = await generateInvestmentAdvice({ financialData });
    return response;
  } catch (error) {
    handleApiError(error, 'investment');
  }
}

export async function getSavingsAdvice(financialData: string) {
  try {
    const response = await generateSavingsAdvice({ financialData });
    return response;
  } catch (error) {
    handleApiError(error, 'savings');
  }
}

export async function getExpenseAdvice(financialData: string) {
  try {
    const response = await generateExpenseAdvice({ financialData });
    return response;
  } catch (error) {
    handleApiError(error, 'expense');
  }
}
