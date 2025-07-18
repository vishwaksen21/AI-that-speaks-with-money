
'use server';
/**
 * @fileOverview An AI flow to generate personalized expense optimization advice.
 *
 * - generateExpenseAdvice - a function that takes financial data and returns expense advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format.'),
});

const AgentOutputSchema = z.object({
  advice: z.string().describe('A single, comprehensive recommendation document in Markdown format.'),
});


export async function generateExpenseAdvice(input: z.infer<typeof AgentInputSchema>): Promise<z.infer<typeof AgentOutputSchema>> {
  return expenseAgentFlow(input);
}

const expenseAgentPrompt = ai.definePrompt({
  name: 'expenseAgentPrompt',
  input: {
    schema: AgentInputSchema,
  },
  output: {
    schema: AgentOutputSchema,
  },
  prompt: `
You are a professional AI financial coach specializing in expense management.

You will receive a user's financial data. Analyze it and generate personalized advice on optimizing spending.

⚠️ Very Important Instructions:
- Respond ONLY with a valid JSON object.
- DO NOT include any commentary, explanation, or extra characters.
- Your entire output MUST look exactly like this format:

{
  "advice": "<your expense optimization advice here as a markdown-formatted string>"
}

---

**User's Financial Data:**
{{{financialData}}}

---

Now respond with only the JSON object.
If the data is unclear, respond with:
{
  "advice": "Please provide more detailed financial data for accurate expense optimization advice."
}
`,
});

const expenseAgentFlow = ai.defineFlow(
  {
    name: 'expenseAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {
    const {output} = await expenseAgentPrompt(input);

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
