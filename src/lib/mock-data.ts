
export const LOCAL_STORAGE_KEY = 'userFinancialData';

export const defaultFinancialData = {
  assets: {
    cashAndInvestments: {
      total: 650000,
      breakdown: [
        { type: 'Checking Account', amount: 150000 },
        { type: 'Savings Account', amount: 250000 },
        { type: 'Mutual Funds', amount: 200000 },
        { type: 'Stocks', amount: 50000 },
      ],
    },
    property: {
      total: 0,
    },
    other: {
      total: 100000,
      breakdown: [{ type: 'EPF', amount: 100000 }],
    },
    totalAssets: 750000,
  },
  liabilities: {
    loans: {
      total: 50000,
      breakdown: [{ type: 'Personal Loan', amount: 50000 }],
    },
    creditCardDebt: {
      total: 25000,
    },
    totalLiabilities: 75000,
  },
  netWorth: 675000,
  creditScore: 750,
  monthlyIncome: 80000,
  monthlyExpenses: 45000,
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
        console.error("Failed to parse financial data from localStorage", error);
        // If parsing fails, set default data
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultFinancialData));
        return defaultFinancialData;
    }
}
