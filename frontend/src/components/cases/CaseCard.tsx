import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Case } from '../../lib/types';
import { formatCurrency, formatDate } from '../../lib/format';
import { VerdictBadge } from './VerdictBadge';
import { DeadlineChip } from './DeadlineChip';
import { ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../lib/store';

interface CaseCardProps {
  caseItem: Case;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem }) => {
  const navigate = useNavigate();
  const { virtualDate } = useAppStore();

  const nextStep = caseItem.ladder?.find((s) => s.status === 'active' || s.status === 'waiting');
  const isResolved = caseItem.status === 'resolved';

  return (
    <div
      onClick={() => navigate(`/app/cases/${caseItem.case_id}`)}
      className="group rounded-2xl border border-border bg-surface p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Insurer Initials Avatar */}
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center justify-center font-bold text-sm">
            MH
          </div>
          <div>
            <h3 className="text-sm font-bold text-content group-hover:text-brand-500 transition-colors">
              {caseItem.title}
            </h3>
            <p className="text-xs text-content-3">
              {caseItem.insurer} · Policy {caseItem.policy_no}
            </p>
          </div>
        </div>

        <div>
          {isResolved ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </span>
          ) : (
            <VerdictBadge verdict="strong_case" />
          )}
        </div>
      </div>

      {/* Amounts and Next Step */}
      <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
        <div>
          <span className="text-[11px] text-content-3">Disputed / Recoverable</span>
          <p className="font-mono font-semibold text-content text-sm">
            {formatCurrency(caseItem.disputed_total)} /{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              {formatCurrency(caseItem.recoverable_total)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {nextStep?.deadline_on && (
            <DeadlineChip deadlineDate={nextStep.deadline_on} virtualDate={virtualDate} />
          )}
          <span className="p-1 rounded-lg text-content-3 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
