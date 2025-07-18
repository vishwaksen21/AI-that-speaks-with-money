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
  scenarioAnalysis: z.string().describe('A detailed, well-structured analysis of the simulated financial scenario, formatted in Markdown. It should include potential outcomes, key factors, and numerical projections where possible.'),
  recommendations: z.string().describe('A list of clear, actionable, and personalized recommendations formatted in Markdown, based on the scenario analysis to help the user make informed decisions.'),
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
  prompt: `You are an expert financial planning AI that specializes in scenario simulation. Your purpose is to provide users with a clear understanding of the potential impacts of their financial decisions.

Analyze the user's financial data and the described scenario in detail.

**Scenario Analysis:**
Provide a comprehensive analysis in Markdown format. Break down the simulation into:
- **Immediate Impact:** What changes in the short term (e.g., net worth, cash flow)?
- **Long-Term Projections:** How does this affect long-term goals (e.g., retirement, wealth accumulation)?
- **Risks & Opportunities:** What are the potential downsides and upsides?
- **Key Assumptions:** State the assumptions you made for the simulation (e.g., interest rates, inflation).

**Recommendations:**
Provide personalized and actionable recommendations in Markdown format. These should be concrete steps the user can take to mitigate risks and maximize benefits.

User's Financial Data:
\`\`\`json
{{{financialData}}}
\`\`\`

Scenario Description: "{{{scenarioDescription}}}"

Begin your response now.
`,
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
