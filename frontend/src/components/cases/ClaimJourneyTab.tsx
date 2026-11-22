import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Send, ArrowRight, ShieldCheck, Mail, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/format';

interface ClaimJourneyTabProps {
  ladder: any[];
  nextAction: any;
  onReviewApprove: () => void;
  virtualDate?: string;
  isResolved?: boolean;
}

export const ClaimJourneyTab: React.FC<ClaimJourneyTabProps> = ({
  ladder = [],
  nextAction,
  onReviewApprove,
  virtualDate,
  isResolved,
}) => {
  // 7 sequential journey milestones per UX reference
  const milestones = [
    {
      id: 'step_1',
      title: 'Documents Analyzed',
      date: '12 Sep 2026',
      status: 'completed',
      desc: 'Policy, hospital bill, and repudiation notice verified by Lekha.',
    },
    {
      id: 'step_2',
      title: 'Policy & Deductions Checked',
      date: '12 Sep 2026',
      status: 'completed',
      desc: '64 months continuous coverage verified against Clause 5.4 Moratorium.',
    },
    {
      id: 'step_3',
      title: 'Complaint Drafted',
      date: '13 Sep 2026',
      status: 'completed',
      desc: 'Statutory grievance petition prepared for Meridian Health Insurance GRO.',
    },
    {
      id: 'step_4',
      title: 'Your Approval',
      date: nextAction ? 'Action Required' : 'Approved',
      status: nextAction ? 'pending' : 'completed',
      desc: nextAction
        ? 'Review and approve the grievance petition before dispatch.'
        : 'Approved by policyholder and dispatched to insurer.',
    },
    {
      id: 'step_5',
      title: 'Insurer Response',
      date: isResolved ? 'Settlement Agreed' : 'Within 15 days of submission',
      status: isResolved ? 'completed' : nextAction ? 'upcoming' : 'active',
      desc: isResolved
        ? 'Insurer conceded continuous coverage and issued ₹60,000 settlement offer.'
        : 'Statutory 15-day SLA clock running for Meridian Health Insurance.',
    },
    {
      id: 'step_6',
      title: 'Escalation to Regulator',
      date: isResolved ? 'Skipped (Settled)' : 'If not resolved in 15 days',
      status: isResolved ? 'completed' : 'upcoming',
      desc: 'Automatic escalation to Insurance Ombudsman and Bima Bharosa if unresolved.',
    },
    {
      id: 'step_7',
      title: 'Resolution',
      date: isResolved ? 'Resolved' : 'Pending',
      status: isResolved ? 'completed' : 'upcoming',
      desc: isResolved
        ? 'Claim recovered in full (₹60,000). Case successfully closed.'
        : 'Full claim recovery or all statutory avenues exhausted.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Next Action Box if pending */}
      {nextAction && (
        <div className="p-6 rounded-card border border-clay-100 bg-clay-50/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-clay-600">
              <Clock className="w-4 h-4" />
              Immediate Next Action
            </div>
            <h3 className="font-bold text-carbon text-base">
              Review and approve the grievance complaint
            </h3>
            <p className="text-xs text-carbon-2">
              We have compiled a formal legal grievance with Clause 5.4 evidence. Nothing is sent without your tap.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={onReviewApprove}
            className="whitespace-nowrap gap-1.5 self-start sm:self-center"
          >
            Review & Approve
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Case Journey Timeline */}
      <div className="rounded-card border border-border bg-surface p-6 shadow-xs">
        <div className="pb-4 border-b border-border mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-carbon text-sm">Case Journey</h3>
            <p className="text-xs text-carbon-3">Visible, autonomous progress tracking</p>
          </div>
          {virtualDate && (
            <span className="text-[11px] font-mono text-carbon-3 bg-surface-warm px-2.5 py-1 rounded-btn border border-border">
              Current Date: {formatDate(virtualDate)}
            </span>
          )}
        </div>

        {/* Vertical Timeline List */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {milestones.map((m, idx) => (
            <div key={m.id} className="relative flex items-start gap-4">
              {/* Timeline Indicator Dot */}
              <div
                className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-surface transition-all ${
                  m.status === 'completed'
                    ? 'border-success text-success bg-success-bg'
                    : m.status === 'pending'
                    ? 'border-clay-500 text-clay-500 bg-clay-50 animate-pulse'
                    : m.status === 'active'
                    ? 'border-evergreen-700 text-evergreen-700 bg-evergreen-50'
                    : 'border-border text-carbon-3'
                }`}
              >
                {m.status === 'completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : m.status === 'pending' ? (
                  <div className="w-2 h-2 rounded-full bg-clay-500" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-carbon-3" />
                )}
              </div>

              {/* Milestone Details */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-carbon text-sm">{m.title}</h4>
                  <div className="flex items-center gap-2">
                    {m.status === 'pending' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-clay-50 text-clay-600 border border-clay-100 uppercase tracking-wide">
                        Pending Your Tap
                      </span>
                    )}
                    <span className="text-xs text-carbon-3">{m.date}</span>
                  </div>
                </div>
                <p className="text-xs text-carbon-2 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
