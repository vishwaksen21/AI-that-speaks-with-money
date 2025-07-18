
'use server';

import { simulateFinancialScenario } from '@/ai/flows/scenario-simulation';
// Note: We get the data on the client and pass it in, so we don't need mock data here.

export async function getScenarioResponse(scenarioDescription: string, financialData: string) {
  try {
    const response = await simulateFinancialScenario({
      financialData: financialData,
      scenarioDescription: scenarioDescription,
    });
    return response;
  } catch (error: any) {
    console.error('Error simulating financial scenario:', error);
     if (error.message && error.message.includes('429')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    throw new Error('Failed to get response from AI.');
  }
}
