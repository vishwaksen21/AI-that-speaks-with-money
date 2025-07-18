
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

You will be given a user's financial data. Based on that, your task is to analyze the data and provide personalized advice on optimizing spending.

⚠️ IMPORTANT:
- Your response MUST be ONLY a valid JSON object.
- Do NOT include any explanation or additional text.
- The JSON must strictly match this format:
  {
    "advice": "<your expense optimization advice here as a markdown-formatted string>"
  }

---

**User's Financial Data:**
{{{financialData}}}

---

Now generate the JSON response:
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

    if (!output || !output.advice) {
      throw new Error("The AI model was unable to generate expense advice for this profile.");
    }

    return output;
  }
);
