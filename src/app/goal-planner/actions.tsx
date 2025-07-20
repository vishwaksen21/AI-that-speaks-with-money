
'use server';

import { createAI, getMutableAIState, createStreamableUI } from 'ai/rsc';
import ReactMarkdown from 'react-markdown';
import { generateGoalPlan as generateGoalPlanFlow } from '@/ai/flows/goal-planner-agent';


export async function getGoalPlan(goalDescription: string, financialData: string) {
    'use server';
    const aiState = getMutableAIState<typeof AI>();
    const uiStream = createStreamableUI(<div>Loading...</div>);

    (async () => {
        try {
            const resultStream = await generateGoalPlanFlow({
                financialData,
                goalDescription,
            });

            let finalResponse = '';
            // @ts-ignore
            for await (const delta of resultStream) {
                finalResponse += delta;
                uiStream.update(<ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">{finalResponse}</ReactMarkdown>);
            }

            aiState.done([
                ...aiState.get(),
                {
                    role: 'assistant',
                    content: finalResponse,
                },
            ]);

            uiStream.done();

        } catch(e) {
            console.error("Error in getGoalPlan action:", e);
            const errorMarkdown = `Sorry, I encountered an error while generating your plan. Please try again. Error: ${(e as Error).message}`;
            uiStream.done(<ReactMarkdown>{errorMarkdown}</ReactMarkdown>);
        }
    })();
    
    return {
        id: Date.now(),
        display: uiStream.value
    }
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool';
  content: string;
  id?: string;
  name?: string;
}[] = [];

// The initial UI state that the client will keep track of.
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
    actions: {
        getGoalPlan,
    },
    initialAIState,
    initialUIState
});
