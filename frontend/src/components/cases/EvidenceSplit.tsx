import React, { useState, useEffect } from 'react';
import { VerdictLine, HighlightRect } from '../../lib/types';
import { fetchHighlights } from '../../lib/api';
import { Scale, CheckCircle2, AlertCircle, FileText, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

interface EvidenceSplitProps {
  caseId: string;
  line: VerdictLine;
}

export const EvidenceSplit: React.FC<EvidenceSplitProps> = ({ caseId, line }) => {
  const [activeMobileTab, setActiveMobileTab] = useState<'policy' | 'letter'>('policy');
  const [policyHighlights, setPolicyHighlights] = useState<HighlightRect[]>([]);
  const [letterHighlights, setLetterHighlights] = useState<HighlightRect[]>([]);

  useEffect(() => {
    // Find policy quote and letter quote
    const polEv = line.evidence.find((e) => e.source === 'policy');
    const letEv = line.evidence.find((e) => e.source === 'letter');

    if (polEv) {
      fetchHighlights(caseId, 'policy', polEv.quote).then(setPolicyHighlights).catch(() => {});
    }
    if (letEv) {
      fetchHighlights(caseId, 'letter', letEv.quote).then(setLetterHighlights).catch(() => {});
    }
  }, [caseId, line]);

  // Page number for policy and letter
  const polPage = line.deduction_id === 'D1' ? 3 : line.deduction_id === 'D2' ? 2 : 4;
  const letPage = 1;

  return (
    <div className="space-y-4 rounded-2xl border border-brand-200 dark:border-brand-800 bg-surface p-5 shadow-sm">
      {/* Evidence Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
            {line.deduction_id}
          </span>
          <h3 className="text-base font-bold text-content">
            Evidence Verification for Deduction {line.deduction_id}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {line.rule_ids.map((r) => (
            <span
              key={r}
              className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 border border-brand-200 dark:border-brand-700"
            >
              Rule {r}
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex sm:hidden rounded-lg bg-surface-2 p-1 border border-border">
        <button
          onClick={() => setActiveMobileTab('policy')}
          className={clsx(
            'flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors',
            activeMobileTab === 'policy' ? 'bg-surface text-brand-600 shadow-xs' : 'text-content-3'
          )}
        >
          Your Policy Says
        </button>
        <button
          onClick={() => setActiveMobileTab('letter')}
          className={clsx(
            'flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors',
            activeMobileTab === 'letter' ? 'bg-surface text-brand-600 shadow-xs' : 'text-content-3'
          )}
        >
          Insurer Says
        </button>
      </div>

      {/* Split Viewer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left: Insurer Rejection Letter */}
        <div
          className={clsx(
            'space-y-2 rounded-xl border border-border bg-surface-2/40 p-4',
            activeMobileTab === 'policy' ? 'hidden sm:block' : 'block'
          )}
        >
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Insurer Claim Letter (Page {letPage})
            </span>
            <span className="text-[11px] font-mono text-content-3">Repudiation Ground</span>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-white shadow-xs max-h-96">
            <img
              src={`/api/cases/${caseId}/documents/demo_letter/pages/${letPage}.png`}
              alt="Rejection Letter Page 1"
              className="w-full object-contain pointer-events-none select-none"
            />
            {/* Highlight Box Overlay */}
            {letterHighlights.map((hl, idx) => (
              <div
                key={idx}
                className="absolute bg-amber-400/35 border border-amber-500 rounded-xs pointer-events-none transition-all"
                style={{
                  left: `${hl.pct_x0 * 100}%`,
                  top: `${hl.pct_y0 * 100}%`,
                  width: `${hl.pct_w * 100}%`,
                  height: `${hl.pct_h * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Policy Document Clause */}
        <div
          className={clsx(
            'space-y-2 rounded-xl border border-border bg-surface-2/40 p-4',
            activeMobileTab === 'letter' ? 'hidden sm:block' : 'block'
          )}
        >
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Your Policy Document (Page {polPage})
            </span>
            <span className="text-[11px] font-mono text-content-3">
              {line.deduction_id === 'D1' ? 'Clause 5.4' : line.deduction_id === 'D2' ? 'Clause 3.2' : 'Clause 6.1'}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-border bg-white shadow-xs max-h-96">
            <img
              src={`/api/cases/${caseId}/documents/demo_policy/pages/${polPage}.png`}
              alt={`Policy Page ${polPage}`}
              className="w-full object-contain pointer-events-none select-none"
            />
            {/* Highlight Box Overlay */}
            {policyHighlights.map((hl, idx) => (
              <div
                key={idx}
                className="absolute bg-amber-400/40 border-2 border-amber-500 rounded-xs pointer-events-none animate-pulse"
                style={{
                  left: `${hl.pct_x0 * 100}%`,
                  top: `${hl.pct_y0 * 100}%`,
                  width: `${hl.pct_w * 100}%`,
                  height: `${hl.pct_h * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Why This Matters & Tool Proof */}
      <div className="rounded-xl border border-brand-200 dark:border-brand-800/60 bg-brand-50/40 dark:bg-brand-900/10 p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-300 font-bold uppercase tracking-wider">
          <Scale className="w-4 h-4" />
          <span>Why This Evidence Matters</span>
        </div>
        <p className="text-content leading-relaxed">{line.reasoning_en}</p>

        {line.tool_results.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {line.tool_results.map((tr, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border font-mono text-[11px] text-content"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {tr.tool}: {JSON.stringify(tr.output)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
