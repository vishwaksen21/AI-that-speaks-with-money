export const userFinancialData = {
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

export const financialDataString = JSON.stringify(userFinancialData, null, 2);
