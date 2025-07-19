
'use server';

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export async function getGoalResponse(goalDescription: string, financialData: string) {
    const prompt = `You are an expert financial planning AI that specializes in creating actionable goal-based plans.

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
${financialData}
\`\`\`

User's Goal: "${goalDescription}"

Begin your response now.
`;

    const result = await streamText({
        model: google('models/gemini-1.5-flash-latest'),
        prompt: prompt,
    });
    
    return result.toAIStream();
}
