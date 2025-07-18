
'use server';

import { extractFinancialData, type DataExtractionInput } from '@/ai/flows/data-extraction';
import { parseFile } from '@/services/file-parser';

export async function uploadFinancialData(
  file: { fileContent: number[] | string; type: string, isImage: boolean }
): Promise<{ success: boolean; data?: any; error?: string }> {
  console.log('Received file on the server. Type:', file.type, 'Is image:', file.isImage);

  try {
    let flowInput: DataExtractionInput = {};

    if (file.isImage) {
        if (typeof file.fileContent !== 'string') {
            throw new Error('Image file content must be a data URI string.');
        }
        flowInput.photoDataUri = file.fileContent;
    } else {
        if (!Array.isArray(file.fileContent)) {
            throw new Error('Text file content must be an array buffer.');
        }
        const buffer = Buffer.from(file.fileContent);
        const textContent = await parseFile(buffer, file.type);
        
        if (!textContent.trim()) {
            throw new Error('The file appears to be empty or could not be parsed correctly.');
        }
        flowInput.rawData = textContent;
    }

    console.log('Sending parsed content to AI for extraction.');
    const structuredData = await extractFinancialData(flowInput);

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

