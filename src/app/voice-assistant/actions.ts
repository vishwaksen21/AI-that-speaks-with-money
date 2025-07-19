
'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { textToSpeech } from '@/ai/flows/tts';
import { createStreamableValue } from 'ai/rsc';

function handleApiError(error: any, serviceName: string) {
  console.error(`Error calling ${serviceName}:`, error);
  if (error.message && error.message.includes('429')) {
    throw new Error('API quota exceeded. Please try again later.');
  }
  throw new Error(`Failed to get response from ${serviceName} AI.`);
}


export async function getChatAndSpeechResponse(userQuestion: string, financialData: string) {
  const streamable = createStreamableValue({ text: '', audio: null as string | null | undefined });

  (async () => {
    try {
      const insightStream = await generatePersonalizedFinancialInsights({
        financialData: financialData,
        userQuestion: userQuestion,
      });

      let fullText = '';
      for await (const delta of insightStream) {
        if (typeof delta === 'string') {
          fullText += delta;
          streamable.update({ text: fullText, audio: null });
        }
      }

      // After text is complete, generate audio
      const ttsResponse = await getTextToSpeechOnly(fullText);
      streamable.update({ text: fullText, audio: ttsResponse?.media });

    } catch (error) {
       handleApiError(error, 'Chat/TTS');
       streamable.update({ text: 'Sorry, I encountered an error.', audio: null });
    } finally {
        streamable.done();
    }
  })();
  
  return streamable.value;
}

export async function getTextToSpeechOnly(text: string) {
    try {
        if(!text.trim()) return null;
        const response = await textToSpeech(text);
        return response;
    } catch (error) {
        handleApiError(error, 'TTS');
        return null;
    }
}
