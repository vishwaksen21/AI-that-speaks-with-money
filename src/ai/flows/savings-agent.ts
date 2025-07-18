
'use server';
/**
 * @fileOverview An AI flow to generate personalized savings and debt management advice.
 *
 * - generateSavingsAdvice - A function that takes financial data and returns savings/debt advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format.'),
});

const AgentOutputSchema = z.object({
  advice: z.string().describe('A single, comprehensive recommendation document in Markdown format.'),
});

export async function generateSavingsAdvice(input: z.infer<typeof AgentInputSchema>): Promise<z.infer<typeof AgentOutputSchema>> {
  return savingsAgentFlow(input);
}

const savingsAgentPrompt = ai.definePrompt({
  name: 'savingsAgentPrompt',
  input: {
    schema: AgentInputSchema,
  },
  output: {
    // The AI is now expected to return a single string, not a JSON object.
    schema: z.string().describe('A single, comprehensive recommendation document in Markdown format.'),
  },
  prompt: `You are a professional financial planning AI focused on savings and debt. Your task is to provide personalized, actionable advice based on the user's data. Analyze their income, savings, and liabilities.

**User's Financial Data:**
\`\`\`json
{{{financialData}}}
\`\`\`

**Your Task:**
Generate a comprehensive recommendation document in Markdown format. Your response MUST focus ONLY on savings and debt management.
*   Assess their savings relative to their income. Recommend a target savings rate.
*   Analyze their liabilities. If they have high-interest debt (like credit cards), strongly recommend a strategy to pay it down (e.g., the "avalanche" or "snowball" method).
*   Advise on building or maintaining an emergency fund (e.g., 3-6 months of monthly income).
`,
});

const savingsAgentFlow = ai.defineFlow(
  {
    name: 'savingsAgentFlow',
    inputSchema: AgentInputSchema,
    // The flow's final output still matches what the client expects.
    outputSchema: AgentOutputSchema,
  },
  async input => {
    const {output} = await savingsAgentPrompt(input);
    if (!output) {
      throw new Error("The AI model was unable to generate savings and debt advice for this profile.");
    }
    // We wrap the raw string output into the expected object structure here.
    return { advice: output };
  }
);
