import React from 'react';
import { Mail, Download, FileText, CheckCircle, Clock, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/format';

interface ClaimLettersTabProps {
  caseId: string;
  messages: any[];
}

export const ClaimLettersTab: React.FC<ClaimLettersTabProps> = ({ caseId, messages = [] }) => {
  const letters = [
    {
      id: 'let_1',
      recipient: 'Grievance Redressal Officer (GRO) · Meridian Health Insurance',
      subject: 'Formal Grievance Petition: Unlawful Repudiation under Clause 5.4 Moratorium (Claim MH-FF-2021-004512)',
      date: '13 Sep 2026',
      status: 'dispatched',
      direction: 'outbound',
      isSimulated: false,
      body: `To The Grievance Redressal Officer,
Meridian Health Insurance Co. Ltd.

Subject: Formal Grievance against Rejection of Claim No. MH-FF-2021-004512

Respected Sir/Madam,
I am writing to formally dispute the repudiation of my health insurance claim for Knee Replacement Surgery at Shree Hospital.

The repudiation letter claims non-disclosure of hypertension as a pre-existing disease under Clause 4.2.
However, Policy Schedule No. MH-FF-2021-004512 confirms continuous coverage inception from 01 April 2021.
As on hospitalization date (14 August 2026), 64 continuous months of coverage have elapsed without break.

Under Clause 5.4 of your own Policy Terms & Conditions read with IRDAI Master Circular (2024):
"After 48 continuous months of coverage, no claim shall be contestable by the insurer on grounds of pre-existing condition, non-disclosure, or misrepresentation."

I demand immediate reconsideration and disbursement of ₹60,000 within the statutory 15-day SLA, failing which I shall escalate to the Insurance Ombudsman and IRDAI Bima Bharosa.

Yours faithfully,
Priya Raghavan`,
    },
    {
      id: 'let_2',
      recipient: 'Priya Raghavan (Policyholder)',
      subject: 'Acknowledgment & Reconsideration Offer: Claim MH-FF-2021-004512',
      date: '28 Sep 2026',
      status: 'received',
      direction: 'inbound',
      isSimulated: true,
      body: `Dear Mrs. Priya Raghavan,

We acknowledge receipt of your formal grievance petition dated 13 September 2026.

Upon review by our Chief Medical Claims Underwriter, we have verified that continuous coverage under Policy No. MH-FF-2021-004512 has indeed crossed the statutory 48-month moratorium threshold.

Accordingly, the company has agreed to overturn the repudiation of ₹60,000 for your joint replacement procedure and approved full settlement. The payment of ₹60,000 will be credited directly to your registered bank account via NEFT within 3 working days.

Sincerely,
Grievance Redressal Team
Meridian Health Insurance Co. Ltd.`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Evidence Pack Download */}
      <div className="p-5 rounded-card border border-border bg-surface shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-carbon text-sm">Grievance Letters & Formal Transcripts</h3>
          <p className="text-xs text-carbon-2">
            Every legal notice dispatched by Doot and replies received from insurer desks.
          </p>
        </div>

        <a
          href={`/api/cases/${caseId}/evidence-pack`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-btn bg-surface-warm border border-border text-carbon text-xs font-semibold hover:bg-border/30 transition-colors shadow-2xs self-start sm:self-center"
        >
          <Download className="w-3.5 h-3.5 text-evergreen-700" />
          Download Evidence Pack (PDF)
        </a>
      </div>

      {/* Letters Stream */}
      <div className="space-y-4">
        {letters.map((letItem) => (
          <div
            key={letItem.id}
            className="rounded-card border border-border bg-surface shadow-xs overflow-hidden"
          >
            {/* Letter Header */}
            <div className="p-4 sm:p-5 border-b border-border bg-surface-warm/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-btn flex items-center justify-center ${
                    letItem.direction === 'outbound'
                      ? 'bg-evergreen-50 text-evergreen-700'
                      : 'bg-clay-50 text-clay-600'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-carbon text-xs sm:text-sm">
                      {letItem.recipient}
                    </span>
                    {letItem.isSimulated && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Simulated
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-carbon-3">{letItem.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  size="sm"
                  className={
                    letItem.direction === 'outbound'
                      ? 'bg-evergreen-50 text-evergreen-700 border-evergreen-100'
                      : 'bg-success-bg text-success border-success/30'
                  }
                >
                  {letItem.direction === 'outbound' ? 'Dispatched' : 'Settlement Reply'}
                </Badge>
              </div>
            </div>

            {/* Letter Subject & Body */}
            <div className="p-5 space-y-3">
              <h4 className="font-semibold text-carbon text-xs sm:text-sm">
                Subject: {letItem.subject}
              </h4>
              <div className="p-4 rounded-card bg-paper/50 border border-border text-xs leading-relaxed text-carbon-2 font-sans whitespace-pre-line max-h-72 overflow-y-auto">
                {letItem.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
