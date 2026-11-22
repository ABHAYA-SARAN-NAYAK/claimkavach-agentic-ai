import React, { useState } from 'react';
import { ConfidenceRing } from '../ui/ConfidenceRing';
import { VerdictBadge } from '../cases/VerdictBadge';
import { BookOpen, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export const LivePreview: React.FC = () => {
  const [selectedDeduction, setSelectedDeduction] = useState<'D1' | 'D2' | 'D3'>('D1');

  const data = {
    D1: {
      amount: '₹60,000',
      reason: 'Pre-existing condition (hypertension) not disclosed at proposal (Clause 4.2).',
      verdict: 'strong_case' as const,
      confidence: 87,
      policyClause: 'Clause 5.4 Moratorium',
      policyQuote: 'After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation...',
      finding: 'Policy active for 64 months. Repudiation is barred by IRDAI Moratorium regulations.',
    },
    D2: {
      amount: '₹22,000',
      reason: 'Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2).',
      verdict: 'valid_deduction' as const,
      confidence: 95,
      policyClause: 'Clause 3.2 Room Rent',
      policyQuote: 'Room rent is covered up to ₹5,000 per day. If a higher category room is opted for, all associated medical expenses shall be reduced in the same proportion...',
      finding: 'Room selected was ₹6,500/day. Proportionate reduction of ₹21,923 matches ₹22,000 deduction within tolerance.',
    },
    D3: {
      amount: '₹18,000',
      reason: 'Non-payable consumables (Annexure I, Clause 6.1).',
      verdict: 'valid_deduction' as const,
      confidence: 95,
      policyClause: 'Clause 6.1 Non-Payable Items',
      policyQuote: 'Consumables listed in Annexure I are not payable.',
      finding: 'Hospital consumables (PPE, surgical gloves) are standard excluded expenses under IRDAI guidelines.',
    },
  };

  const curr = data[selectedDeduction];

  return (
    <section className="py-20 bg-surface-2/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Interactive Product Preview
          </span>
          <h2 className="text-3xl font-bold text-content">
            See how ClaimKavach judges claims.
          </h2>
          <p className="text-sm text-content-2">
            Click on each deduction below to see real clause matching and verdict logic.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-surface p-6 shadow-lg space-y-6">
          {/* Deduction Selector Pills */}
          <div className="grid grid-cols-3 gap-2">
            {(['D1', 'D2', 'D3'] as const).map((id) => (
              <button
                key={id}
                onClick={() => setSelectedDeduction(id)}
                className={clsx(
                  'p-3 rounded-xl border text-left transition-all',
                  selectedDeduction === id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500/20'
                    : 'border-border bg-surface-2 hover:bg-surface-3'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-content">{id}</span>
                  <span className="text-xs font-bold font-mono text-content">{data[id].amount}</span>
                </div>
                <div className="mt-1">
                  <VerdictBadge verdict={data[id].verdict} />
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Evidence Inspection Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface-2/60 p-4 space-y-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                <FileText className="w-4 h-4" />
                Insurer Stated Reason ({selectedDeduction})
              </span>
              <p className="text-content italic p-3 rounded-lg bg-surface border border-border">
                "{curr.reason}"
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface-2/60 p-4 space-y-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
                Verified Policy Contract ({curr.policyClause})
              </span>
              <p className="text-content italic p-3 rounded-lg bg-surface border border-border">
                "{curr.policyQuote}"
              </p>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ConfidenceRing score={curr.confidence} size={42} strokeWidth={3.5} />
              <div>
                <h4 className="text-sm font-bold text-content">Nyaya's Deterministic Finding</h4>
                <p className="text-xs text-content-2">{curr.finding}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
