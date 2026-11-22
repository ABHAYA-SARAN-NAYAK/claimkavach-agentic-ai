import React from 'react';
import { CheckCircle2, Clock, Lock, ArrowRight } from 'lucide-react';
import { EscalationStep } from '../../lib/types';
import { DeadlineChip } from './DeadlineChip';
import { clsx } from 'clsx';

interface LadderBarProps {
  steps: EscalationStep[];
  virtualDate: string;
}

const STEP_LABELS: Record<string, { title: string; subtitle: string; ruleTip: string }> = {
  review: {
    title: '1. Document Review',
    subtitle: 'Lekha & Nyaya cross-check',
    ruleTip: 'Clause-by-clause contract parsing & deterministic mathematical validation.',
  },
  gro: {
    title: '2. Insurer GRO',
    subtitle: 'Grievance Officer (15d)',
    ruleTip: 'IRDAI Regulation: Insurer must resolve grievance in 15 days.',
  },
  regulator: {
    title: '3. Bima Bharosa',
    subtitle: 'IRDAI Regulatory Portal',
    ruleTip: 'Official regulator portal docket for insurer inaction.',
  },
  ombudsman: {
    title: '4. Ombudsman Pack',
    subtitle: 'CIO Binding Award',
    ruleTip: 'Insurance Ombudsman Rules 2017: Free statutory dispute resolution.',
  },
  consumer: {
    title: '5. Consumer Forum',
    subtitle: 'Optional legal route',
    ruleTip: 'Consumer Protection Act court filing (User choice).',
  },
};

export const LadderBar: React.FC<LadderBarProps> = ({ steps, virtualDate }) => {
  return (
    <div className="w-full bg-surface rounded-2xl border border-border p-4 shadow-xs select-none">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-content-2">
          Escalation Ladder & Statutory Windows
        </span>
        <span className="text-[11px] text-content-3">
          5-Rung Legal Dispute Process
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((st, idx) => {
          const meta = STEP_LABELS[st.step] || {
            title: st.step,
            subtitle: '',
            ruleTip: '',
          };

          const isDone = st.status === 'done';
          const isActive = st.status === 'active';
          const isWaiting = st.status === 'waiting';
          const isLocked = st.status === 'locked';

          return (
            <div
              key={st.step}
              className={clsx(
                'relative flex flex-col p-3 rounded-xl border transition-all',
                isDone && 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40',
                isActive && 'bg-brand-50/70 dark:bg-brand-900/20 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/20 shadow-xs',
                isWaiting && 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50',
                isLocked && 'bg-surface-2/60 border-border opacity-70'
              )}
              title={meta.ruleTip}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-content truncate">
                  {meta.title}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : isWaiting ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                ) : isActive ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500" />
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-content-3 flex-shrink-0" />
                )}
              </div>

              <p className="text-[11px] text-content-3 truncate mb-2">{meta.subtitle}</p>

              <div className="mt-auto flex items-center justify-between pt-1 border-t border-border/50">
                <span
                  className={clsx(
                    'text-[10px] uppercase font-bold tracking-wider',
                    isDone && 'text-emerald-700 dark:text-emerald-400',
                    isActive && 'text-brand-600 dark:text-brand-300',
                    isWaiting && 'text-amber-700 dark:text-amber-400',
                    isLocked && 'text-content-3'
                  )}
                >
                  {isWaiting ? 'Window Open' : st.status}
                </span>

                {st.deadline_on && (isWaiting || isActive) && (
                  <DeadlineChip deadlineDate={st.deadline_on} virtualDate={virtualDate} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
