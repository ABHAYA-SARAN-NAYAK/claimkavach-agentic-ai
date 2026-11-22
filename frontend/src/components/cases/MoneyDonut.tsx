import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../lib/format';

interface MoneyDonutProps {
  paid: number;
  contestable: number;
  validDeductions: number;
}

export const MoneyDonut: React.FC<MoneyDonutProps> = ({
  paid = 140000,
  contestable = 60000,
  validDeductions = 40000,
}) => {
  const data = [
    { name: 'Approved & Paid', value: paid, color: '#14B8A6' },
    { name: 'Contestable Claim', value: contestable, color: '#6D4CFF' },
    { name: 'Valid Deductions', value: validDeductions, color: '#94A3B8' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-40 h-40 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={65}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 flex-1 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-content-2">{item.name}</span>
            </div>
            <span className="font-mono font-semibold text-content">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
