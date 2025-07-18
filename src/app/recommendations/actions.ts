
'use server';

import { generateRecommendations } from '@/ai/flows/recommendations';

export async function getRecommendations(financialData: string) {
  try {
    const response = await generateRecommendations({ financialData });
    // Return the entire response object which now contains the single 'recommendations' field
    return response;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw new Error('Failed to get response from AI.');
  }
}
