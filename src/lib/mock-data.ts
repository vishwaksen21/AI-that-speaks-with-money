
export const LOCAL_STORAGE_KEY = 'userFinancialData';

export const defaultFinancialData = {
  user_id: 'user_12345',
  profile: {
    name: 'Arjun Mehta',
    age: 30,
    employment_status: 'Salaried',
    monthly_income: 85000,
  },
  assets: {
    bank_accounts: [
      {
        bank: 'HDFC',
        balance: 150000,
      },
      {
        bank: 'SBI',
        balance: 70000,
      },
    ],
    mutual_funds: [
      {
        name: 'Axis Bluechip Fund',
        current_value: 125000,
        type: 'Equity',
      },
      {
        name: 'ICICI Pru Balanced Advantage',
        current_value: 98000,
        type: 'Hybrid',
      },
    ],
    stocks: [
      {
        ticker: 'TCS',
        shares: 10,
        current_price: 3700,
      },
      {
        ticker: 'INFY',
        shares: 20,
        current_price: 1400,
      },
    ],
    real_estate: [
      {
        property_type: 'Apartment',
        market_value: 5500000,
        location: 'Bangalore',
      },
    ],
  },
  liabilities: {
    loans: [
      {
        type: 'Home Loan',
        outstanding_amount: 3000000,
        interest_rate: 8.1,
      },
      {
        type: 'Car Loan',
        outstanding_amount: 400000,
        interest_rate: 9.5,
      },
    ],
    credit_cards: [
      {
        issuer: 'HDFC',
        outstanding_balance: 15000,
        limit: 100000,
      },
    ],
  },
  investments: {
    SIPs: [
      {
        scheme: 'Mirae Asset Emerging Bluechip',
        monthly_investment: 5000,
        returns_percent: 14.2,
      },
      {
        scheme: 'Parag Parikh Flexi Cap',
        monthly_investment: 3000,
        returns_percent: 12.8,
      },
    ],
    EPF: {
      balance: 240000,
      monthly_contribution: 1800,
    },
  },
  credit_score: 782,
  net_worth: 6500000,
};

export function getFinancialData() {
  if (typeof window === 'undefined') {
    return defaultFinancialData;
  }
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    // If no data in local storage, set default data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  } catch (error) {
    console.error('Failed to parse financial data from localStorage', error);
    // If parsing fails, set default data
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
    return defaultFinancialData;
  }
}
