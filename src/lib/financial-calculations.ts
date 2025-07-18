
import type { FinancialData } from '@/ai/flows/data-extraction';

type FinancialDataSource = Omit<FinancialData, 'net_worth'>;

export const calculateTotalAssets = (data: FinancialDataSource): number => {
    if (!data) return 0;
    const bankBalance = data.bank_accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;
    const mutualFunds = data.mutual_funds?.reduce((sum, mf) => sum + (mf.current_value || 0), 0) || 0;
    const stocks = data.stocks?.reduce((sum, stock) => sum + ((stock.shares || 0) * (stock.current_price || 0)), 0) || 0;
    const realEstate = data.real_estate?.reduce((sum, prop) => sum + (prop.market_value || 0), 0) || 0;
    const ppf = data.ppf || 0;
    return bankBalance + mutualFunds + stocks + realEstate + ppf;
};

export const calculateTotalLiabilities = (data: FinancialDataSource): number => {
    if (!data) return 0;
    const loans = data.loans?.reduce((sum, loan) => sum + (loan.outstanding_amount || 0), 0) || 0;
    const creditCards = data.credit_cards?.reduce((sum, card) => sum + (card.outstanding_balance || 0), 0) || 0;
    return loans + creditCards;
};

export const calculateNetWorth = (data: FinancialDataSource): number => {
    if (!data) return 0;
    return calculateTotalAssets(data) - calculateTotalLiabilities(data);
}
