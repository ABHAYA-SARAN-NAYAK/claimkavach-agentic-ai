import React from 'react';
import { VerdictBadge } from '../cases/VerdictBadge';
import { TermTooltip } from '../ui/TermTooltip';
import { Button } from '../ui/Button';
import { ShieldCheck, ChevronRight, Sparkles, AlertCircle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

interface ClaimResultTabProps {
  verdict: any;
  onSelectDeduction: (deductionId: string) => void;
  onPrepareComplaint: () => void;
}

export const ClaimResultTab: React.FC<ClaimResultTabProps> = ({
  verdict,
  onSelectDeduction,
  onPrepareComplaint,
}) => {
  const recoverable = verdict?.recoverable_total || 60000;
  const deductions = verdict?.deductions || [
    {
      id: 'D1',
      amount: 60000,
      reason: 'Pre-existing condition not disclosed (Clause 5.4 Moratorium violation)',
      verdict: 'strong_case',
      explanation: 'Continuous coverage is 64 months, exceeding the 48-month statutory moratorium.',
    },
    {
      id: 'D2',
      amount: 22000,
      reason: 'Proportionate deduction on room rent cap (Twin sharing vs Single AC)',
      verdict: 'valid_deduction',
      explanation: 'Room rent cap exceeded ₹5,000/day limit under Clause 3.2. Deduction was contractually valid.',
    },
    {
      id: 'D3',
      amount: 18000,
      reason: 'Non-medical expenses (PPE kits, administrative charges)',
      verdict: 'valid_deduction',
      explanation: 'IRDAI non-payable items schedule applies. Insurer deduction is valid.',
    },
  ];

  const hasValidDeduction = deductions.some((d: any) => d.verdict === 'valid_deduction');

  return (
    <div className="space-y-6">
      {/* Big Headline Banner */}
      <div className="p-6 sm:p-7 rounded-card-lg border border-border bg-surface shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success-bg text-success flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <VerdictBadge verdict="strong_case" />
          </div>

          <span className="text-xs text-carbon-3">
            Multi-agent legal evaluation complete
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-carbon tracking-tight">
          We found <span className="text-clay-600">{formatCurrency(recoverable)}</span> worth challenging.
        </h2>

        <p className="text-sm text-carbon-2 max-w-2xl leading-relaxed">
          The insurer's repudiation reason is inconsistent with Clause 5.4 of your policy and violates statutory{' '}
          <TermTooltip term="moratorium">IRDAI Moratorium</TermTooltip> protections.
        </p>
      </div>

      {/* Deduction Breakdown Section */}
      <div className="rounded-card border border-border bg-surface shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface-warm/40 flex items-center justify-between">
          <h3 className="font-bold text-carbon text-sm">Deduction Breakdown</h3>
          <span className="text-xs text-carbon-3">
            Click any deduction to view source evidence
          </span>
        </div>

        <div className="divide-y divide-border">
          {deductions.map((d: any) => (
            <div
              key={d.id}
              onClick={() => onSelectDeduction(d.id)}
              className="p-5 hover:bg-surface-warm/60 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-clay-50 text-clay-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  ₹
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-carbon text-base tabular-nums">
                      {formatCurrency(d.amount)}
                    </span>
                    <VerdictBadge verdict={d.verdict} />
                  </div>
                  <p className="text-xs text-carbon-2 mt-0.5 truncate max-w-md sm:max-w-xl">
                    {d.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 text-carbon-3 group-hover:text-evergreen-700 transition-colors">
                <span className="text-xs hidden sm:inline font-medium">View Evidence</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honesty Banner when valid deductions exist */}
      {hasValidDeduction && (
        <div className="p-4 rounded-card bg-surface-warm border border-border flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
          <div className="text-xs text-carbon-2 leading-relaxed">
            <strong className="text-carbon font-semibold">Honest Assessment: </strong>
            We checked all deductions against your contract and found 2 items (₹40,000) are contractually valid under room-rent cap and non-medical schedules. We recommend fighting{' '}
            <strong className="text-clay-600">only the ₹60,000</strong> that was wrongfully deducted.
          </div>
        </div>
      )}

      {/* Our Recommendation Card */}
      <div className="p-6 rounded-card border border-clay-100 bg-clay-50/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-clay-600">
            <Sparkles className="w-4 h-4" />
            Our Recommendation
          </div>
          <p className="text-sm font-semibold text-carbon">
            Proceed with a formal grievance complaint for {formatCurrency(recoverable)} with verified policy evidence.
          </p>
          <p className="text-xs text-carbon-2">
            Transmits a statutory notice directly to Meridian Health Insurance's Grievance Redressal Officer.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onPrepareComplaint}
          className="whitespace-nowrap gap-1.5 self-start sm:self-center"
        >
          Prepare Complaint
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Your Policy at a Glance */}
      <div className="p-6 rounded-card border border-border bg-surface shadow-xs space-y-4">
        <h3 className="font-bold text-carbon text-sm">Your Policy at a Glance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-btn border border-border bg-surface-warm/30 space-y-1">
            <div className="font-semibold text-carbon flex items-center justify-between">
              <span>Clause 5.4: Moratorium Period</span>
              <span className="text-carbon-3 font-mono">Page 3</span>
            </div>
            <p className="text-carbon-2">
              48 continuous months required. Your policy has 64 months. Repudiation is barred.
            </p>
          </div>

          <div className="p-3 rounded-btn border border-border bg-surface-warm/30 space-y-1">
            <div className="font-semibold text-carbon flex items-center justify-between">
              <span>Clause 3.2: Room Rent Limit</span>
              <span className="text-carbon-3 font-mono">Page 2</span>
            </div>
            <p className="text-carbon-2">
              1% of Sum Insured (₹5,000/day). Proportionate scale-down applies if exceeded.
            </p>
          </div>

          <div className="p-3 rounded-btn border border-border bg-surface-warm/30 space-y-1">
            <div className="font-semibold text-carbon flex items-center justify-between">
              <span>Clause 4.1: Specified Waiting Period</span>
              <span className="text-carbon-3 font-mono">Page 3</span>
            </div>
            <p className="text-carbon-2">
              Joint replacement waiting period: 24 months. Already elapsed at 64 months.
            </p>
          </div>

          <div className="p-3 rounded-btn border border-border bg-surface-warm/30 space-y-1">
            <div className="font-semibold text-carbon flex items-center justify-between">
              <span>Clause 8.1: Grievance Redressal</span>
              <span className="text-carbon-3 font-mono">Page 5</span>
            </div>
            <p className="text-carbon-2">
              Mandatory 15-day resolution window for Grievance Redressal Officer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
