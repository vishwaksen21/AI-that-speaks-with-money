
import type { FinancialData as FinancialDataType } from '@/ai/flows/data-extraction';

export type FinancialData = FinancialDataType;

export const LOCAL_STORAGE_KEY = 'userFinancialData';

export const defaultFinancialData: FinancialData = {
  user_id: "user_default_123",
  profile: {
    name: "Valued User",
    age: 30,
    employment_status: "Salaried",
    monthly_income: 0,
  },
  assets: {
    bank_accounts: [],
    mutual_funds: [],
    stocks: [],
    real_estate: [],
  },
  liabilities: {
    loans: [],
    credit_cards: [],
  },
  investments: {
    sips: [],
    ppf: 0,
  },
  net_worth: 0,
  credit_score: 750,
};

export function getFinancialData(): FinancialData {
  // This function can only be called on the client-side.
  if (typeof window === 'undefined') {
    return defaultFinancialData;
  }
  
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      // If data exists, parse it and return.
      const parsedData = JSON.parse(storedData);
      return parsedData as FinancialData;
    } else {
      // If no data is in storage, return the default data.
      // The dashboard can decide if it wants to store this default.
      return defaultFinancialData;
    }
  } catch (error) {
    console.error('Failed to parse financial data from localStorage:', error);
    // If parsing fails for any reason, return the default data.
    return defaultFinancialData;
  }
}
