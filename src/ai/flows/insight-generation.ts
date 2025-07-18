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
import {z} from 'genkit';

const GeneratePersonalizedFinancialInsightsInputSchema = z.object({
  financialData: z.string().describe('The user financial data in JSON format.'),
  userQuestion: z.string().describe('The user question in natural language.'),
});
export type GeneratePersonalizedFinancialInsightsInput = z.infer<typeof GeneratePersonalizedFinancialInsightsInputSchema>;

const GeneratePersonalizedFinancialInsightsOutputSchema = z.object({
  insights: z.string().describe('The personalized financial insights.'),
});
export type GeneratePersonalizedFinancialInsightsOutput = z.infer<typeof GeneratePersonalizedFinancialInsightsOutputSchema>;

export async function generatePersonalizedFinancialInsights(input: GeneratePersonalizedFinancialInsightsInput): Promise<GeneratePersonalizedFinancialInsightsOutput> {
  return generatePersonalizedFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedFinancialInsightsPrompt',
  input: {schema: GeneratePersonalizedFinancialInsightsInputSchema},
  output: {schema: GeneratePersonalizedFinancialInsightsOutputSchema},
  prompt: `You are a financial advisor. Analyze the user's financial data and answer the user's question.

Financial Data: {{{financialData}}}

User Question: {{{userQuestion}}}

Provide personalized financial insights based on the data and question. If the user mentions a numeric amount with "₹", interpret this correctly.
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
    return output!;
  }
);
