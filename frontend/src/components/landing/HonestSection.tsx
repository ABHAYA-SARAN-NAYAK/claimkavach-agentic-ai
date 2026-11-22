import React from 'react';
import { ShieldAlert, Fingerprint, BookOpen } from 'lucide-react';

export const HonestSection: React.FC = () => {
  const pillars = [
    {
      title: 'Sometimes the insurer is right — we say so',
      desc: 'False hope hurts families. If room rent deductions or non-payable items match your contract, ClaimKavach tells you honestly and focuses only on what is recoverable.',
      icon: <ShieldAlert className="w-6 h-6 text-blue-500" />,
    },
    {
      title: 'Nothing is sent without your tap',
      desc: 'No rogue bots spamming companies. Every grievance letter, regulator petition, or counter-offer requires your explicit one-tap approval with an 8-second undo grace window.',
      icon: <Fingerprint className="w-6 h-6 text-brand-500" />,
    },
    {
      title: 'No made-up law or hallucinatory citations',
      desc: 'Every argument directly cites exact clause numbers from your uploaded policy PDF or verified IRDAI regulations. If an agent cannot prove a claim, it remains silent.',
      icon: <BookOpen className="w-6 h-6 text-teal-500" />,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Core Principles
          </span>
          <h2 className="text-3xl font-bold text-content">
            Honest by design. Grounded by default.
          </h2>
          <p className="text-sm text-content-2">
            Insurance dispute resolution built on transparency, dignity, and user sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-surface p-7 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-content leading-snug">{p.title}</h3>
              <p className="text-sm text-content-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
