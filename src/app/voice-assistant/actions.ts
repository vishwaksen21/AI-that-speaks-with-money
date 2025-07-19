
'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { textToSpeech } from '@/ai/flows/tts';
import { convertStreamableValue } from 'ai/rsc';

function handleApiError(error: any, serviceName: string) {
  console.error(`Error calling ${serviceName}:`, error);
  if (error.message && error.message.includes('429')) {
    throw new Error('API quota exceeded. Please try again later.');
  }
  throw new Error(`Failed to get response from ${serviceName} AI.`);
}


export async function getChatAndSpeechResponse(userQuestion: string, financialData: string) {
  try {
    const insightStream = await generatePersonalizedFinancialInsights({
      financialData: financialData,
      userQuestion: userQuestion,
    });

    const { text, ...rest } = convertStreamableValue(insightStream);

    return {
      ...rest,
      text: async () => {
        const result = await text;
        const ttsResponse = await getTextToSpeech(result);
        return { text: result, audio: ttsResponse?.media };
      },
    };

  } catch (error) {
     handleApiError(error, 'Chat/TTS');
     return { text: async () => ({ text: 'Sorry, I encountered an error.', audio: null }) };
  }
}

export async function getTextToSpeechOnly(text: string) {
    try {
        const response = await textToSpeech(text);
        return response;
    } catch (error) {
        handleApiError(error, 'TTS');
    }
}
