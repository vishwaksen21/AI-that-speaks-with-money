
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
    employment_status: z.string().describe("The user's employment status (e.g., Salaried, Self-employed, Freelancer)."),
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
        ticker: z.string().describe("The stock ticker symbol or company name (e.g., TCS, Reliance Industries)."),
        shares: z.number().describe("Number of shares held."),
        current_price: z.number().describe("Current price per share in Indian Rupees (₹)."),
    })).describe("List of user's stock holdings."),
    real_estate: z.array(z.object({
        property_type: z.string().describe("Type of property (e.g., Apartment, Land, Digital Gold)."),
        market_value: z.number().describe("Current market value of the property in Indian Rupees (₹)."),
    })).describe("List of user's real estate assets."),
  }),
  liabilities: z.object({
    loans: z.array(z.object({
      type: z.string().describe("Type of loan (e.g., Home Loan, Car Loan, Personal Loan)."),
      outstanding_amount: z.number().describe("The remaining amount to be paid in Indian Rupees (₹)."),
    })).describe("List of user's outstanding loans."),
    credit_cards: z.array(z.object({
      issuer: z.string().describe("The bank or institution that issued the credit card."),
      outstanding_balance: z.number().describe("The current outstanding balance on the card in Indian Rupees (₹)."),
    })).describe("List of user's credit card balances."),
  }),
  investments: z.object({
      sips: z.array(z.object({
          name: z.string().describe("Name of the SIP fund."),
          monthly_investment: z.number().describe("Monthly investment amount in Indian Rupees (₹)."),
      })).describe("Systematic Investment Plans. This should not be optional."),
      ppf: z.number().describe("The current balance in the Public Provident Fund in Indian Rupees (₹).")
  }),
  net_worth: z.number().describe("The calculated net worth (Total Assets - Total Liabilities) in Indian Rupees (₹). If provided in the text, use that value. Otherwise, you must calculate it."),
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
  prompt: `You are an expert financial data analyst. Your task is to analyze the following raw text, which contains a user's financial information. The text could be in any format (JSON, CSV, unstructured sentences, bullet points, etc.).

Your goal is to extract all relevant financial details and structure them into a valid JSON object according to the provided schema.

**CRITICAL INSTRUCTIONS:**
- All monetary values must be in Indian Rupees (₹). If a currency symbol is not present, assume INR. Remove commas and currency symbols from all numbers before outputting them.
- **Net Worth:** If net worth is explicitly provided in the text, use that exact value. Otherwise, you MUST calculate it by summing all assets and subtracting all liabilities. Total assets include bank balances, mutual funds, stocks (shares * price), real estate, and PPF balance.
- **Stocks:** For each stock, you must have 'ticker', 'shares', and 'current_price'. The total value is not needed in the output, just the price per share.
- **Digital Gold:** Treat "Digital Gold" as a type of real estate asset. Use its total value for market_value.
- **PPF/EPF:** The schema uses a 'ppf' field which is a direct number. If you see "EPF", "Provident Fund", or "PPF", map its balance to the 'ppf' number field.
- **SIPs:** Extract Systematic Investment Plan details into the 'sips' array under 'investments'.
- **Defaults:** You must fill in every field of the schema as accurately as possible. If a piece of information is missing (e.g., credit score), you can omit it if the schema allows. For other missing fields, you MUST provide a sensible default (e.g., 0 for a balance, an empty array [] for lists, "Valued User" for a name, 30 for age). Do not leave any required fields out.
- **User ID:** Generate a random user_id, for example 'user_12345'.
- **Output Format:** It is absolutely critical that your output is a single, valid JSON object that strictly adheres to the schema. Do not include any text, explanations, or markdown formatting outside of the JSON object itself.

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
