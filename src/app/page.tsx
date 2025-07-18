import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppLayout } from '@/components/app-layout';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Gauge,
  Lightbulb,
} from 'lucide-react';
import { userFinancialData, financialDataString } from '@/lib/mock-data';
import { getFinancialInsights } from '@/ai/flows/financial-insights';
import { Skeleton } from '@/components/ui/skeleton';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function DashboardCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

async function InitialInsight() {
  const { insight } = await getFinancialInsights({
    query: 'Give me a summary of my financial health and one actionable tip.',
    financialData: financialDataString,
  });

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="h-5 w-5 text-accent" />
          Your AI-Generated Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{insight}</p>
      </CardContent>
    </Card>
  );
}

function InitialInsightSkeleton() {
  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="h-5 w-5 text-accent" />
          Your AI-Generated Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome Back
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Net Worth"
            value={formatCurrency(userFinancialData.netWorth)}
            icon={Wallet}
          />
          <DashboardCard
            title="Total Assets"
            value={formatCurrency(userFinancialData.assets.totalAssets)}
            icon={TrendingUp}
          />
          <DashboardCard
            title="Total Liabilities"
            value={formatCurrency(userFinancialData.liabilities.totalLiabilities)}
            icon={TrendingDown}
          />
          <DashboardCard
            title="Credit Score"
            value={String(userFinancialData.creditScore)}
            icon={Gauge}
          />
        </div>
        <div className="grid gap-4">
          <Suspense fallback={<InitialInsightSkeleton />}>
            <InitialInsight />
          </Suspense>
        </div>
      </div>
    </AppLayout>
  );
}
