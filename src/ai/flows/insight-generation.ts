// src/ai/flows/insight-generation.ts
'use server';
/**
 * @fileOverview A flow that generates personalized financial insights for a user.
 *
 * - generatePersonalizedFinancialInsights - A function that generates personalized financial insights.
 * - GeneratePersonalizedFinancialInsightsInput - The input type for the generatePersonalizedFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import { taxCalculatorTool } from '@/ai/tools/tax-calculator';
import {z} from 'genkit';
import {generate} from 'genkit/generate';

const GeneratePersonalizedFinancialInsightsInputSchema = z.object({
  financialData: z.string().describe('The user financial data in JSON format.'),
  userQuestion: z.string().describe('The user question in natural language.'),
});
export type GeneratePersonalizedFinancialInsightsInput = z.infer<typeof GeneratePersonalizedFinancialInsightsInputSchema>;

export async function generatePersonalizedFinancialInsights(input: GeneratePersonalizedFinancialInsightsInput) {
  return generatePersonalizedFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedFinancialInsightsPrompt',
  input: {schema: GeneratePersonalizedFinancialInsightsInputSchema},
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
    outputSchema: z.string(), // We will stream the string response
  },
  async (input) => {
    const {stream, response} = generate({
      prompt: prompt.prompt,
      model: prompt.model,
      tools: prompt.tools,
      input,
      stream: true,
    });
    
    let result = '';
    const chunks: string[] = [];

    for await (const chunk of stream) {
        if(chunk.content){
            result += chunk.content.map(c => c.text).join('');
            chunks.push(chunk.content.map(c => c.text).join(''));
        }
    }
    
    const finalResponse = await response;
    
    if (finalResponse.candidates[0].finishReason !== 'stop' && finalResponse.candidates[0].finishReason !== 'toolUse') {
        throw new Error(`The model stopped generating for an unexpected reason: ${finalResponse.candidates[0].finishReason}`);
    }

    return chunks.join('');
  }
);
