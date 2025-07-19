
'use server';

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';

export async function getChatResponse(userQuestion: string, financialData: string) {
  const result = await streamText({
    model: google('models/gemini-1.5-flash-latest'),
    prompt: `You are a world-class financial advisor AI. Your goal is to provide clear, actionable, and personalized financial advice.
Analyze the user's financial data and their question thoroughly. Provide a comprehensive answer formatted in Markdown.
Use headings, bullet points, and bold text to structure your response for maximum readability. Always include a summary, a detailed analysis, and actionable recommendations where appropriate.
If the user asks for a specific piece of data from their profile (like 'credit_score' or 'net_worth'), provide that data directly and clearly.
User's Financial Data:
\`\`\`json
${financialData}
\`\`\`
User's Question: "${userQuestion}"
Begin your response now.`,
  });

  return result.toAIStream();
}
