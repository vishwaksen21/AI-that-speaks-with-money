
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

You will be given a user's financial data. Based on that, your task is to analyze the data and provide personalized savings and debt management advice.

⚠️ IMPORTANT:
- Your response MUST be ONLY a valid JSON object.
- Do NOT include any explanation or additional text.
- The JSON must strictly match this format:
  {
    "advice": "<your savings and debt advice here as a markdown-formatted string>"
  }

---

**User's Financial Data:**
{{{financialData}}}

---

Now generate the JSON response:
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
    
    if (!output || !output.advice) {
      throw new Error("The AI model was unable to generate savings and debt advice for this profile.");
    }
    
    return output;
  }
);
