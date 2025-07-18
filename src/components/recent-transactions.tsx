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

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-muted-foreground">
        No transactions recorded yet.
      </div>
    );
  }
  
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
        {transactions.slice(0, 5).map((transaction) => ( // Show latest 5
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-full">
                  {transaction.amount > 0 ? (
                    <CreditCard className="h-4 w-4 text-green-500" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <span className="font-medium">{transaction.description}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
            <TableCell>
              <Badge variant={transaction.amount < 0 ? "destructive" : "default"} className={transaction.amount > 0 ? 'bg-green-100 text-green-800' : ''}>
                {transaction.category}
              </Badge>
            </TableCell>
            <TableCell className={`text-right font-semibold ${transaction.amount > 0 ? 'text-green-600' : ''}`}>
              {formatCurrency(transaction.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
