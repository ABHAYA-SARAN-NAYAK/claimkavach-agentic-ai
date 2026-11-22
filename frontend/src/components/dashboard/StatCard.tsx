import React from 'react';
import { CountUp } from '../ui/CountUp';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  sublabel?: string;
  icon: React.ReactNode;
  urgency?: 'normal' | 'warning' | 'critical';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  isCurrency = false,
  prefix = '',
  suffix = '',
  sublabel,
  icon,
  urgency = 'normal',
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-xs transition-all hover:shadow-md">
      {/* Top Urgency Accent Line */}
      {urgency !== 'normal' && (
        <div
          className={clsx(
            'absolute top-0 left-0 right-0 h-1',
            urgency === 'critical' ? 'bg-danger' : 'bg-warning'
          )}
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-content-3 uppercase tracking-wider">
          {label}
        </span>
        <div className="w-8 h-8 rounded-lg bg-surface-2 text-content flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="text-2xl font-extrabold font-mono text-content tracking-tight">
        <CountUp end={value} isCurrency={isCurrency} prefix={prefix} suffix={suffix} />
      </div>

      {sublabel && (
        <p className="mt-1 text-xs text-content-3 truncate">{sublabel}</p>
      )}
    </div>
  );
};
