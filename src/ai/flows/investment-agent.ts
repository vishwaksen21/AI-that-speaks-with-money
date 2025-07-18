
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
    schema: AgentInputSchema,
  },
  output: {
    schema: AgentOutputSchema,
  },
  prompt: `You are a professional investment advisor AI. Your entire output must be a single JSON object.

Your task is to provide personalized, actionable investment advice based on the user's data. Analyze their assets, income, and age to generate a comprehensive plan. The final advice must be formatted as a Markdown string inside the 'advice' field of the JSON object.

**User's Financial Data:**
\`\`\`json
{{{financialData}}}
\`\`\`

**Your Task:**
1.  **Analyze the Data:** Review the user's age, income, and existing assets.
2.  **Formulate Advice:** Create a comprehensive investment recommendation document in Markdown format.
    *   Recommend a suitable asset allocation (e.g., 70% equity, 30% debt).
    *   Suggest specific *types* of investments for each category (e.g., for equity, suggest a mix of index funds and blue-chip stocks; for debt, suggest government bonds or high-quality corporate bonds).
    *   Provide clear reasoning for your recommendations. Keep the advice educational and do not suggest specific stocks or funds by name.
3.  **Format Output:** Your entire response must be a single JSON object like this: \`{"advice": "## Your Investment Strategy\\n\\nBased on your profile..."}\`

Begin generation now.
`,
});

const investmentAgentFlow = ai.defineFlow(
  {
    name: 'investmentAgentFlow',
    inputSchema: AgentInputSchema,
    outputSchema: AgentOutputSchema,
  },
  async input => {
    const {output} = await investmentAgentPrompt(input);
    if (!output) {
      throw new Error("The AI model was unable to generate investment advice for this profile.");
    }
    return output;
  }
);
