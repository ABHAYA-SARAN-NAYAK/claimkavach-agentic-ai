import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../lib/format';

export const RecoveryChart: React.FC = () => {
  const data = [
    { date: '08 Sep', potential: 60000, recovered: 0 },
    { date: '11 Sep', potential: 60000, recovered: 0 },
    { date: '23 Sep', potential: 60000, recovered: 0 },
    { date: '02 Oct', potential: 60000, recovered: 30000 },
    { date: '22 Oct', potential: 60000, recovered: 60000 },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-content">Claim Recovery Trajectory</h3>
          <p className="text-xs text-content-3">Potential dispute value vs settled recovery over virtual time</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
            <span className="text-content-3">Potential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-content-3">Recovered</span>
          </div>
        </div>
      </div>

      <div className="h-60 w-full font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPot" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#6D4CFF" stopOpacity={0.25} />
                <stop stopColor="#6D4CFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#14B8A6" stopOpacity={0.35} />
                <stop stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
            <XAxis dataKey="date" stroke="var(--text-3)" tickLine={false} />
            <YAxis
              tickFormatter={(v) => `₹${v / 1000}k`}
              stroke="var(--text-3)"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="potential"
              stroke="#6D4CFF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPot)"
            />
            <Area
              type="monotone"
              dataKey="recovered"
              stroke="#14B8A6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRec)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
