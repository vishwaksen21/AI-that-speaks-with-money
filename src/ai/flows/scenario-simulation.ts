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
  scenarioDescription: z.string().describe('A natural language description of the financial scenario to simulate, e.g., \'impact of a ₹50L home loan\' or \'projected wealth at 40\'. Can also be a general financial question.'),
});

export type SimulateFinancialScenarioInput = z.infer<typeof SimulateFinancialScenarioInputSchema>;

const SimulateFinancialScenarioOutputSchema = z.object({
  scenarioAnalysis: z.string().describe('A detailed, well-structured analysis of the simulated financial scenario or financial question, formatted in Markdown. It should include potential outcomes, key factors, and numerical projections where possible.'),
  recommendations: z.string().describe('A list of clear, actionable, and personalized recommendations formatted in Markdown, based on the analysis to help the user make informed decisions.'),
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
  prompt: `You are an expert financial planning AI. Your purpose is to provide users with a clear understanding of the potential impacts of their financial decisions, or to answer their financial questions based on their data.

Analyze the user's financial data and their described scenario or question in detail.

**If the user asks for a specific scenario simulation:**
- **Immediate Impact:** What changes in the short term (e.g., net worth, cash flow)?
- **Long-Term Projections:** How does this affect long-term goals (e.g., retirement, wealth accumulation)?
- **Risks & Opportunities:** What are the potential downsides and upsides?
- **Key Assumptions:** State the assumptions you made for the simulation (e.g., interest rates, inflation).

**If the user asks a general question (e.g., "what stocks to buy?"):**
- Provide a helpful, well-reasoned analysis and recommendations based on their financial data, even if it's not a direct simulation.
- Your advice should be generic and educational in nature.

**Recommendations:**
Provide personalized and actionable recommendations in Markdown format. These should be concrete steps the user can take.

**Disclaimer:**
Always include a disclaimer at the end of your response: "Disclaimer: I am an AI assistant. This information is for educational purposes only and is not financial advice. Please consult with a qualified human financial advisor before making any decisions."

User's Financial Data:
\`\`\`json
{{{financialData}}}
\`\`\`

Scenario or Question: "{{{scenarioDescription}}}"

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
    if (!output) {
      throw new Error("The AI model was unable to generate a response for this scenario.");
    }
    return output;
  }
);
