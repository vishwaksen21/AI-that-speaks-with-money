
// src/ai/flows/data-extraction.ts
'use server';
/**
 * @fileOverview An AI flow to extract structured financial data from raw text or images.
 *
 * - extractFinancialData - A function that takes raw text or an image and returns structured financial data.
 * - DataExtractionInput - The Zod schema for the input to the extraction flow.
 * - FinancialData - The Zod schema defining the structure of the financial data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DataExtractionInputSchema = z.object({
  rawData: z.string().optional().describe('The raw text data from a file (e.g., txt, csv).'),
  photoDataUri: z.string().optional().describe("A photo of a financial document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
}).refine(data => !!data.rawData || !!data.photoDataUri, {
    message: "Either rawData or photoDataUri must be provided.",
}).describe('Input for the financial data extraction flow. Only one of rawData or photoDataUri should be used.');

export type DataExtractionInput = z.infer<typeof DataExtractionInputSchema>;


// This schema defines the target JSON structure. It is flatter to be more reliable for AI generation.
const FinancialDataSchema = z.object({
  user_id: z.string().describe('A unique identifier for the user, e.g., user_12345.'),
  profile_name: z.string().describe("The user's full name."),
  profile_age: z.number().describe("The user's age."),
  profile_employment_status: z.string().describe("The user's employment status (e.g., Salaried, Self-employed, Freelancer)."),
  profile_monthly_income: z.number().describe("The user's monthly income in the profile's currency."),
  profile_currency: z.string().describe("The ISO 4217 currency code for all monetary values in this profile (e.g., 'INR', 'USD', 'EUR')."),
  bank_accounts: z.array(z.object({
    bank: z.string().describe("Name of the bank."),
    balance: z.number().describe("Account balance in the profile's currency."),
  })).describe("List of user's bank accounts."),
  mutual_funds: z.array(z.object({
      name: z.string().describe("Name of the mutual fund."),
      current_value: z.number().describe("Current market value of the holding in the profile's currency."),
  })).describe("List of user's mutual fund investments."),
  stocks: z.array(z.object({
      ticker: z.string().describe("The stock ticker symbol or company name (e.g., TCS, Reliance Industries)."),
      shares: z.number().describe("Number of shares held."),
      current_price: z.number().describe("Current price per share in the profile's currency."),
  })).describe("List of user's stock holdings."),
  real_estate: z.array(z.object({
      property_type: z.string().describe("Type of property (e.g., Apartment, Land, Digital Gold)."),
      market_value: z.number().describe("Current market value of the property in the profile's currency."),
  })).describe("List of user's real estate assets."),
  loans: z.array(z.object({
    type: z.string().describe("Type of loan (e.g., Home Loan, Car Loan, Personal Loan)."),
    outstanding_amount: z.number().describe("The remaining amount to be paid in the profile's currency."),
  })).describe("List of user's outstanding loans."),
  credit_cards: z.array(z.object({
    issuer: z.string().describe("The bank or institution that issued the credit card."),
    outstanding_balance: z.number().describe("The current outstanding balance on the card in the profile's currency."),
  })).describe("List of user's credit card balances."),
  sips: z.array(z.object({
      name: z.string().describe("Name of the SIP fund."),
      monthly_investment: z.number().describe("Monthly investment amount in the profile's currency."),
  })).describe("Systematic Investment Plans. This should not be optional."),
  ppf: z.number().describe("The current balance in the Public Provident Fund in the profile's currency."),
  net_worth: z.number().describe("The calculated net worth (Total Assets - Total Liabilities) in the profile's currency. If provided in the text, use that value. Otherwise, you must calculate it."),
  credit_score: z.number().optional().describe("The user's credit score (e.g., CIBIL score)."),
  transactions: z.array(z.object({
    id: z.string(),
    description: z.string(),
    amount: z.number(),
    date: z.string(),
    category: z.string(),
  })).optional().describe("List of recent transactions. The AI should not populate this; it is for application use."),
}).describe('A structured representation of a user\'s financial data.');


export type FinancialData = z.infer<typeof FinancialDataSchema>;

export async function extractFinancialData(input: DataExtractionInput): Promise<FinancialData> {
  return dataExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dataExtractionPrompt',
  input: {schema: DataExtractionInputSchema},
  output: {schema: FinancialDataSchema},
  prompt: `You are an expert financial data analyst. Your task is to analyze the following financial information, which can be from raw text or an image, and structure it into a valid JSON object matching the provided schema.

CRITICAL INSTRUCTIONS:
1.  **Analyze the Input**: Analyze the provided input. It will be either an image (requiring OCR) or raw text, but not both. Use your OCR capabilities for scanned images and table recognition for structured data.
    {{#if photoDataUri}}
    Image of Financial Document: {{media url=photoDataUri}}
    {{/if}}
    {{#if rawData}}
    Raw Text Data:
    ---
    {{{rawData}}}
    ---
    {{/if}}
2.  **Output Format**: Your entire output must be ONLY the JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.
3.  **Data Source**: Use ONLY the information provided in the input. Do NOT invent or hallucinate any data.
4.  **Currency**: Identify the currency from the text (e.g., symbols like $, €, ₹, or words like "dollars", "rupees"). Use the appropriate ISO 4217 code (e.g., 'USD', 'EUR', 'INR'). If no currency is mentioned, default to 'INR'. Store this in 'profile_currency'. All monetary values in the JSON must be numbers, without commas or currency symbols.
5.  **Net Worth Calculation**: If 'net_worth' is explicitly provided, use that value. Otherwise, you MUST calculate it by summing all assets (bank accounts, mutual funds, stocks (shares * price), real estate, PPF) and subtracting all liabilities (loans, credit cards).
6.  **Specific Mappings**:
    *   Treat "Digital Gold" as a 'real_estate' asset.
    *   Map any provident fund balance (EPF, PF) to the 'ppf' field.
7.  **Defaults for Missing Data**:
    *   If any financial list (e.g., stocks, loans) is not mentioned, return an empty array \`[]\`.
    *   If \`ppf\` or \`credit_score\` is not mentioned, use \`0\`.
    *   If \`profile_name\` is missing, use "Valued User".
    *   If \`profile_age\` is missing, use \`30\`.
    *   If \`profile_employment_status\` is missing, use \`"N/A"\`.
8.  **User ID**: Generate a random user_id, for example 'user_12345'.
9.  **Transactions Field**: The 'transactions' field is for application use only. Do NOT populate it. Return an empty array \`[]\` for this field.

Begin your analysis now.
`,
});


const dataExtractionFlow = ai.defineFlow(
  {
    name: 'dataExtractionFlow',
    inputSchema: DataExtractionInputSchema,
    outputSchema: FinancialDataSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 3;
    const delay = 1000;

    while (attempts < maxAttempts) {
        try {
            console.log(`Attempt ${attempts + 1} of ${maxAttempts}...`);
            const response = await prompt(input);
            const output = response.output;

            if (!output) {
                throw new Error("AI model did not return a valid output object.");
            }
            
            console.log("Received structured data from AI:", JSON.stringify(output, null, 2));
            return output;

        } catch (error: any) {
            attempts++;
            const isLastAttempt = attempts >= maxAttempts;
            const errorMessage = error?.message || "Unknown error occurred";

            console.error(`Attempt ${attempts} failed:`, errorMessage);

            // Specific diagnostic suggestions
            if (/format|unsupported|invalid/i.test(errorMessage)) {
                console.warn("Hint: The file might be in an unrecognized or unsupported format. Try converting it to PDF or plain text.");
            } else if (/temporarily unavailable|timeout|503|network/i.test(errorMessage)) {
                console.warn("Hint: The AI service may be temporarily unavailable. Please check your internet connection or retry later.");
            }

            if (isLastAttempt) {
                console.error("Max retry attempts reached. Aborting document processing.");

                throw new Error(
                    "The AI model failed to process the document after multiple attempts. " +
                    "Possible reasons:\n" +
                    "• The file might be in an unrecognized or corrupted format (try converting it to PDF or .txt).\n" +
                    "• The AI service might be temporarily unavailable (retry after some time).\n" +
                    "Please verify your file and try again."
                );
            }

            // Retry with exponential backoff
            const retryDelay = delay * Math.pow(2, attempts - 1);
            console.log(`Waiting ${retryDelay}ms before retrying...`);
            await new Promise(res => setTimeout(res, retryDelay));
        }
    }
    throw new Error("The AI model returned no output after all retry attempts.");
  }
);

    