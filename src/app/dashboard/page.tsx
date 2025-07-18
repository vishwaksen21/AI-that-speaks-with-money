
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

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    // It safely retrieves data from localStorage or falls back to defaults.
    setData(getFinancialData());
  }, []);

  // Show a loading skeleton if data hasn't been loaded from the client yet.
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

  const assetAllocationData = data?.assets?.cashAndInvestments?.breakdown?.map((item: any) => ({ name: item.type, value: item.amount })) || [];

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
              <div className="text-2xl font-bold">{formatCurrency(data.netWorth)}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Assets</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.assets?.totalAssets)}</div>
               <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Liabilities</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(data.liabilities?.totalLiabilities)}</div>
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
