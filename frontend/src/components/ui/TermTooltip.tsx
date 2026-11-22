import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface TermTooltipProps {
  term: string;
  definition?: string;
  children?: React.ReactNode;
  className?: string;
}

const GLOSSARY_MAP: Record<string, string> = {
  moratorium:
    'Under IRDAI regulations, after 48 continuous months of coverage, an insurer cannot deny or reject claims on the grounds of pre-existing diseases, non-disclosure, or misrepresentation (except in cases of established fraud).',
  'proportionate deduction':
    'If a patient chooses a room with higher rent than the policy limit, the insurer scales down associated medical treatment charges proportionately. However, ICU and fixed-cost implants/medicines cannot be proportionately deducted.',
  repudiation:
    'Total rejection and cancellation of an insurance claim by the insurer based on an alleged policy violation or exclusion.',
  ombudsman:
    'Insurance Ombudsman: An independent statutory body appointed under the Insurance Ombudsman Rules, 2017 to resolve personal health insurance disputes up to ₹50 Lakhs free of cost.',
  'pre-existing condition':
    'Any condition, ailment, injury or disease that was diagnosed by a physician or for which medical advice or treatment was recommended or received within 48/36 months prior to the policy start date.',
};

export const TermTooltip: React.FC<TermTooltipProps> = ({
  term,
  definition,
  children,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const key = term.toLowerCase().trim();
  const text = definition || GLOSSARY_MAP[key] || 'Statutory insurance term under IRDAI regulations.';

  return (
    <span className={clsx('relative inline-flex items-center gap-1 group', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center gap-1 text-inherit underline decoration-dotted decoration-clay-500/60 underline-offset-2 hover:decoration-clay-600 transition-colors"
      >
        <span>{children || term}</span>
        <HelpCircle className="w-3.5 h-3.5 text-sage opacity-75 group-hover:opacity-100" />
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-surface text-carbon text-xs rounded-card border border-border shadow-md pointer-events-none transition-all duration-150 animate-fade-in"
        >
          <span className="font-semibold block text-evergreen-700 dark:text-evergreen-500 mb-1 capitalize">
            {term}
          </span>
          <span className="text-carbon-2 leading-relaxed block">{text}</span>
          <span className="block mt-1.5 text-[10px] text-sage">
            IRDAI Master Circular Guidance
          </span>
        </span>
      )}
    </span>
  );
};
