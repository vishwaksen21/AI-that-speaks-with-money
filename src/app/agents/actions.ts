
'use server';

import { generateInvestmentAdvice } from '@/ai/flows/investment-agent';
import { generateSavingsAdvice } from '@/ai/flows/savings-agent';
import { generateExpenseAdvice } from '@/ai/flows/expense-agent';

export async function getInvestmentAdvice(financialData: string) {
  try {
    const response = await generateInvestmentAdvice({ financialData });
    return response;
  } catch (error) {
    console.error('Error getting investment advice:', error);
    throw new Error('Failed to get response from AI.');
  }
}

export async function getSavingsAdvice(financialData: string) {
  try {
    const response = await generateSavingsAdvice({ financialData });
    return response;
  } catch (error) {
    console.error('Error getting savings advice:', error);
    throw new Error('Failed to get response from AI.');
  }
}

export async function getExpenseAdvice(financialData: string) {
  try {
    const response = await generateExpenseAdvice({ financialData });
    return response;
  } catch (error) {
    console.error('Error getting expense advice:', error);
    throw new Error('Failed to get response from AI.');
  }
}
