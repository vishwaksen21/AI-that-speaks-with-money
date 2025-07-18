
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
  prompt: `
You are a professional AI financial planning AI focused on savings and debt.

You will receive a user's financial data. Analyze it and generate clear savings and debt management advice.

⚠️ Very Important Instructions:
- Respond ONLY with a valid JSON object.
- DO NOT include any commentary, explanation, or extra characters.
- Your entire output MUST look exactly like this format:

{
  "advice": "<your savings and debt advice here as a markdown-formatted string>"
}

---

**User's Financial Data:**
{{{financialData}}}

---

Now respond with only the JSON object.
If the data is unclear, respond with:
{
  "advice": "Please provide more detailed financial data for accurate savings and debt advice."
}
`,
});

const savingsAgentFlow = ai.defineFlow(
  {
    name: 'savingsAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {
    const {output} = await savingsAgentPrompt(input);
    
    if (
      !output ||
      typeof output !== 'object' ||
      !output.advice ||
      typeof output.advice !== 'string'
    ) {
      throw new Error("Invalid or empty advice. Please try again with clearer data.");
    }
    
    return output;
  }
);
