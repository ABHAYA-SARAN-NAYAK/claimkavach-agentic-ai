import React from 'react';
import { FileText, Download, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ClaimDocumentsTabProps {
  caseId: string;
}

export const ClaimDocumentsTab: React.FC<ClaimDocumentsTabProps> = ({ caseId }) => {
  const docs = [
    {
      name: 'policy_sample.pdf',
      label: 'Policy Document & Schedule',
      pages: 4,
      size: '6.8 KB',
      status: 'Verified (Clause 5.4 found)',
      url: '/api/samples/policy_sample.pdf',
    },
    {
      name: 'bill_sample.pdf',
      label: 'Hospital Final Bill & Breakdown',
      pages: 2,
      size: '4.5 KB',
      status: 'Verified (Room rent, OT, Meds)',
      url: '/api/samples/bill_sample.pdf',
    },
    {
      name: 'letter_sample.pdf',
      label: 'Insurer Repudiation Notice',
      pages: 2,
      size: '4.1 KB',
      status: 'Verified (Pre-existing condition cited)',
      url: '/api/samples/letter_sample.pdf',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-card border border-border bg-surface shadow-xs">
        <h3 className="font-bold text-carbon text-sm mb-1">Uploaded Claim Records</h3>
        <p className="text-xs text-carbon-2">
          Your documents are strictly sandboxed for this dispute evaluation and are never retained after case resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docs.map((d) => (
          <div
            key={d.name}
            className="p-5 rounded-card border border-border bg-surface shadow-xs flex flex-col justify-between space-y-4 hover:border-evergreen-700/30 transition-all"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-btn bg-evergreen-50 text-evergreen-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-bold text-carbon text-sm leading-snug">{d.label}</h4>
                <p className="text-[11px] font-mono text-carbon-3 mt-0.5">{d.name}</p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs text-success font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{d.status}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-carbon-3">{d.pages} pages · {d.size}</span>
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-evergreen-700 font-semibold hover:underline"
              >
                <span>Preview</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
