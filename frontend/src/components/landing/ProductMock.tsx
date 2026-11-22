import React from 'react';
import { ConfidenceRing } from '../ui/ConfidenceRing';
import { VerdictBadge } from '../cases/VerdictBadge';
import { ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { CountUp } from '../ui/CountUp';

export const ProductMock: React.FC = () => {
  return (
    <div className="relative rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-5 shadow-2xl space-y-4 max-w-md w-full">
      {/* Mini Case Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
            MH
          </div>
          <div>
            <h4 className="text-xs font-bold text-content">Suraksha Plus Floater</h4>
            <p className="text-[11px] text-content-3">Policy MH-FF-2021-004512</p>
          </div>
        </div>
        <VerdictBadge verdict="strong_case" />
      </div>

      {/* Disputed vs Recoverable */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border text-xs">
        <div>
          <span className="text-[10px] text-content-3 uppercase font-semibold">Disputed</span>
          <p className="text-sm font-bold text-content font-mono">₹1,00,000</p>
        </div>
        <ArrowRight className="w-4 h-4 text-content-3" />
        <div className="text-right">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
            Recoverable
          </span>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            ₹60,000
          </p>
        </div>
      </div>

      {/* Deduction D1 Analysis Box */}
      <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/40 dark:bg-brand-900/10 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-content flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-brand-500 text-white flex items-center justify-center text-[10px]">
              D1
            </span>
            <span>Non-disclosure Repudiation</span>
          </span>
          <ConfidenceRing score={87} size={32} strokeWidth={3} />
        </div>
        <p className="text-[11px] text-content-2">
          Insurer wrongly cited pre-existing illness under Clause 4.2. Policy completed 64 continuous months, triggering statutory Moratorium protection.
        </p>

        <div className="flex flex-wrap gap-1 pt-1">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface border border-border text-brand-600 dark:text-brand-300">
            Clause 5.4 Moratorium
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface border border-border text-emerald-600">
            64 Months Active Cover
          </span>
        </div>
      </div>

      {/* Bottom Mini Stepper */}
      <div className="flex items-center justify-between text-[11px] text-content-3 pt-1">
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Evidence Verified (12/12)
        </span>
        <span className="font-mono text-content-3">GRO Step Active</span>
      </div>
    </div>
  );
};
