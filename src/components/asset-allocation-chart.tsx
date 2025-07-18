
'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { getFinancialData } from '@/lib/mock-data';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AssetAllocationChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const financialData = getFinancialData();
        const chartData = financialData.assets.cashAndInvestments.breakdown.map(
            (item: any) => ({ name: item.type, value: item.amount })
        );
        setData(chartData);
    }, []);

    if (data.length === 0) {
        return <div style={{height: 300}} />;
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
