
import * as XLSX from 'xlsx';

export class FileParserService {
  /**
   * Parses the content of a file buffer based on its MIME type.
   * @param buffer The file content as a Buffer.
   * @param mimeType The MIME type of the file.
   * @returns A string representation of the file content.
   */
  static async parse(buffer: Buffer, mimeType: string): Promise<string> {
    switch (mimeType) {
      case 'text/plain':
      case 'text/csv':
      case 'application/json':
        // For text-based files, just convert the buffer to a UTF-8 string.
        return buffer.toString('utf-8');

      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': // XLSX
        return this.parseXlsx(buffer);
      
      // Note: PDF and image OCR would require more complex, potentially external, services
      // and are not implemented here.

      default:
        // Fallback for unknown but potentially text-readable types
        if (mimeType.startsWith('text/')) {
            return buffer.toString('utf-8');
        }
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  }

  /**
   * Parses an XLSX file buffer and converts it to a CSV-like string.
   * @param buffer The XLSX file content as a Buffer.
   * @returns A string representation of the XLSX content.
   */
  private static parseXlsx(buffer: Buffer): string {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let fullTextContent = '';

    // Iterate over each sheet in the workbook
    workbook.SheetNames.forEach(sheetName => {
      fullTextContent += `Sheet: ${sheetName}\n\n`;
      const worksheet = workbook.Sheets[sheetName];
      // Convert sheet to a CSV-like string format
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      fullTextContent += csvData + '\n\n';
    });
    
    return fullTextContent;
  }
}
