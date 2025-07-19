
'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { createStreamableValue } from 'ai/rsc';
import { CoreMessage } from 'ai';

export async function getChatResponse(history: CoreMessage[], userQuestion: string, financialData: string) {
    const stream = createStreamableValue();

    (async () => {
        try {
             const result = await generatePersonalizedFinancialInsights({
                userQuestion,
                financialData,
            });

            for await (const delta of result) {
                stream.update(delta);
            }
        } catch(e) {
            console.error(e);
            stream.update("Sorry, an error occurred. Please try again.");
        }
        finally {
            stream.done();
        }
    })();
    
    return {
        output: stream.value
    };
}

    