
'use server';

import { createAI, getMutableAIState, createStreamableUI } from 'ai/rsc';
import { simulateFinancialScenario as simulateFinancialScenarioFlow } from '@/ai/flows/scenario-simulation';
import ReactMarkdown from 'react-markdown';
import { ReactNode } from 'react';

export async function getScenarioResponse(scenarioDescription: string, financialData: string) {
    'use server';
    const aiState = getMutableAIState<typeof AI>();
    const uiStream = createStreamableUI(<div className="p-4 text-center text-muted-foreground">Simulating financial scenario...</div>);

    (async () => {
        try {
            const stream = await simulateFinancialScenarioFlow({
                financialData,
                scenarioDescription,
            });
            
            let finalResponse = '';
            for await (const delta of stream) {
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
            console.error("Error in getScenarioResponse action:", e);
            const errorMarkdown = `Sorry, I encountered an error. Please try again. Error: ${(e as Error).message}`;
            uiStream.done(<ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert text-destructive">{errorMarkdown}</ReactMarkdown>);
            aiState.done([
                ...aiState.get(),
                {
                    role: 'assistant',
                    content: errorMarkdown,
                },
            ]);
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
  display: ReactNode;
}[] = [];

export const AI = createAI({
    actions: {
        getScenarioResponse,
    },
    initialAIState,
    initialUIState
});
