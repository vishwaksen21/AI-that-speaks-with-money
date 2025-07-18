'use server';

import { simulateFinancialScenario } from '@/ai/flows/scenario-simulation';
import { financialDataString } from '@/lib/mock-data';

export async function getScenarioResponse(scenarioDescription: string) {
  try {
    const response = await simulateFinancialScenario({
      financialData: financialDataString,
      scenarioDescription: scenarioDescription,
    });
    return response;
  } catch (error) {
    console.error('Error simulating financial scenario:', error);
    throw new Error('Failed to get response from AI.');
  }
}
