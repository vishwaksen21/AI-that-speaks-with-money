
'use server';
/**
 * @fileOverview An AI flow to generate personalized financial recommendations.
 *
 * - generateRecommendations - A function that takes financial data and returns tailored advice.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecommendationsInputSchema = z.object({
  financialData: z.string().describe('The user\'s consolidated financial data in JSON format.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const GenerateRecommendationsOutputSchema = z.object({
  investmentStrategy: z.string().describe('A detailed, actionable investment strategy formatted in Markdown. It should suggest asset allocations (e.g., stocks, bonds, mutual funds) based on the user\'s profile and risk tolerance inferred from their age and income. Provide specific, educational examples of types of investments.'),
  savingsAndDebt: z.string().describe('Actionable advice on savings and debt management formatted in Markdown. This should cover emergency funds, high-interest debt repayment, and increasing savings rate.'),
  expenseOptimization: z.string().describe('Analysis of spending patterns and suggestions for expense optimization formatted in Markdown. Identify top spending categories and suggest potential areas for reduction.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const recommendationsPrompt = ai.definePrompt({
  name: 'recommendationsPrompt',
  input: {
    schema: GenerateRecommendationsInputSchema,
  },
  output: {
    schema: GenerateRecommendationsOutputSchema,
  },
  prompt: `You are a professional financial analyst AI. Your task is to provide personalized, actionable financial recommendations based on the user's data. Analyze their entire financial situation to generate a comprehensive plan.

**User's Financial Data:**
\`\`\`json
{{{financialData}}}
\`\`\`

**Your Task:**
Generate a response with three distinct sections, following the output schema precisely.

1.  **Investment Strategy:**
    *   Based on the user's age, income, and existing assets, recommend a suitable asset allocation (e.g., 70% equity, 30% debt).
    *   Suggest specific *types* of investments for each category (e.g., for equity, suggest a mix of index funds and blue-chip stocks; for debt, suggest government bonds or high-quality corporate bonds).
    *   Provide clear reasoning for your recommendations. Keep the advice educational.

2.  **Savings & Debt Management:**
    *   Assess their savings relative to their income. Recommend a target savings rate.
    *   Analyze their liabilities. If they have high-interest debt (like credit cards), strongly recommend a strategy to pay it down (e.g., the "avalanche" or "snowball" method).
    *   Advise on building or maintaining an emergency fund (e.g., 3-6 months of monthly income).

3.  **Expense Optimization:**
    *   Analyze their monthly income versus their SIPs and other known regular expenses if available in the data.
    *   Provide general advice on tracking expenses and identifying areas for potential cutbacks to increase their savings rate. For example, suggest reviewing discretionary spending categories.

Structure your entire response as a valid JSON object matching the output schema. Use Markdown within the JSON string values for clear formatting (headings, lists).
`,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await recommendationsPrompt(input);
    if (!output) {
      throw new Error("The AI model was unable to generate recommendations for this profile.");
    }
    return output;
  }
);
