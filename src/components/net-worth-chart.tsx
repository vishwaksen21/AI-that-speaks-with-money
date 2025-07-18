
'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', netWorth: 400000 },
  { name: 'Feb', netWorth: 450000 },
  { name: 'Mar', netWorth: 520000 },
  { name: 'Apr', netWorth: 580000 },
  { name: 'May', netWorth: 620000 },
  { name: 'Jun', netWorth: 675000 },
];

function formatYAxis(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            notation: 'compact',
        }).format(amount);
    } catch (e) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            notation: 'compact',
        }).format(amount);
    }
}

function formatTooltip(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch(e) {
         return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }
}

export function NetWorthChart({ currency = 'INR' }: { currency?: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
            <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatYAxis(value as number, currency)} />
        <Tooltip
             contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
            }}
            formatter={(value: number) => formatTooltip(value, currency)
            }
        />
        <Area type="monotone" dataKey="netWorth" stroke="hsl(var(--primary))" fill="url(#colorNetWorth)" fillOpacity={1} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
