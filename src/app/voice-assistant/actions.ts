'use server';

import { generatePersonalizedFinancialInsights } from '@/ai/flows/insight-generation';
import { textToSpeech } from '@/ai/flows/tts';
import { financialDataString } from '@/lib/mock-data';

export async function getChatResponse(userQuestion: string) {
  try {
    const response = await generatePersonalizedFinancialInsights({
      financialData: financialDataString,
      userQuestion: userQuestion,
    });
    return { insight: response.insights };
  } catch (error) {
    console.error('Error generating financial insights:', error);
    throw new Error('Failed to get response from AI.');
  }
}

export async function getTextToSpeech(text: string) {
    try {
        const response = await textToSpeech(text);
        return response;
    } catch (error) {
        console.error('Error generating speech:', error);
        throw new Error('Failed to get response from TTS AI.');
    }
}
