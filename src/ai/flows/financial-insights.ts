// financial-insights.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating financial insights from natural language queries.
 *
 * - getFinancialInsights - A function that takes a user's financial query and returns personalized insights.
 * - FinancialInsightsInput - The input type for the getFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialInsightsInputSchema = z.object({
  query: z
    .string()
    .describe("The user's financial question in natural language, e.g., 'How much money will I have at 40?'"),
  financialData: z.string().describe('The user financial data from the Fi MCP server in JSON format.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  insight: z.string().describe('The personalized financial insight generated from the user query and financial data.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const financialInsightsPrompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: {schema: FinancialInsightsInputSchema},
  output: {schema: FinancialInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Use the user's financial data to answer their question.

User Question: {{{query}}}

Financial Data: {{{financialData}}}

Answer:`,
});

const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await financialInsightsPrompt(input);
    return output!;
  }
);
