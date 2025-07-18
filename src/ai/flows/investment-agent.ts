
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

You will receive a user's financial data. Analyze it and generate clear, safe investment advice. The advice should be educational and not suggest specific stocks or funds by name.

⚠️ Very Important Instructions:
- Respond ONLY with a valid JSON object.
- DO NOT include any commentary, explanation, or extra characters.
- Your entire output MUST look exactly like this format:

{
  "advice": "<your investment advice here as a markdown-formatted string>"
}

---

**User's Financial Data:**
{{{financialData}}}

---

Now respond with only the JSON object.
If the data is unclear, respond with:
{
  "advice": "Please provide more detailed financial data for accurate investment advice."
}
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
