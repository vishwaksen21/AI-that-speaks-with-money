// This is an AI-powered agent that allows users to simulate financial scenarios to make informed decisions.
'use server';
/**
 * @fileOverview Financial scenario simulation AI agent.
 *
 * - simulateFinancialScenario - A function that simulates financial scenarios.
 * - SimulateFinancialScenarioInput - The input type for the simulateFinancialScenario function.
 * - SimulateFinancialScenarioOutput - The return type for the simulateFinancialScenario function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateFinancialScenarioInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format, including assets, liabilities, net worth, credit scores, and EPF.'),
  scenarioDescription: z.string().describe('A natural language description of the financial scenario to simulate, e.g., \'impact of a ₹50L home loan\' or \'projected wealth at 40\'.'),
});

export type SimulateFinancialScenarioInput = z.infer<typeof SimulateFinancialScenarioInputSchema>;

const SimulateFinancialScenarioOutputSchema = z.object({
  scenarioAnalysis: z.string().describe('An analysis of the simulated financial scenario, including potential outcomes and key factors influencing the results.'),
  recommendations: z.string().describe('Personalized recommendations based on the scenario analysis to help the user make informed decisions.'),
});

export type SimulateFinancialScenarioOutput = z.infer<typeof SimulateFinancialScenarioOutputSchema>;

export async function simulateFinancialScenario(input: SimulateFinancialScenarioInput): Promise<SimulateFinancialScenarioOutput> {
  return simulateFinancialScenarioFlow(input);
}

const simulateFinancialScenarioPrompt = ai.definePrompt({
  name: 'simulateFinancialScenarioPrompt',
  input: {
    schema: SimulateFinancialScenarioInputSchema,
  },
  output: {
    schema: SimulateFinancialScenarioOutputSchema,
  },
  prompt: `You are a financial advisor AI agent that helps users simulate financial scenarios and provides personalized recommendations.

  Analyze the user's financial data and simulate the described scenario. Provide a detailed analysis of the potential outcomes and offer recommendations to help the user make informed decisions.

  User's Financial Data: {{{financialData}}}
  Scenario Description: {{{scenarioDescription}}}
  \n`,
});

const simulateFinancialScenarioFlow = ai.defineFlow(
  {
    name: 'simulateFinancialScenarioFlow',
    inputSchema: SimulateFinancialScenarioInputSchema,
    outputSchema: SimulateFinancialScenarioOutputSchema,
  },
  async input => {
    const {output} = await simulateFinancialScenarioPrompt(input);
    return output!;
  }
);
