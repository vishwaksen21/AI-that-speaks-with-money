
'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { textToSpeech } from '@/ai/flows/tts';

function handleApiError(error: any, serviceName: string) {
  console.error(`Error calling ${serviceName}:`, error);
  if (error.message && error.message.includes('429')) {
    throw new Error('API quota exceeded. Please try again later.');
  }
  throw new Error(`Failed to get response from ${serviceName} AI.`);
}


export async function getChatResponse(userQuestion: string, financialData: string) {
  try {
    const response = await generatePersonalizedFinancialInsights({
      financialData: financialData,
      userQuestion: userQuestion,
    });
    return { insight: response.insights };
  } catch (error) {
     handleApiError(error, 'Chat');
  }
}

export async function getTextToSpeech(text: string) {
    try {
        const response = await textToSpeech(text);
        return response;
    } catch (error) {
        handleApiError(error, 'TTS');
    }
}
