import { AppLayout } from '@/components/app-layout';
import { userFinancialData } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowUp,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { AssetAllocationChart } from '@/components/asset-allocation-chart';
import { NetWorthChart } from '@/components/net-worth-chart';
import { RecentTransactions } from '@/components/recent-transactions';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { assets, liabilities, netWorth, monthlyIncome, monthlyExpenses } =
    userFinancialData;

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            icon={Wallet}
            change="+20.1% from last month"
          />
          <StatCard
            title="Total Assets"
            value={formatCurrency(assets.totalAssets)}
            icon={PiggyBank}
            change="+18.1% from last month"
          />
          <StatCard
            title="Total Liabilities"
            value={formatCurrency(liabilities.totalLiabilities)}
            icon={Landmark}
            change="+5.2% from last month"
          />
          <StatCard
            title="Monthly Cash Flow"
            value={formatCurrency(monthlyIncome - monthlyExpenses)}
            icon={TrendingUp}
            change="Net income after expenses"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Net Worth Over Time</CardTitle>
              <CardDescription>
                Your financial growth over the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetWorthChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>How your assets are diversified.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssetAllocationChart />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
