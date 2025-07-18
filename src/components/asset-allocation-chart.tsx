
'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

interface AssetAllocationChartProps {
    data: { name: string, value: number }[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
    if (!data || data.filter(d => d.value > 0).length === 0) {
        return <div style={{height: 300}} className="flex items-center justify-center text-muted-foreground">No asset allocation data available.</div>;
    }
    
    const chartData = data.filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          paddingAngle={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-background hover:opacity-80" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
             formatter={(value, name) => [new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value as number), name]}
        />
        <Legend wrapperStyle={{fontSize: "0.875rem"}}/>
      </PieChart>
    </ResponsiveContainer>
  );
}
