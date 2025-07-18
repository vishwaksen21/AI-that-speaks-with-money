
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
  if (typeof window === 'undefined') {
    return defaultFinancialData;
  }
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      // THIS IS THE CRITICAL FIX:
      // Always parse the data from localStorage and return the PARSED OBJECT.
      return JSON.parse(storedData);
    }
    // If no data in local storage, set default data and return it
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  } catch (error) {
    console.error('Failed to parse financial data from localStorage, using default:', error);
    // If parsing fails, set default data and return it
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  }
}
