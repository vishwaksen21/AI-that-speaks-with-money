
'use server';

import { generateInvestmentAdvice } from '@/ai/flows/investment-agent';
import { generateSavingsAdvice } from '@/ai/flows/savings-agent';
import { generateExpenseAdvice } from '@/ai/flows/expense-agent';

function handleApiError(error: any, agentName: string) {
  const errorMessage = error?.message || `An unknown error occurred with the ${agentName} agent.`;
  console.error(`Error in ${agentName} agent action:`, errorMessage);
  
  if (errorMessage.includes('429')) {
    return { advice: 'API quota exceeded. Please try again later.' };
  }
  
  return { advice: `Failed to get a valid response from the ${agentName} agent. Please try again. Error: ${errorMessage}` };
}

export async function getInvestmentAdvice(financialData: string) {
  try {
    const response = await generateInvestmentAdvice({ financialData });
    return response;
  } catch (error) {
    return handleApiError(error, 'investment');
  }
}

export async function getSavingsAdvice(financialData: string) {
  try {
    const response = await generateSavingsAdvice({ financialData });
    return response;
  } catch (error) {
    return handleApiError(error, 'savings');
  }
}

export async function getExpenseAdvice(financialData: string) {
  try {
    const response = await generateExpenseAdvice({ financialData });
    return response;
  } catch (error) {
    return handleApiError(error, 'expense');
  }
}
