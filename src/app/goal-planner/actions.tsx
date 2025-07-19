
'use server';

import { createAI, getMutableAIState, createStreamableUI } from 'ai/rsc';
import { generateGoalPlan } from '@/ai/flows/goal-planner-agent';
import ReactMarkdown from 'react-markdown';

export async function getGoalPlan(goalDescription: string, financialData: string) {
    'use server';
    const aiState = getMutableAIState<typeof AI>();
    const uiStream = createStreamableUI(<div>Loading...</div>);

    (async () => {
        try {
            const result = await generateGoalPlan({
                goalDescription,
                financialData,
            });

            // Update the AI state with the text response.
            aiState.done([
                ...aiState.get(),
                {
                    role: 'assistant',
                    content: result,
                },
            ]);

            uiStream.done(<ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">{result}</ReactMarkdown>);
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
  role: 'user' | 'assistant' | 'system' | 'function';
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
