
'use server';
/**
 * @fileOverview An AI flow to generate personalized investment advice.
 *
 * - generateInvestmentAdvice - A function that takes financial data and returns investment advice.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format.'),
});

const AgentOutputSchema = z.object({
  advice: z.string().describe('A single, comprehensive recommendation document in Markdown format.'),
});

export async function generateInvestmentAdvice(input: z.infer<typeof AgentInputSchema>): Promise<z.infer<typeof AgentOutputSchema>> {
  return investmentAgentFlow(input);
}

const investmentAgentPrompt = ai.definePrompt({
  name: 'investmentAgentPrompt',
  input: {
    schema: AgentInputSchema, // { financialData: string }
  },
  output: {
    schema: AgentOutputSchema, // { advice: string }
  },
  prompt: `
You are a professional AI financial advisor.

You will be given a user's financial data. Based on that, your task is to analyze the data and provide personalized investment advice. The advice should be educational and not suggest specific stocks or funds by name.

⚠️ IMPORTANT:
- Your response MUST be ONLY a valid JSON object.
- Do NOT include any explanation or additional text.
- The JSON must strictly match this format:
  {
    "advice": "<your investment advice here as a markdown-formatted string>"
  }

---

**User's Financial Data:**
{{{financialData}}}

---

Now generate the JSON response:
`,
});

const investmentAgentFlow = ai.defineFlow(
  {
    name: 'investmentAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async (input) => {
    const {output} = await investmentAgentPrompt(input);

    if (!output || !output.advice) {
      throw new Error("The AI model was unable to generate investment advice for this profile.");
    }

    return output;
  }
);
