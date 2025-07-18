
export const LOCAL_STORAGE_KEY = 'userFinancialData';

export const defaultFinancialData = {
  user_id: 'user_56789',
  profile: {
    name: 'Sneha Rao',
    age: 27,
    employment_status: 'Freelancer',
    monthly_income: 60000,
  },
  assets: {
    bank_accounts: [
      {
        bank: 'Axis Bank',
        balance: 45000,
      },
      {
        bank: 'Kotak Bank',
        balance: 55000,
      },
    ],
    mutual_funds: [
      {
        name: 'Nippon India Small Cap Fund (Equity)',
        current_value: 82000,
      },
      {
        name: 'HDFC Hybrid Equity Fund (Hybrid)',
        current_value: 64000,
      },
    ],
    stocks: [
      {
        ticker: 'Reliance Industries',
        shares: 5,
        current_price: 2950,
      },
      {
        ticker: 'HDFC Bank',
        shares: 15,
        current_price: 1720,
      },
    ],
    real_estate: [
        {
            property_type: 'Digital Gold',
            market_value: 94550,
        }
    ],
  },
  liabilities: {
    loans: [
      {
        type: 'Personal Loan',
        outstanding_amount: 150000,
      },
    ],
    credit_cards: [
      {
        issuer: 'ICICI Bank',
        outstanding_balance: 8500,
      },
    ],
  },
  investments: {
    EPF: { // Using EPF field to store PPF balance for schema consistency
      balance: 120000,
    },
  },
  net_worth: 243000,
  credit_score: 765,
};

export function getFinancialData() {
  // This function now runs exclusively on the client, so `window` is safe to use.
  if (typeof window === 'undefined') {
    return defaultFinancialData;
  }
  
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  
  if (!storedData) {
    // If no data exists, store and return the default.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  }
  
  try {
    // Try to parse the stored data.
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse financial data from localStorage, using default:', error);
    // If parsing fails (e.g., corrupted data), store and return the default.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  }
}
