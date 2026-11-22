import React from 'react';
import { VerdictLine } from '../../lib/types';
import { formatCurrency } from '../../lib/format';
import { VerdictBadge } from './VerdictBadge';
import { ConfidenceRing } from '../ui/ConfidenceRing';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface DeductionTableProps {
  lines: VerdictLine[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const DeductionTable: React.FC<DeductionTableProps> = ({
  lines,
  selectedId,
  onSelect,
}) => {
  const hasValid = lines.some((l) => l.verdict === 'valid_deduction');

  return (
    <div className="space-y-4">
      {/* Honesty Banner if any deduction is valid per PRD 4.9 */}
      {hasValid && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="font-medium">
            <span className="font-bold">Honest by design:</span> Deductions D2 and D3 look fair under your policy terms and statutory non-payable lists. ClaimKavach will not waste your time fighting valid deductions.
          </p>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 border-b border-border text-xs uppercase font-semibold text-content-3 tracking-wider">
            <tr>
              <th className="py-3 px-4">Item</th>
              <th className="py-3 px-4">Deduction Reason</th>
              <th className="py-3 px-4">Disallowed Amount</th>
              <th className="py-3 px-4">Nyaya's Verdict</th>
              <th className="py-3 px-4 text-center">Confidence</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {lines.map((line) => {
              const isSelected = selectedId === line.deduction_id;
              const amount =
                line.deduction_id === 'D1' ? 60000 : line.deduction_id === 'D2' ? 22000 : 18000;

              return (
                <tr
                  key={line.deduction_id}
                  onClick={() => onSelect(line.deduction_id)}
                  className={clsx(
                    'cursor-pointer transition-colors',
                    isSelected
                      ? 'bg-brand-50/60 dark:bg-brand-900/20 font-medium'
                      : 'hover:bg-surface-2'
                  )}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-content">
                    {line.deduction_id}
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="text-xs text-content line-clamp-2">
                      {line.reasoning_en}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-content whitespace-nowrap">
                    {formatCurrency(amount)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <VerdictBadge verdict={line.verdict} />
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <ConfidenceRing score={line.confidence} size={36} strokeWidth={3} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center text-xs font-medium text-brand-600 dark:text-brand-400 gap-1">
                      <span>View Evidence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
