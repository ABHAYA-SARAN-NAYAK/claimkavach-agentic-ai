import React from 'react';
import { motion } from 'framer-motion';
import { CountUp } from '../ui/CountUp';
import { Printer, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShieldSuccessProps {
  recoveredAmount: number;
  caseTitle?: string;
  insurer?: string;
  onPrint?: () => void;
}

export const ShieldSuccess: React.FC<ShieldSuccessProps> = ({
  recoveredAmount,
  caseTitle = 'Knee Replacement Treatment',
  insurer = 'Meridian Health Insurance',
  onPrint,
}) => {
  return (
    <div className="relative overflow-hidden rounded-card border border-success/30 bg-surface shadow-sm p-8 text-center my-6">
      {/* Soft warm green glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-success-bg/60 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
        {/* Animated shield draw */}
        <div className="w-16 h-16 mb-4 text-success">
          <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
            <motion.path
              d="M24 4.5L42 11V25C42 35 34.5 44 24 47C13.5 44 6 35 6 25V11L24 4.5Z"
              stroke="#2F8F5B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(47, 143, 91, 0.08)"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="m16 24 5.5 5.5 11-11"
              stroke="#2F8F5B"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 } as any}
              animate={{ pathLength: 1 } as any}
              transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
            />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-bg text-success-text text-xs font-semibold uppercase tracking-wider mb-2">
          <CheckCircle className="w-3.5 h-3.5" />
          Dispute Resolved & Recovered
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-carbon mb-2 tabular-nums">
          <CountUp end={recoveredAmount} isCurrency duration={1200} />
        </h2>

        <p className="text-sm text-carbon-2 mb-6">
          Recovered for your family. {insurer} conceded continuous coverage under the statutory Moratorium period.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint || (() => window.print())}
            className="border-border hover:bg-surface-warm gap-1.5 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print case summary
          </Button>
        </div>
      </div>
    </div>
  );
};
