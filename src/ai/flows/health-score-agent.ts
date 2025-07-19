
'use server';
/**
 * @fileOverview An AI agent to analyze financial data and generate a health score.
 *
 * - generateFinancialHealthScore - a function that takes financial data and returns a score and advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format.'),
});

const AgentOutputSchema = z.object({
  score: z.number().describe('A financial health score between 300 and 850.'),
  advice: z.string().describe('A concise, actionable summary in Markdown format explaining the score and providing tips for improvement.'),
});

export async function generateFinancialHealthScore(input: z.infer<typeof AgentInputSchema>): Promise<z.infer<typeof AgentOutputSchema>> {
  return healthScoreAgentFlow(input);
}

const healthScoreAgentPrompt = ai.definePrompt({
  name: 'healthScoreAgentPrompt',
  input: {
    schema: AgentInputSchema,
  },
  output: {
    schema: AgentOutputSchema,
  },
  prompt: `
You are an expert financial analyst AI. Your task is to calculate a single "Financial Health Score" for a user based on their financial data. This score should be on a scale of 300-850, similar to a credit score.

Analyze the following factors:
- Savings Rate: (Monthly Income - Expenses) / Monthly Income. Assume expenses from SIPs and loan payments.
- Debt-to-Asset Ratio: Total Liabilities / Total Assets.
- Emergency Fund: Check if bank balances cover at least 3 months of income.
- Investment Diversity: Look at the allocation between stocks, mutual funds, real estate, etc.

Based on your analysis, generate a score and a concise, actionable summary (in Markdown) explaining the key factors influencing the score and providing 2-3 targeted recommendations for improvement.

**User's Financial Data:**
{{{financialData}}}

---
Respond ONLY with a valid JSON object in the specified format. Do not include any other text.
`,
});

const healthScoreAgentFlow = ai.defineFlow(
  {
    name: 'healthScoreAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {
    const {output} = await healthScoreAgentPrompt(input);

    if (
      !output ||
      typeof output !== 'object' ||
      !output.score ||
      typeof output.advice !== 'string'
    ) {
      throw new Error("The AI returned an invalid or empty response. Please try again.");
    }
    
    // Clamp the score to be within the 300-850 range
    output.score = Math.max(300, Math.min(850, output.score));

    return output;
  }
);
