
'use client';

import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
    return (
      <AppLayout pageTitle="Dashboard">
         <Card className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[400px]">
            <CardTitle className="font-headline text-2xl mb-2">Welcome to FinanceAI Navigator!</CardTitle>
            <CardDescription className="max-w-md mb-6">
                Your application is now running. Let's get started by importing your financial data.
            </CardDescription>
            <Link href="/import">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Import Your Data
                </Button>
            </Link>
        </Card>
      </AppLayout>
    )
}

// The original dashboard content is preserved below, but is not currently used.
// This was done to stabilize the application. It can be re-integrated later.
/*
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentTransactions } from '@/components/recent-transactions';
import type { FinancialData } from '@/ai/flows/data-extraction';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, User, Briefcase, IndianRupee, Upload, Target, ShieldCheck, Wand2, Loader2 } from 'lucide-react';
import { CreditScore as CreditScoreIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculateTotalAssets, calculateTotalLiabilities } from '@/lib/financial-calculations';
import { useFinancialData } from '@/context/financial-data-context';
import { getFinancialHealthScore } from './actions';
import ReactMarkdown from 'react-markdown';
import { OnboardingTour } from '@/components/onboarding-tour';

const ChartSkeleton = () => (
    <div className="pl-2 pt-2">
        <Skeleton className="h-[300px] w-full" />
    </div>
);

const NetWorthChart = dynamic(() => import('@/components/net-worth-chart').then(mod => mod.NetWorthChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const AssetAllocationChart = dynamic(() => import('@/components/asset-allocation-chart').then(mod => mod.AssetAllocationChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

function formatCurrency(amount: number, currency: string = 'INR') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(0).replace(/0/g, '--');
    } catch (e) {
        return '$--';
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-1" /></CardContent></Card>
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
    );
}

function EmptyState() {
    return (
        <Card id="dashboard-empty-state" className="flex flex-col items-center justify-center text-center p-8 md:p-12 min-h-[400px]">
            <Upload className="h-16 w-16 text-primary mb-4" />
            <CardTitle className="font-headline text-2xl mb-2">Welcome to Your Dashboard!</CardTitle>
            <CardDescription className="max-w-md mb-6">
                It looks like you haven't imported any financial data yet. Get started by uploading a file. Our AI will analyze it and bring your dashboard to life.
            </CardDescription>
            <Link href="/import">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Import Your Data
                </Button>
            </Link>
        </Card>
    );
}

// Exported for use in other pages
export function DashboardPageContent() {
  const { financialData, setFinancialData, isLoading } = useFinancialData();

  const handleAddTransaction = (newTransaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }) => {
    if (!financialData) return;

    const optimisticData = JSON.parse(JSON.stringify(financialData));

    const transactionAmount = newTransaction.type === 'income' 
        ? newTransaction.amount 
        : -newTransaction.amount;
    
    if (!optimisticData.transactions) {
        optimisticData.transactions = [];
    }
    optimisticData.transactions.unshift({
        id: `txn_${Date.now()}`,
        description: newTransaction.description,
        amount: transactionAmount,
        date: new Date().toISOString().split('T')[0],
        category: newTransaction.type === 'income' ? 'Income' : 'Expense',
    });

    if (optimisticData.bank_accounts && optimisticData.bank_accounts.length > 0) {
        optimisticData.bank_accounts[0].balance += transactionAmount;
    } else {
        optimisticData.bank_accounts = [{ bank: 'Primary Account', balance: transactionAmount }];
    }

    const newTotalAssets = calculateTotalAssets(optimisticData);
    const newTotalLiabilities = calculateTotalLiabilities(optimisticData);
    optimisticData.net_worth = newTotalAssets - newTotalLiabilities;
    
    setFinancialData(optimisticData);
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!financialData || financialData.user_id === 'user_default_123' || financialData.bank_accounts.length === 0) {
    return (
        <>
            <OnboardingTour />
            <EmptyState />
        </>
    )
  }

  const totalAssets = calculateTotalAssets(financialData);
  const totalLiabilities = calculateTotalLiabilities(financialData);
  const netWorth = financialData.net_worth;
  const currency = financialData.profile_currency || 'INR';
  const name = financialData.profile_name?.split(' ')[0] || 'User';

  const assetAllocationData = [];
  if (financialData.bank_accounts?.length) {
    assetAllocationData.push({ name: 'Bank Accounts', value: financialData.bank_accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) });
  }
  if (financialData.mutual_funds?.length) {
    assetAllocationData.push({ name: 'Mutual Funds', value: financialData.mutual_funds.reduce((sum, mf) => sum + (mf.current_value || 0), 0) });
  }
  if (financialData.stocks?.length) {
    assetAllocationData.push({ name: 'Stocks', value: financialData.stocks.reduce((sum, stock) => sum + ((stock.shares || 0) * (stock.current_price || 0)), 0) });
  }
  if (financialData.real_estate?.length) {
      assetAllocationData.push({ name: 'Real Estate', value: financialData.real_estate.reduce((sum, prop) => sum + (prop.market_value || 0), 0) });
  }
   if (financialData.ppf) {
      assetAllocationData.push({ name: 'PPF', value: financialData.ppf });
  }

  return (
      <>
        <OnboardingTour />
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(netWorth, currency)}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Assets</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAssets, currency)}</div>
               <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Total Liabilities</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalLiabilities, currency)}</div>
               <p className="text-xs text-muted-foreground">-1.2% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-headline">Credit Score</CardTitle>
              <CreditScoreIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialData.credit_score || 'N/A'}</div>
               <p className="text-xs text-muted-foreground">Last updated today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4" id="dashboard-networth-card">
            <CardHeader>
              <CardTitle className="font-headline">Net Worth Overview</CardTitle>
               <CardDescription>Your net worth trend over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <NetWorthChart currency={currency}/>
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

        <FinancialHealthCard financialData={financialData} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Profile</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center gap-2"><User size={16}/> Name</span> <strong>{financialData.profile_name}</strong></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Age</span> <strong>{financialData.profile_age}</strong></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center gap-2"><Briefcase size={16}/> Employment</span> <strong>{financialData.profile_employment_status}</strong></div>
                         <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center gap-2"><IndianRupee size={16}/> Income</span> <strong>{formatCurrency(financialData.profile_monthly_income, currency)}</strong></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Investments</CardTitle></CardHeader>
                    <CardContent>
                         <h4 className="font-semibold mb-2 text-base">Mutual Funds</h4>
                         <div className="overflow-x-auto">
                            <Table>
                                <TableHeader><TableRow><TableHead>Fund</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {financialData.mutual_funds?.map(mf => <TableRow key={mf.name}><TableCell>{mf.name}</TableCell><TableCell className="text-right">{formatCurrency(mf.current_value, currency)}</TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                         </div>
                         <h4 className="font-semibold mt-4 mb-2 text-base">SIPs</h4>
                         <div className="overflow-x-auto">
                            <Table>
                                <TableHeader><TableRow><TableHead>Fund</TableHead><TableHead className="text-right">Monthly</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {financialData.sips?.map(sip => <TableRow key={sip.name}><TableCell>{sip.name}</TableCell><TableCell className="text-right">{formatCurrency(sip.monthly_investment, currency)}</TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                         </div>
                    </CardContent>
                </Card>
            </div>
             <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Assets</CardTitle></CardHeader>
                    <CardContent>
                        <h4 className="font-semibold mb-2 text-base">Bank Accounts</h4>
                         <div className="overflow-x-auto">
                            <Table>
                               <TableHeader><TableRow><TableHead>Bank</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
                               <TableBody>
                                    {financialData.bank_accounts?.map(acc => <TableRow key={acc.bank}><TableCell>{acc.bank}</TableCell><TableCell className="text-right">{formatCurrency(acc.balance, currency)}</TableCell></TableRow>)}
                               </TableBody>
                            </Table>
                         </div>
                        <h4 className="font-semibold mt-4 mb-2 text-base">Stocks</h4>
                         <div className="overflow-x-auto">
                             <Table>
                                <TableHeader><TableRow><TableHead>Stock</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {financialData.stocks?.map(s => <TableRow key={s.ticker}><TableCell>{s.ticker}</TableCell><TableCell className="text-right">{formatCurrency(s.shares * s.current_price, currency)}</TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                         </div>
                         <h4 className="font-semibold mt-4 mb-2 text-base">Other Assets</h4>
                         <div className="overflow-x-auto">
                             <Table>
                                 <TableBody>
                                    {financialData.real_estate?.map(re => <TableRow key={re.property_type}><TableCell>{re.property_type}</TableCell><TableCell className="text-right">{formatCurrency(re.market_value, currency)}</TableCell></TableRow>)}
                                    <TableRow><TableCell>PPF</TableCell><TableCell className="text-right">{formatCurrency(financialData.ppf, currency)}</TableCell></TableRow>
                                 </TableBody>
                             </Table>
                         </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Liabilities</CardTitle></CardHeader>
                    <CardContent>
                        <h4 className="font-semibold mb-2 text-base">Loans</h4>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead className="text-right">Outstanding</TableHead></TableRow></TableHeader>
                                <TableBody>
                                   {financialData.loans?.map(l => <TableRow key={l.type}><TableCell>{l.type}</TableCell><TableCell className="text-right">{formatCurrency(l.outstanding_amount, currency)}</TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                        </div>
                        <h4 className="font-semibold mt-4 mb-2 text-base">Credit Cards</h4>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader><TableRow><TableHead>Issuer</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
                                 <TableBody>
                                    {financialData.credit_cards?.map(cc => <TableRow key={cc.issuer}><TableCell>{cc.issuer}</TableCell><TableCell className="text-right">{formatCurrency(cc.outstanding_balance, currency)}</TableCell></TableRow>)}
                                 </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline">Recent Transactions</CardTitle>
                <CardDescription>Your most recent financial activities.</CardDescription>
              </div>
               <AddTransactionDialog onAddTransaction={handleAddTransaction} currency={currency}/>
            </CardHeader>
            <CardContent>
              <RecentTransactions transactions={financialData.transactions || []} currency={currency} />
            </CardContent>
          </Card>
      </div>
    </>
  );
}


function AddTransactionDialog({ onAddTransaction, currency }: { onAddTransaction: (t: any) => void, currency: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const { toast } = useToast();

    const handleSubmit = () => {
        const numericAmount = parseFloat(amount);
        if (description && !isNaN(numericAmount) && numericAmount > 0) {
            onAddTransaction({ description, amount: numericAmount, type });
            
            toast({
                title: 'Transaction Added!',
                description: `${description} for ${formatCurrency(Math.abs(numericAmount), currency)} has been recorded.`
            });

            setDescription('');
            setAmount('');
            setType('expense');
            setIsOpen(false);
        } else {
             toast({
                title: 'Invalid Input',
                description: 'Please enter a valid description and amount.',
                variant: 'destructive'
            });
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a New Transaction</DialogTitle>
                    <DialogDescription>
                        Enter the details of your transaction below. This will be reflected optimistically on your dashboard.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., Dinner with friends"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount ({currency})
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label className="text-right">Type</Label>
                         <RadioGroup
                            value={type}
                            onValueChange={(value) => setType(value as any)}
                            className="col-span-3 flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="r-expense" />
                                <Label htmlFor="r-expense">Expense</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="r-income" />
                                <Label htmlFor="r-income">Income</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Save transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FinancialHealthCard({ financialData }: { financialData: FinancialData }) {
  const [healthInfo, setHealthInfo] = useState<{ score: number; advice: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvice, setShowAdvice] = useState(false);

  useEffect(() => {
    const fetchHealthScore = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cleanedDataString = JSON.stringify(financialData, null, 2);
        const response = await getFinancialHealthScore(cleanedDataString);
        setHealthInfo(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch financial health score.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthScore();
  }, [financialData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !healthInfo) {
    return null; // Or show an error card
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-500';
    if (score >= 600) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getScoreTier = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Needs Improvement';
  }

  const scorePercentage = ((healthInfo.score - 300) / (850 - 300)) * 100;

  return (
    <Card id="dashboard-health-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="font-headline">Financial Health Score</CardTitle>
                 <CardDescription>An AI-powered analysis of your financial well-being.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowAdvice(!showAdvice)}>
                {showAdvice ? 'Hide' : 'Show'} Advice
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center text-center">
                <div className="relative h-32 w-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                            className="text-muted/20"
                            strokeWidth="3"
                            fill="none"
                            stroke="currentColor"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className={getScoreColor(healthInfo.score)}
                            strokeWidth="3"
                            strokeDasharray={`${scorePercentage}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            stroke="currentColor"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl font-bold ${getScoreColor(healthInfo.score)}`}>{healthInfo.score}</span>
                        <span className="text-sm font-medium text-muted-foreground">{getScoreTier(healthInfo.score)}</span>
                    </div>
                </div>
            </div>
            <div className="md:col-span-2 prose prose-sm max-w-none dark:prose-invert">
                {showAdvice ? <ReactMarkdown>{healthInfo.advice}</ReactMarkdown> : <p>Your financial health score is a snapshot of your financial well-being, based on factors like savings, debt, and income. Click "Show Advice" for personalized tips from our AI.</p>}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

*/
