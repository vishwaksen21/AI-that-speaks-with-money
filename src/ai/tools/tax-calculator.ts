// src/ai/tools/tax-calculator.ts
'use server';
/**
 * @fileOverview A Genkit tool for calculating estimated income tax.
 *
 * - taxCalculatorTool - The Genkit tool definition.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Simplified tax brackets for demonstration purposes.
// In a real application, these would be fetched from a reliable source or be more complex.
const TAX_BRACKETS = {
    'INR': [
        { limit: 300000, rate: 0.05 },
        { limit: 600000, rate: 0.10 },
        { limit: 900000, rate: 0.15 },
        { limit: 1200000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
    ],
    'USD': [
        { limit: 11000, rate: 0.10 },
        { limit: 44725, rate: 0.12 },
        { limit: 95375, rate: 0.22 },
        { limit: 182100, rate: 0.24 },
        { limit: 231250, rate: 0.32 },
        { limit: 578125, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
    ]
};

export const taxCalculatorTool = ai.defineTool(
  {
    name: 'taxCalculatorTool',
    description: 'Calculates an estimated income tax based on annual income, deductions, and currency. Use this tool whenever a user asks about their tax liability or how to optimize their taxes.',
    inputSchema: z.object({
      annualIncome: z.number().describe('The total annual income before any deductions.'),
      totalDeductions: z.number().describe('The total amount of tax-deductible expenses and investments.'),
      currency: z.enum(['INR', 'USD']).describe("The currency for the calculation, either 'INR' or 'USD'."),
    }),
    outputSchema: z.object({
        taxableIncome: z.number(),
        estimatedTax: z.number(),
        effectiveTaxRate: z.number(),
    }),
  },
  async (input) => {
    const { annualIncome, totalDeductions, currency } = input;
    const taxableIncome = Math.max(0, annualIncome - totalDeductions);
    
    const brackets = TAX_BRACKETS[currency];
    if (!brackets) {
        throw new Error(`Unsupported currency for tax calculation: ${currency}`);
    }

    let estimatedTax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;
        
        const taxableInBracket = Math.min(remainingIncome, bracket.limit - previousLimit);
        estimatedTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
        previousLimit = bracket.limit;
    }

    const effectiveTaxRate = annualIncome > 0 ? (estimatedTax / annualIncome) * 100 : 0;

    return {
        taxableIncome,
        estimatedTax: Math.round(estimatedTax),
        effectiveTaxRate: parseFloat(effectiveTaxRate.toFixed(2)),
    };
  }
);
