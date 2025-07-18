
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
    schema: AgentOutputSchema,
  },
  prompt: `You are a professional financial planning AI focused on savings and debt. Your entire output must be a single JSON object.

Your task is to provide personalized, actionable advice based on the user's data. Analyze their income, savings, and liabilities. The final advice must be formatted as a Markdown string inside the 'advice' field of the JSON object.

**User's Financial Data:**
{{{financialData}}}

**Your Task:**
1.  **Analyze the Data:** Review the user's income, savings, and liabilities.
2.  **Formulate Advice:** Create a comprehensive savings and debt management plan in Markdown format.
    *   Assess their savings relative to their income. Recommend a target savings rate.
    *   Analyze their liabilities. If they have high-interest debt (like credit cards), strongly recommend a strategy to pay it down (e.g., the "avalanche" or "snowball" method).
    *   Advise on building or maintaining an emergency fund (e.g., 3-6 months of monthly income).
3.  **Format Output:** Your entire response must be a single JSON object like this: \`{"advice": "## Your Savings & Debt Plan\\n\\nBased on your profile..."}\`

Begin generation now.
`,
});

const savingsAgentFlow = ai.defineFlow(
  {
    name: 'savingsAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async input => {
    const llmResponse = await savingsAgentPrompt(input);
    const output = llmResponse.output();
    
    if (!output) {
      throw new Error("The AI model was unable to generate savings and debt advice for this profile.");
    }
    
    // The output from the LLM is a string of JSON, so we need to parse it.
    try {
        const parsedOutput = JSON.parse(output as any);
        return AgentOutputSchema.parse(parsedOutput);
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", output);
        throw new Error("The AI returned data in an invalid format. Please try again.");
    }
  }
);
