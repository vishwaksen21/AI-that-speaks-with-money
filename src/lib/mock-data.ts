
import type { FinancialData as FinancialDataType } from '@/ai/flows/data-extraction';

export type FinancialData = FinancialDataType;

export const LOCAL_STORAGE_KEY = 'userFinancialData';

export const defaultFinancialData: FinancialData = {
  user_id: "user_default_123",
  profile_name: "Valued User",
  profile_age: 30,
  profile_employment_status: "N/A",
  profile_monthly_income: 0,
  profile_currency: "INR",
  bank_accounts: [],
  mutual_funds: [],
  stocks: [],
  real_estate: [],
  loans: [],
  credit_cards: [],
  sips: [],
  ppf: 0,
  net_worth: 0,
  credit_score: 0,
  transactions: [],
};


// Helper function for deep merging objects.
const isObject = (item: any): item is Record<string, any> => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key]) && key in target && isObject(target[key])) {
        output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};


export function getFinancialData(): FinancialData {
  // This function can only be called on the client-side.
  if (typeof window === 'undefined') {
    return defaultFinancialData;
  }
  
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Deep merge the parsed data with the default structure.
      // This ensures that if the stored data is incomplete, it will be
      // safely populated with default values for missing fields/objects.
      return mergeDeep(defaultFinancialData, parsedData);
    } else {
      // If no data is in storage, return the default data.
      return defaultFinancialData;
    }
  } catch (error) {
    console.error('Failed to parse financial data from localStorage:', error);
    // If parsing fails for any reason, return the default data.
    return defaultFinancialData;
  }
}
