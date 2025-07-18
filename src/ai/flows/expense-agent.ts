
'use server';
/**
 * @fileOverview An AI flow to generate personalized expense optimization advice.
 *
 * - generateExpenseAdvice - A function that takes financial data and returns expense advice.
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
    // The AI is now expected to return a single string, not a JSON object.
    schema: z.string().describe('A single, comprehensive recommendation document in Markdown format.'),
  },
  prompt: `You are a professional financial coach AI specializing in expense management. Your task is to provide personalized, actionable advice on optimizing spending. Analyze the user's income and known regular investments (SIPs).

**User's Financial Data:**
\`\`\`json
{{{financialData}}}
\`\`\`

**Your Task:**
Generate a comprehensive recommendation document in Markdown format. Your response MUST focus ONLY on expense optimization.
*   Analyze their monthly income versus their SIPs and other known regular expenses if available in the data.
*   Provide general advice on tracking expenses and identifying areas for potential cutbacks to increase their savings rate. For example, suggest reviewing discretionary spending categories.
*   Suggest practical tips for budgeting and mindful spending.
`,
});

const expenseAgentFlow = ai.defineFlow(
  {
    name: 'expenseAgentFlow',
    inputSchema: AgentInputSchema,
     // The flow's final output still matches what the client expects.
    outputSchema: AgentOutputSchema,
  },
  async input => {
    const {output} = await expenseAgentPrompt(input);
    if (!output) {
      throw new Error("The AI model was unable to generate expense advice for this profile.");
    }
    // We wrap the raw string output into the expected object structure here.
    return { advice: output };
  }
);
