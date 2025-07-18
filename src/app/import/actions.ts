
'use server';

import { extractFinancialData } from '@/ai/flows/data-extraction';

export async function uploadFinancialData(fileContent: string): Promise<{ success: boolean; data?: any; error?: string }> {
  console.log('Received file content on the server. Sending to AI for extraction.');

  try {
    // Call the AI flow to extract and structure the data
    const structuredData = await extractFinancialData(fileContent);

    // In a real app, you might do further validation here
    if (!structuredData) {
        throw new Error('AI could not extract valid data from the file.');
    }

    console.log('AI Extracted Data:', structuredData);
    
    // Return a success response with the structured data
    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error('Failed to process or extract financial data:', error);
    
    // Return an error response
    return { success: false, error: error.message || 'An error occurred while processing the file with AI.' };
  }
}
