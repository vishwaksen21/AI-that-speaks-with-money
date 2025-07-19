
'use server';
/**
 * @fileOverview An AI flow to generate a personalized financial plan for a user's goal.
 *
 * - generateGoalPlan - A function that takes a goal and financial data and returns a plan.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { generate } from 'genkit/generate';

const AgentInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format.'),
  goalDescription: z.string().describe('A natural language description of the user\'s financial goal.'),
});

export async function generateGoalPlan(input: z.infer<typeof AgentInputSchema>) {
  return goalPlannerFlow(input);
}

const goalPlannerPrompt = ai.definePrompt({
  name: 'goalPlannerPrompt',
  input: {
    schema: AgentInputSchema,
  },
  prompt: `You are an expert financial planning AI that specializes in creating actionable goal-based plans.

Your task is to analyze the user's stated goal and their current financial situation to create a clear, step-by-step plan.

Your response MUST be a single, well-structured markdown document. It should include:
- **Goal Summary:** Briefly restate the user's goal.
- **Feasibility Analysis:** A quick assessment of how achievable the goal is with their current finances.
- **Monthly Target:** Calculate the required monthly savings or investment needed.
- **Investment Strategy:** Recommend a suitable asset allocation (e.g., % in equity, % in debt) based on the goal's timeline and risk profile. DO NOT name specific stocks or funds.
- **Actionable Steps:** A numbered list of concrete steps the user should take.
- **Disclaimer:** Include a standard disclaimer about this not being financial advice.

User's Financial Data:
\`\`\`json
{{{financialData}}}
\`\`\`

User's Goal: "{{{goalDescription}}}"

Begin your response now.
`,
});

const goalPlannerFlow = ai.defineFlow(
  {
    name: 'goalPlannerFlow',
    inputSchema: AgentInputSchema,
    outputSchema: z.string(), // We will stream the string response
  },
  async input => {
     const {stream, response} = await ai.generate({
      prompt: goalPlannerPrompt.prompt,
      model: goalPlannerPrompt.model,
      input,
      stream: true,
    });
    
    const chunks: string[] = [];

    for await (const chunk of stream) {
      if (chunk.content) {
        chunks.push(chunk.content.map(c => c.text).join(''));
      }
    }
    
    await response;
    
    return chunks.join('');
  }
);
