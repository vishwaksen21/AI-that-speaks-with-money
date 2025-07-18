import type { FinancialData } from './mock-data';
import { calculateNetWorth } from './financial-calculations';

const snehaRaoDataWithoutNetWorth = {
    user_id: "user_sneha_rao_1234",
    profile_name: "Sneha Rao",
    profile_age: 27,
    profile_employment_status: "Freelancer",
    profile_monthly_income: 60000,
    profile_currency: "INR",
    bank_accounts: [
        { bank: "Axis Bank", balance: 45000 },
        { bank: "Kotak Bank", balance: 55000 },
    ],
    mutual_funds: [
        { name: "Nippon India Small Cap", current_value: 82000 },
        { name: "HDFC Hybrid Equity", current_value: 64000 },
    ],
    stocks: [
        { ticker: "Reliance Industries", shares: 5, current_price: 2950 },
        { ticker: "HDFC Bank", shares: 15, current_price: 1720 },
    ],
    real_estate: [
        { property_type: "Digital Gold", market_value: 94550 },
    ],
    loans: [
        { type: "Personal Loan", outstanding_amount: 150000 },
    ],
    credit_cards: [
        { issuer: "ICICI Bank", outstanding_balance: 8500 },
    ],
    sips: [
        { name: "UTI Nifty Index Fund", monthly_investment: 4000 },
    ],
    ppf: 120000,
    credit_score: 765,
    transactions: [], // Start with an empty transaction list
};

const netWorth = calculateNetWorth(snehaRaoDataWithoutNetWorth);

export const snehaRaoFinancialData: FinancialData = {
    ...snehaRaoDataWithoutNetWorth,
    net_worth: netWorth,
};
