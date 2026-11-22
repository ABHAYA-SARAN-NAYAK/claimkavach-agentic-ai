import React from 'react';
import { VerdictType } from '../../lib/types';
import { getVerdictBadgeClass } from '../../lib/format';
import { clsx } from 'clsx';

interface VerdictBadgeProps {
  verdict: VerdictType | string;
  className?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, className }) => {
  const meta = getVerdictBadgeClass(verdict);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold select-none shadow-2xs',
        meta.bg,
        meta.text,
        meta.border,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{meta.label}</span>
    </span>
  );
};
