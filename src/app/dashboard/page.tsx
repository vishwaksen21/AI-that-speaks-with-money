
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentTransactions } from '@/components/recent-transactions';
import { NetWorthChart } from '@/components/net-worth-chart';
import { AssetAllocationChart } from '@/components/asset-allocation-chart';
import { getFinancialData } from '@/lib/mock-data';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(amount: number) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹--';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper function to calculate total assets
const calculateTotalAssets = (data: any) => {
    if (!data?.assets) return 0;
    const bankBalance = data.assets.bank_accounts?.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0) || 0;
    const mutualFunds = data.assets.mutual_funds?.reduce((sum: number, mf: any) => sum + (mf.current_value || 0), 0) || 0;
    const stocks = data.assets.stocks?.reduce((sum: number, stock: any) => sum + ((stock.shares || 0) * (stock.current_price || 0)), 0) || 0;
    const realEstate = data.assets.real_estate?.reduce((sum: number, prop: any) => sum + (prop.market_value || 0), 0) || 0;
    const epf = data.investments?.EPF?.balance || 0;
    return bankBalance + mutualFunds + stocks + realEstate + epf;
};

// Helper function to calculate total liabilities
const calculateTotalLiabilities = (data: any) => {
    if (!data?.liabilities) return 0;
    const loans = data.liabilities.loans?.reduce((sum: number, loan: any) => sum + (loan.outstanding_amount || 0), 0) || 0;
    const creditCards = data.liabilities.credit_cards?.reduce((sum: number, card: any) => sum + (card.outstanding_balance || 0), 0) || 0;
    return loans + creditCards;
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Directly fetch and set data on the client side.
    // This ensures we always get the latest from localStorage.
    const financialData = getFinancialData();
    setData(financialData);
  }, []);

  if (!data) {
    return (
        <AppLayout pageTitle="Dashboard">
             <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-1" /></CardContent></Card>
                    <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-1" /></CardContent></Card>
                    <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-1" /></CardContent></Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4"><CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader><CardContent className="pt-2 pl-2"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
                    <Card className="lg:col-span-3"><CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-56 mt-2" /></CardHeader><CardContent className="pt-2"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
                </div>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
                    <CardContent><Skeleton className="h-[200px] w-full" /></CardContent>
                </Card>
             </div>
        </AppLayout>
    )
  }

  const totalAssets = calculateTotalAssets(data);
  const totalLiabilities = calculateTotalLiabilities(data);
  const netWorth = data?.net_worth || (totalAssets - totalLiabilities);

  const assetAllocationData = [];
  if (data?.assets?.bank_accounts) {
    assetAllocationData.push({ name: 'Bank Accounts', value: data.assets.bank_accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0) });
  }
  if (data?.assets?.mutual_funds) {
    assetAllocationData.push({ name: 'Mutual Funds', value: data.assets.mutual_funds.reduce((sum: number, mf: any) => sum + mf.current_value, 0) });
  }
  if (data?.assets?.stocks) {
    assetAllocationData.push({ name: 'Stocks', value: data.assets.stocks.reduce((sum: number, stock: any) => sum + (stock.shares * stock.current_price), 0) });
  }
  if (data?.assets?.real_estate) {
      assetAllocationData.push({ name: 'Real Estate', value: data.assets.real_estate.reduce((sum: number, prop: any) => sum + prop.market_value, 0) });
  }
  if (data?.investments?.EPF) {
      assetAllocationData.push({ name: 'EPF', value: data.investments.EPF.balance });
  }
  

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Assets</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
               <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Liabilities</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
               <p className="text-xs text-muted-foreground">-1.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="font-headline">Net Worth Overview</CardTitle>
               <CardDescription>Your net worth trend over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <NetWorthChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-headline">Asset Allocation</CardTitle>
              <CardDescription>Your current investment distribution.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetAllocationChart data={assetAllocationData} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
         <Card>
            <CardHeader>
              <CardTitle className="font-headline">Recent Transactions</CardTitle>
              <CardDescription>Your most recent financial activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
      </div>
    </AppLayout>
  );
}
