
'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface AssetAllocationChartProps {
    data: { name: string, value: number }[];
}

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
    if (!data || data.length === 0) {
        return <div style={{height: 300}} className="flex items-center justify-center text-muted-foreground">No asset allocation data available.</div>;
    }
    
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
