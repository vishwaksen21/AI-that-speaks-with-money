
'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentTransactions } from '@/components/recent-transactions';
import { NetWorthChart } from '@/components/net-worth-chart';
import { AssetAllocationChart } from '@/components/asset-allocation-chart';
import { getFinancialData, LOCAL_STORAGE_KEY } from '@/lib/mock-data';
import type { FinancialData } from '@/ai/flows/data-extraction';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, User, Briefcase, IndianRupee } from 'lucide-react';
import { CreditScore as CreditScoreIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


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

const calculateTotalAssets = (data: FinancialData): number => {
    if (!data) return 0;
    const bankBalance = data.bank_accounts?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0;
    const mutualFunds = data.mutual_funds?.reduce((sum, mf) => sum + (mf.current_value || 0), 0) || 0;
    const stocks = data.stocks?.reduce((sum, stock) => sum + ((stock.shares || 0) * (stock.current_price || 0)), 0) || 0;
    const realEstate = data.real_estate?.reduce((sum, prop) => sum + (prop.market_value || 0), 0) || 0;
    const ppf = data.ppf || 0;
    return bankBalance + mutualFunds + stocks + realEstate + ppf;
};

const calculateTotalLiabilities = (data: FinancialData): number => {
    if (!data) return 0;
    const loans = data.loans?.reduce((sum, loan) => sum + (loan.outstanding_amount || 0), 0) || 0;
    const creditCards = data.credit_cards?.reduce((sum, card) => sum + (card.outstanding_balance || 0), 0) || 0;
    return loans + creditCards;
};

export default function DashboardPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  
  useEffect(() => {
    const financialData = getFinancialData();
    setData(financialData);
  }, []);

  const handleAddTransaction = (newTransaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
  }) => {
    setData(currentData => {
        if (!currentData) return null;

        const newData = JSON.parse(JSON.stringify(currentData));

        const transactionAmount = newTransaction.type === 'income' 
            ? newTransaction.amount 
            : -newTransaction.amount;
        
        if (!newData.transactions) {
            newData.transactions = [];
        }
        newData.transactions.unshift({
            id: `txn_${Date.now()}`,
            description: newTransaction.description,
            amount: transactionAmount,
            date: new Date().toISOString().split('T')[0],
            category: newTransaction.type === 'income' ? 'Income' : 'Expense',
        });

        if (newData.bank_accounts && newData.bank_accounts.length > 0) {
            newData.bank_accounts[0].balance += transactionAmount;
        } else {
            newData.bank_accounts = [{ bank: 'Primary Account', balance: transactionAmount }];
        }

        const newTotalAssets = calculateTotalAssets(newData);
        const newTotalLiabilities = calculateTotalLiabilities(newData);
        newData.net_worth = newTotalAssets - newTotalLiabilities;

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        
        return newData;
    });
  }

  if (!data) {
    return (
        <AppLayout pageTitle="Dashboard">
             <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
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
        </AppLayout>
    )
  }

  const totalAssets = calculateTotalAssets(data);
  const totalLiabilities = calculateTotalLiabilities(data);
  const netWorth = data.net_worth;
  const currency = data.profile?.currency || 'INR';
  const name = data.profile?.name?.split(' ')[0] || 'User';

  const assetAllocationData = [];
  if (data.bank_accounts?.length) {
    assetAllocationData.push({ name: 'Bank Accounts', value: data.bank_accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0) });
  }
  if (data.mutual_funds?.length) {
    assetAllocationData.push({ name: 'Mutual Funds', value: data.mutual_funds.reduce((sum, mf) => sum + (mf.current_value || 0), 0) });
  }
  if (data.stocks?.length) {
    assetAllocationData.push({ name: 'Stocks', value: data.stocks.reduce((sum, stock) => sum + ((stock.shares || 0) * (stock.current_price || 0)), 0) });
  }
  if (data.real_estate?.length) {
      assetAllocationData.push({ name: 'Real Estate', value: data.real_estate.reduce((sum, prop) => sum + (prop.market_value || 0), 0) });
  }
   if (data.ppf) {
      assetAllocationData.push({ name: 'PPF', value: data.ppf });
  }

  return (
    <AppLayout pageTitle={`Hello, ${name}!`}>
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
              <div className="text-2xl font-bold">{data.credit_score || 'N/A'}</div>
               <p className="text-xs text-muted-foreground">Last updated today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Profile</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center gap-2"><User size={16}/> Name</span> <strong>{data.profile.name}</strong></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">Age</span> <strong>{data.profile.age}</strong></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center gap-2"><Briefcase size={16}/> Employment</span> <strong>{data.profile.employment_status}</strong></div>
                         <div className="flex justify-between items-center"><span className="text-muted-foreground flex items-center gap-2"><IndianRupee size={16}/> Income</span> <strong>{formatCurrency(data.profile.monthly_income, currency)}</strong></div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Investments</CardTitle></CardHeader>
                    <CardContent>
                         <h4 className="font-semibold mb-2 text-base">Mutual Funds</h4>
                        <Table>
                            <TableHeader><TableRow><TableHead>Fund</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {data.mutual_funds?.map(mf => <TableRow key={mf.name}><TableCell>{mf.name}</TableCell><TableCell className="text-right">{formatCurrency(mf.current_value, currency)}</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                         <h4 className="font-semibold mt-4 mb-2 text-base">SIPs</h4>
                         <Table>
                            <TableHeader><TableRow><TableHead>Fund</TableHead><TableHead className="text-right">Monthly</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {data.sips?.map(sip => <TableRow key={sip.name}><TableCell>{sip.name}</TableCell><TableCell className="text-right">{formatCurrency(sip.monthly_investment, currency)}</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Assets</CardTitle></CardHeader>
                    <CardContent>
                        <h4 className="font-semibold mb-2 text-base">Bank Accounts</h4>
                        <Table>
                           <TableHeader><TableRow><TableHead>Bank</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
                           <TableBody>
                                {data.bank_accounts?.map(acc => <TableRow key={acc.bank}><TableCell>{acc.bank}</TableCell><TableCell className="text-right">{formatCurrency(acc.balance, currency)}</TableCell></TableRow>)}
                           </TableBody>
                        </Table>
                        <h4 className="font-semibold mt-4 mb-2 text-base">Stocks</h4>
                         <Table>
                            <TableHeader><TableRow><TableHead>Stock</TableHead><TableHead className="text-right">Value</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {data.stocks?.map(s => <TableRow key={s.ticker}><TableCell>{s.ticker}</TableCell><TableCell className="text-right">{formatCurrency(s.shares * s.current_price, currency)}</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                         <h4 className="font-semibold mt-4 mb-2 text-base">Other Assets</h4>
                         <Table>
                             <TableBody>
                                {data.real_estate?.map(re => <TableRow key={re.property_type}><TableCell>{re.property_type}</TableCell><TableCell className="text-right">{formatCurrency(re.market_value, currency)}</TableCell></TableRow>)}
                                <TableRow><TableCell>PPF</TableCell><TableCell className="text-right">{formatCurrency(data.ppf, currency)}</TableCell></TableRow>
                             </TableBody>
                         </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg">Liabilities</CardTitle></CardHeader>
                    <CardContent>
                        <h4 className="font-semibold mb-2 text-base">Loans</h4>
                        <Table>
                            <TableHeader><TableRow><TableHead>Type</TableHead><TableHead className="text-right">Outstanding</TableHead></TableRow></TableHeader>
                            <TableBody>
                               {data.loans?.map(l => <TableRow key={l.type}><TableCell>{l.type}</TableCell><TableCell className="text-right">{formatCurrency(l.outstanding_amount, currency)}</TableCell></TableRow>)}
                            </TableBody>
                        </Table>
                        <h4 className="font-semibold mt-4 mb-2 text-base">Credit Cards</h4>
                        <Table>
                            <TableHeader><TableRow><TableHead>Issuer</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader>
                             <TableBody>
                                {data.credit_cards?.map(cc => <TableRow key={cc.issuer}><TableCell>{cc.issuer}</TableCell><TableCell className="text-right">{formatCurrency(cc.outstanding_balance, currency)}</TableCell></TableRow>)}
                             </TableBody>
                        </Table>
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
              <RecentTransactions transactions={data.transactions || []} currency={currency} />
            </CardContent>
          </Card>
      </div>
    </AppLayout>
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
                        Enter the details of your transaction below. It will be saved and reflected in your dashboard.
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
                    <Button onClick={handleSubmit} disabled={!description || !amount}>Save transaction</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
