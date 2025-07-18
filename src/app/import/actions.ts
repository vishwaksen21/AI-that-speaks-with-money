
'use server';

import { extractFinancialData, type DataExtractionInput } from '@/ai/flows/data-extraction';
import { parseFile } from '@/services/file-parser';

export async function uploadFinancialData(
  file: { fileContent: string; type: string; name: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  console.log('Received file on the server. Type:', file.type, 'Name:', file.name);

  try {
    let flowInput: DataExtractionInput = {};

    // Data URIs start with "data:"
    if (file.fileContent.startsWith('data:')) {
        // Handle binary files passed as data URIs (e.g., xlsx, images)
        if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const base64Data = file.fileContent.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const textContent = await parseFile(buffer, file.type);
            flowInput.rawData = textContent;
        } else { // Assume it's an image
             flowInput.photoDataUri = file.fileContent;
        }
    } else {
      // Handle plain text files (txt, csv, json)
      const textContent = file.fileContent;
       if (!textContent.trim()) {
            throw new Error('The file appears to be empty or could not be parsed correctly.');
       }
       flowInput.rawData = textContent;
    }

    console.log('Sending content to AI for extraction.');
    const structuredData = await extractFinancialData(flowInput);

    if (!structuredData) {
        throw new Error('AI could not extract valid data from the file. Please check the file content and try again.');
    }

    console.log('AI Extracted Data:', structuredData.profile_name);
    
    return { success: true, data: structuredData };
  } catch (error: any) {
    console.error('Failed to process or extract financial data:', error);
    
    // Provide a more helpful error message
    const errorMessage = error.message || 'An unexpected error occurred.';
    if (errorMessage.includes('ZodError')) {
        return { success: false, error: 'The AI returned data in an unexpected format. Please try again or simplify the document.' };
    }
    return { success: false, error: errorMessage };
  }
}
