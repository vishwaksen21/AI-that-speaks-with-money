
'use server';

import { simulateFinancialScenario } from '@/ai/flows/scenario-simulation';

export async function getScenarioResponse(scenarioDescription: string, financialData: string) {
  const stream = await simulateFinancialScenario({
      financialData,
      scenarioDescription,
  });
  
  return stream;
}
