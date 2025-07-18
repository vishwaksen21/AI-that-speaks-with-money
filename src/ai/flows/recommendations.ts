
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

// The AI will now return a single markdown string.
const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('A single, comprehensive financial recommendation document in Markdown format. It must contain three sections with the exact headings: "## Investment Strategy", "## Savings & Debt Management", and "## Expense Optimization".'),
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
Generate a single, cohesive response in Markdown format. Your response MUST include the following three sections with these exact headings:

## Investment Strategy
*   Based on the user's age, income, and existing assets, recommend a suitable asset allocation (e.g., 70% equity, 30% debt).
*   Suggest specific *types* of investments for each category (e.g., for equity, suggest a mix of index funds and blue-chip stocks; for debt, suggest government bonds or high-quality corporate bonds).
*   Provide clear reasoning for your recommendations. Keep the advice educational.

## Savings & Debt Management
*   Assess their savings relative to their income. Recommend a target savings rate.
*   Analyze their liabilities. If they have high-interest debt (like credit cards), strongly recommend a strategy to pay it down (e.g., the "avalanche" or "snowball" method).
*   Advise on building or maintaining an emergency fund (e.g., 3-6 months of monthly income).

## Expense Optimization
*   Analyze their monthly income versus their SIPs and other known regular expenses if available in the data.
*   Provide general advice on tracking expenses and identifying areas for potential cutbacks to increase their savings rate. For example, suggest reviewing discretionary spending categories.

Structure your entire response as a single Markdown document within the 'recommendations' field of the output JSON.
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
