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
      },
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
    sips: [
      {
        name: 'UTI Nifty Index Fund',
        monthly_investment: 4000,
      },
    ],
    ppf: {
      balance: 120000,
    },
  },
  net_worth: 337850,
  credit_score: 765,
};

export function getFinancialData() {
  if (typeof window === 'undefined') {
    return defaultFinancialData;
  }

  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      // If data exists, parse and return it.
      return JSON.parse(storedData);
    } else {
      // If no data, store the default and return it.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
      return defaultFinancialData;
    }
  } catch (error) {
    console.error('Failed to process financial data, using default:', error);
    // If parsing fails, store the default and return it.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  }
}
