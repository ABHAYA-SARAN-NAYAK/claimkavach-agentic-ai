import React from 'react';
import { Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface DeadlineChipProps {
  deadlineDate: string | null;
  virtualDate: string;
}

export const DeadlineChip: React.FC<DeadlineChipProps> = ({ deadlineDate, virtualDate }) => {
  if (!deadlineDate) return null;

  const d1 = new Date(virtualDate);
  const d2 = new Date(deadlineDate);
  const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));

  let urgencyClass = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300';
  let label = `${diffDays} days left`;

  if (diffDays < 0) {
    urgencyClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
    label = `Overdue by ${Math.abs(diffDays)}d`;
  } else if (diffDays <= 2) {
    urgencyClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300';
    label = `Due in ${diffDays}d (Urgent)`;
  } else if (diffDays <= 5) {
    urgencyClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
    label = `Due in ${diffDays} days`;
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-mono font-medium',
        urgencyClass
      )}
      title={`Statutory deadline: ${deadlineDate}`}
    >
      <Clock className="w-3 h-3 flex-shrink-0" />
      <span>{label}</span>
    </span>
  );
};
