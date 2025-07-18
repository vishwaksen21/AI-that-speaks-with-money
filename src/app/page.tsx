import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppLayout } from '@/components/app-layout';
import {
  Wallet,
  Users,
  CreditCard,
  ShoppingCart,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { userFinancialData } from '@/lib/mock-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

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
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  changeType: 'positive' | 'negative';
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-primary text-primary-foreground">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          <span
            className={
              changeType === 'positive' ? 'text-green-500' : 'text-red-500'
            }
          >
            {change}
          </span>
          {' since last month'}
        </p>
      </CardContent>
    </Card>
  );
}

const salesData = [
  { name: 'Apr', sales: 21000, expenses: 15000 },
  { name: 'May', sales: 25000, expenses: 16000 },
  { name: 'Jun', sales: 28000, expenses: 17000 },
  { name: 'Jul', sales: 32000, expenses: 19000 },
  { name: 'Aug', sales: 35000, expenses: 22000 },
  { name: 'Sep', sales: 31000, expenses: 20000 },
  { name: 'Oct', sales: 38000, expenses: 25000 },
  { name: 'Nov', sales: 42000, expenses: 28000 },
  { name: 'Dec', sales: 45000, expenses: 30000 },
];
const activeUsersData = [
  { name: 'Apr', users: 200 },
  { name: 'May', users: 220 },
  { name: 'Jun', users: 180 },
  { name: 'Jul', users: 250 },
  { name: 'Aug', users: 230 },
  { name: 'Sep', users: 300 },
  { name: 'Oct', users: 280 },
  { name: 'Nov', users: 320 },
  { name: 'Dec', users: 350 },
];

export default function DashboardPage() {
  return (
    <AppLayout pageTitle="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Today's Money"
            value={formatCurrency(userFinancialData.netWorth)}
            icon={Wallet}
            change="+55%"
            changeType="positive"
          />
          <DashboardCard
            title="Today's Users"
            value="2,300"
            icon={Users}
            change="+3%"
            changeType="positive"
          />
          <DashboardCard
            title="New Clients"
            value="+3,462"
            icon={CreditCard}
            change="-2%"
            changeType="negative"
          />
          <DashboardCard
            title="Sales"
            value={formatCurrency(103430)}
            icon={ShoppingCart}
            change="+5%"
            changeType="positive"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-2 shadow-none">
            <CardHeader>
              <CardTitle>Built by developers</CardTitle>
              <CardDescription>Soft UI Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-muted-foreground mb-4">
                    From colors, cards, typography to complex elements, you will
                    find the full documentation.
                  </p>
                  <Button variant="link" className="p-0">
                    Read More
                  </Button>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  <Image
                    src="https://placehold.co/600x400/E91E63/FFFFFF"
                    alt="Rocket"
                    width={150}
                    height={150}
                    data-ai-hint="rocket illustration"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className="lg:col-span-3 shadow-none bg-cover bg-center"
            style={{ backgroundImage: "url('https://placehold.co/600x400')" }}
            data-ai-hint="space night"
          >
            <div className="bg-black/50 h-full rounded-lg p-6 flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-white">
                  Work with the rockets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Wealth creation is an evolutionarily recent positive-sum game.
                  It is all about who take the opportunity first.
                </p>
                <Button variant="link" className="p-0 text-white">
                  Read More
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Sales overview</CardTitle>
              <CardDescription className="flex items-center text-green-500">
                <ArrowUp className="w-4 h-4 mr-1" />
                4% more in 2024
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--secondary-foreground))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>(+23%) than last week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activeUsersData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                    }}
                  />
                  <Bar dataKey="users" fill="hsl(var(--primary))" barSize={30} radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
