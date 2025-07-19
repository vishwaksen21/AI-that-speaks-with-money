import type { FinancialData as FinancialDataType } from '@/ai/flows/data-extraction';
import { calculateNetWorth } from './financial-calculations';
import { snehaRaoFinancialData } from './sneha-rao-data';

export type FinancialData = FinancialDataType;

export const LOCAL_STORAGE_KEY = 'userFinancialData';

const sampleFinancialDataWithoutNetWorth = {
  user_id: "user_sample_9876",
  profile_name: "Alex Johnson",
  profile_age: 34,
  profile_employment_status: "Salaried",
  profile_monthly_income: 150000,
  profile_currency: "INR",
  bank_accounts: [
    { bank: "HDFC Bank", balance: 550000 },
    { bank: "ICICI Bank", balance: 275000 },
  ],
  mutual_funds: [
      { name: "Parag Parikh Flexi Cap", current_value: 320000 },
      { name: "Navi Nifty 50 Index", current_value: 150000 },
  ],
  stocks: [
      { ticker: "TCS", shares: 50, current_price: 3800 },
      { ticker: "RELIANCE", shares: 25, current_price: 2900 },
  ],
  real_estate: [
      { property_type: "Digital Gold", market_value: 75000 },
  ],
  loans: [
    { type: "Car Loan", outstanding_amount: 450000 },
  ],
  credit_cards: [
    { issuer: "HDFC Millennia", outstanding_balance: 35000 },
    { issuer: "Amazon ICICI", outstanding_balance: 15000 },
  ],
  sips: [
      { name: "Parag Parikh Flexi Cap", monthly_investment: 15000 },
      { name: "Navi Nifty 50 Index", monthly_investment: 10000 },
  ],
  ppf: 450000,
  credit_score: 780,
  transactions: [
    { id: 'txn_1', description: 'Salary Credit', amount: 150000, date: '2024-06-01', category: 'Income' },
    { id: 'txn_2', description: 'Rent Payment', amount: -30000, date: '2024-06-02', category: 'Housing' },
    { id: 'txn_3', description: 'Groceries', amount: -7500, date: '2024-06-05', category: 'Food' },
    { id: 'txn_4', description: 'Weekend Trip', amount: -12000, date: '2024-06-08', category: 'Travel' },
    { id: 'txn_5', description: 'Stock Purchase - RELIANCE', amount: -29000, date: '2024-06-10', category: 'Investment' },
  ],
};

const sampleNetWorth = calculateNetWorth(sampleFinancialDataWithoutNetWorth);
export const sampleFinancialData: FinancialData = {
    ...sampleFinancialDataWithoutNetWorth,
    net_worth: sampleNetWorth,
};


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
    // During server-side rendering or build, return the primary sample data.
    return sampleFinancialData;
  }
  
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData) as FinancialData;
      // Use a more reliable check to see if the stored data is valid.
      // If it's empty or still the default placeholder, return the primary sample data.
      if (!parsedData || !parsedData.user_id || parsedData.user_id === "user_default_123") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sampleFinancialData));
        return sampleFinancialData;
      }
       // If the user has "imported" Sneha's data, use that.
      if (parsedData.user_id === snehaRaoFinancialData.user_id) {
          return mergeDeep(defaultFinancialData, snehaRaoFinancialData);
      }
      // Otherwise, return the parsed data from storage (which might be Alex Johnson's profile).
      return mergeDeep(defaultFinancialData, parsedData);
    } else {
      // If no data is in storage, initialize it with the primary sample data.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sampleFinancialData));
      return sampleFinancialData;
    }
  } catch (error) {
    console.error('Failed to parse financial data from localStorage:', error);
    // If parsing fails, fallback to the primary sample data.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sampleFinancialData));
    return sampleFinancialData;
  }
}
