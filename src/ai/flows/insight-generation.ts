// src/ai/flows/insight-generation.ts
'use server';
/**
 * @fileOverview A flow that generates personalized financial insights for a user.
 *
 * - generatePersonalizedFinancialInsights - A function that generates personalized financial insights.
 * - GeneratePersonalizedFinancialInsightsInput - The input type for the generatePersonalizedFinancialInsights function.
 * - GeneratePersonalizedFinancialInsightsOutput - The return type for the generatePersonalizedFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import { taxCalculatorTool } from '@/ai/tools/tax-calculator';
import {z} from 'genkit';

const GeneratePersonalizedFinancialInsightsInputSchema = z.object({
  financialData: z.string().describe('The user financial data in JSON format.'),
  userQuestion: z.string().describe('The user question in natural language.'),
});
export type GeneratePersonalizedFinancialInsightsInput = z.infer<typeof GeneratePersonalizedFinancialInsightsInputSchema>;

const GeneratePersonalizedFinancialInsightsOutputSchema = z.object({
  insights: z.string().describe('A detailed, well-structured markdown response answering the user\'s question. The response should be broken down into logical sections with clear headings (e.g., "Analysis", "Key Observations", "Recommendations").'),
});
export type GeneratePersonalizedFinancialInsightsOutput = z.infer<typeof GeneratePersonalizedFinancialInsightsOutputSchema>;

export async function generatePersonalizedFinancialInsights(input: GeneratePersonalizedFinancialInsightsInput): Promise<GeneratePersonalizedFinancialInsightsOutput> {
  return generatePersonalizedFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedFinancialInsightsPrompt',
  input: {schema: GeneratePersonalizedFinancialInsightsInputSchema},
  output: {schema: GeneratePersonalizedFinancialInsightsOutputSchema},
  tools: [taxCalculatorTool],
  prompt: `You are a world-class financial advisor AI. Your goal is to provide clear, actionable, and personalized financial advice.

Analyze the user's financial data and their question thoroughly. Provide a comprehensive answer formatted in Markdown.

Use headings, bullet points, and bold text to structure your response for maximum readability. Always include a summary, a detailed analysis, and actionable recommendations where appropriate.

If the user's question is about taxes or tax optimization, you MUST use the provided 'taxCalculatorTool' to analyze their situation and provide data-driven recommendations. Do not provide tax advice without using the tool.

If the user asks for a specific piece of data from their profile (like 'credit_score' or 'net_worth'), provide that data directly and clearly.

User's Financial Data:
\`\`\`json
{{{financialData}}}
\`\`\`

User's Question: "{{{userQuestion}}}"

Begin your response now.
`,
});

const generatePersonalizedFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedFinancialInsightsFlow',
    inputSchema: GeneratePersonalizedFinancialInsightsInputSchema,
    outputSchema: GeneratePersonalizedFinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The AI model returned no output.");
    }
    return output;
  }
);
