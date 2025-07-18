'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

export function SalesOverviewChart() {
  return (
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
  );
}
