'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

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

export function ActiveUsersChart() {
  return (
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
        <Bar
          dataKey="users"
          fill="hsl(var(--primary))"
          barSize={30}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
