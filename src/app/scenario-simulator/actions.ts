
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
  } catch (error) {
    console.error('Error simulating financial scenario:', error);
    throw new Error('Failed to get response from AI.');
  }
}
