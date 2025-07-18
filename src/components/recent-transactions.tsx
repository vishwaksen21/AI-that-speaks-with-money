import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ShoppingCart } from 'lucide-react';

const transactions = [
  {
    id: 'txn_1',
    description: 'Starbucks Coffee',
    amount: -350,
    date: '2024-07-22',
    category: 'Food & Drink',
  },
  {
    id: 'txn_2',
    description: 'Salary Deposit',
    amount: 80000,
    date: '2024-07-21',
    category: 'Income',
  },
  {
    id: 'txn_3',
    description: 'Amazon Purchase',
    amount: -2500,
    date: '2024-07-20',
    category: 'Shopping',
  },
  {
    id: 'txn_4',
    description: 'Netflix Subscription',
    amount: -799,
    date: '2024-07-19',
    category: 'Entertainment',
  },
  {
    id: 'txn_5',
    description: 'Mutual Fund Investment',
    amount: -5000,
    date: '2024-07-18',
    category: 'Investment',
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RecentTransactions() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-full">
                  {transaction.amount > 0 ? (
                    <CreditCard className="h-4 w-4 text-primary" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <span className="font-medium">{transaction.description}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
            <TableCell>
              <Badge variant="outline">{transaction.category}</Badge>
            </TableCell>
            <TableCell className={`text-right font-semibold ${transaction.amount > 0 ? 'text-primary' : ''}`}>
              {formatCurrency(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
