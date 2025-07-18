// src/ai/flows/data-extraction.ts
'use server';
/**
 * @fileOverview An AI flow to extract structured financial data from raw text.
 *
 * - extractFinancialData - A function that takes a raw string and returns structured financial data.
 * - FinancialDataSchema - The Zod schema defining the structure of the financial data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// This schema defines the target JSON structure. It should be kept in sync with the application's needs.
const FinancialDataSchema = z.object({
  user_id: z.string().describe('A unique identifier for the user, e.g., user_12345.'),
  profile: z.object({
    name: z.string().describe("The user's full name."),
    age: z.number().describe("The user's age."),
    employment_status: z.string().describe("The user's employment status (e.g., Salaried, Self-employed)."),
    monthly_income: z.number().describe("The user's monthly income in Indian Rupees (₹)."),
  }),
  assets: z.object({
    bank_accounts: z.array(z.object({
      bank: z.string().describe("Name of the bank."),
      balance: z.number().describe("Account balance in Indian Rupees (₹)."),
    })).describe("List of user's bank accounts."),
    mutual_funds: z.array(z.object({
        name: z.string().describe("Name of the mutual fund."),
        current_value: z.number().describe("Current market value of the holding in Indian Rupees (₹)."),
    })).describe("List of user's mutual fund investments."),
    stocks: z.array(z.object({
        ticker: z.string().describe("The stock ticker symbol (e.g., TCS, INFY)."),
        shares: z.number().describe("Number of shares held."),
        current_price: z.number().describe("Current price per share in Indian Rupees (₹)."),
    })).describe("List of user's stock holdings."),
    real_estate: z.array(z.object({
        property_type: z.string().describe("Type of property (e.g., Apartment, Land)."),
        market_value: z.number().describe("Current market value of the property in Indian Rupees (₹)."),
    })).describe("List of user's real estate assets."),
  }),
  liabilities: z.object({
    loans: z.array(z.object({
      type: z.string().describe("Type of loan (e.g., Home Loan, Car Loan)."),
      outstanding_amount: z.number().describe("The remaining amount to be paid in Indian Rupees (₹)."),
    })).describe("List of user's outstanding loans."),
    credit_cards: z.array(z.object({
      issuer: z.string().describe("The bank or institution that issued the credit card."),
      outstanding_balance: z.number().describe("The current outstanding balance on the card in Indian Rupees (₹)."),
    })).describe("List of user's credit card balances."),
  }),
  investments: z.object({
      EPF: z.object({
          balance: z.number().describe("The current balance in the Employee Provident Fund in Indian Rupees (₹).")
      }).describe("Employee Provident Fund details.")
  }),
  net_worth: z.number().describe("The calculated net worth (Total Assets - Total Liabilities) in Indian Rupees (₹). If not provided, calculate it."),
  credit_score: z.number().optional().describe("The user's credit score (e.g., CIBIL score).")
}).describe('A structured representation of a user\'s financial data.');

export type FinancialData = z.infer<typeof FinancialDataSchema>;

export async function extractFinancialData(rawData: string): Promise<FinancialData> {
  return dataExtractionFlow(rawData);
}

const prompt = ai.definePrompt({
  name: 'dataExtractionPrompt',
  input: {schema: z.string()},
  output: {schema: FinancialDataSchema},
  prompt: `You are an expert financial data analyst. Your task is to analyze the following raw text, which contains a user's financial information. The text could be in any format (JSON, CSV, unstructured sentences, etc.).

Your goal is to extract all relevant financial details and structure them into a valid JSON object according to the provided schema.

- All monetary values should be in Indian Rupees (₹). If a currency symbol is not present, assume INR.
- Carefully identify all assets (bank accounts, stocks, mutual funds, real estate, EPF) and liabilities (loans, credit cards).
- If the user's name is not explicitly provided, use a placeholder like "Valued User".
- If age is not provided, use a reasonable default like 30.
- If net worth is not explicitly mentioned, you MUST calculate it by summing all assets and subtracting all liabilities. Total assets include bank balances, mutual funds, stocks (shares * price), real estate, and EPF balance. Total liabilities include all loans and credit card balances.
- Fill in every field of the schema as accurately as possible based on the input text. If a particular piece of information (e.g., credit score) is missing, you can omit it if the schema allows, otherwise provide a sensible default (e.g., 0 for a balance, an empty array [] for lists).
- Generate a user_id, for example 'user_12345'.
- It is critical that your output is a single, valid JSON object that strictly adheres to the schema. Do not include any text or explanations outside of the JSON object.

Raw Data Input:
\`\`\`
{{{input}}}
\`\`\`

Now, provide the structured JSON output.`,
});

const dataExtractionFlow = ai.defineFlow(
  {
    name: 'dataExtractionFlow',
    inputSchema: z.string(),
    outputSchema: FinancialDataSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model could not extract data. The file might be empty or in an unrecognizable format.");
    }
    return output;
  }
);
