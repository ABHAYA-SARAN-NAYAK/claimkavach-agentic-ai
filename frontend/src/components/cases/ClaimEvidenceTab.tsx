import React, { useState } from 'react';
import { FileText, CheckCircle2, ZoomIn, ZoomOut, Maximize2, ExternalLink, ShieldCheck, Scale, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TermTooltip } from '../ui/TermTooltip';

interface ClaimEvidenceTabProps {
  caseId: string;
  selectedDeductionId?: string;
  onBackToResults?: () => void;
}

export const ClaimEvidenceTab: React.FC<ClaimEvidenceTabProps> = ({
  caseId,
  selectedDeductionId = 'D1',
  onBackToResults,
}) => {
  const [activeRightTab, setActiveRightTab] = useState<'explanation' | 'details'>('explanation');
  const [zoom, setZoom] = useState(100);
  const [activeMobileTab, setActiveMobileTab] = useState<'policy' | 'explanation'>('policy');

  const isD1 = selectedDeductionId === 'D1';

  return (
    <div className="space-y-4">
      {/* Top Evidence Breadcrumb / Back button */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToResults}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-evergreen-700 hover:text-evergreen-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Claim Analysis Result
        </button>

        <Badge variant="default" size="sm" className="bg-evergreen-50 text-evergreen-700 border-evergreen-100">
          Viewing Evidence for Deduction {selectedDeductionId}
        </Badge>
      </div>

      {/* Main Split Layout matching the UI reference */}
      <div className="rounded-card-lg border border-border bg-surface shadow-xs overflow-hidden">
        {/* Document Toolbar */}
        <div className="px-5 py-3 border-b border-border bg-surface-warm/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium text-carbon">
            <FileText className="w-4 h-4 text-evergreen-700" />
            <span>Policy Document.pdf</span>
            <span className="text-carbon-3 ml-2">Page 3 of 4</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-surface rounded-btn border border-border px-2 py-1">
              <button
                onClick={() => setZoom((z) => Math.max(75, z - 15))}
                className="p-0.5 hover:text-carbon text-carbon-3 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-carbon px-1">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(150, z + 15))}
                className="p-0.5 hover:text-carbon text-carbon-3 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href="/api/samples/policy_sample.pdf"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-btn text-carbon-3 hover:text-carbon hover:bg-surface border border-transparent hover:border-border transition-colors"
              title="Open full document"
            >
              <Maximize2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-b border-border bg-surface-warm/40 p-1">
          <button
            onClick={() => setActiveMobileTab('policy')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-btn transition-all ${
              activeMobileTab === 'policy'
                ? 'bg-surface text-evergreen-700 shadow-xs'
                : 'text-carbon-2'
            }`}
          >
            Original Document
          </button>
          <button
            onClick={() => setActiveMobileTab('explanation')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-btn transition-all ${
              activeMobileTab === 'explanation'
                ? 'bg-surface text-evergreen-700 shadow-xs'
                : 'text-carbon-2'
            }`}
          >
            Explanation & Details
          </button>
        </div>

        {/* 2-Column Split Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
          {/* Left Column: Real Document Viewer with Yellow Highlight Box */}
          <div
            className={`md:col-span-7 p-6 bg-paper/60 border-r border-border flex items-center justify-center overflow-auto ${
              activeMobileTab === 'explanation' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div
              className="relative bg-white text-slate-800 shadow-md border border-slate-200 rounded-sm p-8 sm:p-10 w-full max-w-lg transition-transform duration-150 origin-top"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-4 border-b pb-2">
                Meridian Health — Family Floater Policy Wording (Page 3)
              </div>

              <div className="space-y-4 text-xs font-sans text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    Section 5: Coverage & Moratorium
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-2">
                    5.3 Specific waiting periods apply for knee replacement surgeries (24 months).
                  </p>
                </div>

                {/* THE HIGHLIGHTED CLAUSE 5.4 BOX */}
                <div className="relative rounded-md p-3.5 bg-amber-100/70 border border-amber-300 text-slate-900 shadow-xs">
                  <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[9px] uppercase tracking-wider">
                    Cited Clause 5.4
                  </div>
                  <h5 className="font-bold text-xs text-amber-900 mb-1 pt-0.5">
                    5.4 Moratorium Period:
                  </h5>
                  <p className="text-xs font-medium text-slate-900 leading-normal">
                    "After 48 continuous months of coverage have been completed under this policy, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud."
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 space-y-2">
                  <p>
                    5.5 The Insurer may request previous continuous renewal certificates from the portability grid.
                  </p>
                  <p>
                    5.6 Portability benefits shall accrue to all family members without break.
                  </p>
                </div>
              </div>

              {/* Watermark */}
              <div className="mt-8 pt-4 border-t text-[9px] text-slate-400 text-center font-mono">
                SYNTHETIC DEMO DOCUMENT · MERIDIAN HEALTH INSURANCE
              </div>
            </div>
          </div>

          {/* Right Column: Explanation & Details Panel */}
          <div
            className={`md:col-span-5 p-6 bg-surface flex flex-col justify-between ${
              activeMobileTab === 'policy' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div>
              {/* Right Panel Tabs */}
              <div className="flex border-b border-border pb-3 gap-6">
                <button
                  type="button"
                  onClick={() => setActiveRightTab('explanation')}
                  className={`text-xs font-bold pb-2 relative transition-colors ${
                    activeRightTab === 'explanation'
                      ? 'text-evergreen-700'
                      : 'text-carbon-3 hover:text-carbon'
                  }`}
                >
                  Explanation
                  {activeRightTab === 'explanation' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-evergreen-700 rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRightTab('details')}
                  className={`text-xs font-bold pb-2 relative transition-colors ${
                    activeRightTab === 'details'
                      ? 'text-evergreen-700'
                      : 'text-carbon-3 hover:text-carbon'
                  }`}
                >
                  Details & Citations
                  {activeRightTab === 'details' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-evergreen-700 rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeRightTab === 'explanation' ? (
                <div className="pt-5 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-success font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Why this supports you</span>
                    </div>

                    <p className="text-xs text-carbon leading-relaxed">
                      Your policy records prove <strong className="text-evergreen-700">64 months of continuous coverage</strong> from inception (1 April 2021). The insurer's repudiation notice cited an undisclosed pre-existing condition, but under Clause 5.4, the insurer is legally barred from repudiating any claim on these grounds after 48 months.
                    </p>
                  </div>

                  {/* Metadata List */}
                  <div className="p-4 rounded-card bg-surface-warm/60 border border-border space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-carbon-3">Source:</span>
                      <span className="font-medium text-carbon">Policy Document</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-carbon-3">Page:</span>
                      <span className="font-medium text-carbon font-mono">Page 3 of 4</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-carbon-3">Clause Reference:</span>
                      <span className="font-semibold text-carbon">Section 5.4 Moratorium</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/60">
                      <span className="text-carbon-3">Statutory Rule:</span>
                      <span className="font-medium text-clay-600">IRDAI Master Circular 2024</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-carbon-3">Confidence:</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-success">
                        High (92%)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-5 space-y-4 text-xs">
                  <h4 className="font-semibold text-carbon text-xs">
                    How We Reached This Conclusion
                  </h4>

                  <ol className="space-y-3 pl-4 list-decimal text-carbon-2 leading-relaxed">
                    <li>
                      <strong>Lekha (Reader)</strong> extracted inception date <span className="font-mono">2021-04-01</span> and claim hospitalization date <span className="font-mono">2026-08-14</span>.
                    </li>
                    <li>
                      <strong>Coverage Tool</strong> computed exactly <strong>64 continuous months</strong> across 4 uninterrupted policy renewals.
                    </li>
                    <li>
                      <strong>Nyaya (Judge)</strong> matched the continuous coverage against Clause 5.4 (48-month threshold) and verified repudiation is contractually barred.
                    </li>
                    <li>
                      <strong>Rakshak (Guardian)</strong> verified that the insurer's repudiation letter contains no allegation of intentional fraud.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-border mt-6">
              <a
                href="/api/samples/policy_sample.pdf"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-btn border border-border bg-surface hover:bg-surface-warm text-carbon text-xs font-semibold shadow-xs transition-colors"
              >
                <span>View Full Document</span>
                <ExternalLink className="w-3.5 h-3.5 text-carbon-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
