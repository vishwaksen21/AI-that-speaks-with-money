
'use server';

import { extractFinancialData } from '@/ai/flows/data-extraction';
import { parseFile } from '@/services/file-parser';

export async function uploadFinancialData(
  file: { buffer: number[]; type: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  console.log('Received file on the server. Type:', file.type);

  try {
    const buffer = Buffer.from(file.buffer);
    const fileContent = await parseFile(buffer, file.type);
    
    if (!fileContent.trim()) {
        throw new Error('The file appears to be empty or could not be parsed correctly.');
    }

    console.log('Sending parsed content to AI for extraction.');
    const structuredData = await extractFinancialData(fileContent);

    if (!structuredData) {
        throw new Error('AI could not extract valid data from the file.');
    }

    console.log('AI Extracted Data:', structuredData);
    
    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error('Failed to process or extract financial data:', error);
    
    return { success: false, error: error.message || 'An error occurred while processing the file with AI.' };
  }
}
