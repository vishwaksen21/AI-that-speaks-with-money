'use client';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { userFinancialData } from '@/lib/mock-data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const data = userFinancialData.assets.cashAndInvestments.breakdown.map(
  (item) => ({ name: item.type, value: item.amount })
);

export function AssetAllocationChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
            }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
