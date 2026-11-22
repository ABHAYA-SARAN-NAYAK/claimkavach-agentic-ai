import React from 'react';
import { UploadCloud, FileCheck, ShieldCheck, Send } from 'lucide-react';

export const HowSteps: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload 3 Papers',
      desc: 'Drop in your policy document, hospital final bill, and the claim settlement or rejection letter.',
      icon: <UploadCloud className="w-6 h-6 text-brand-500" />,
    },
    {
      num: '02',
      title: 'AI Checks the Reasons',
      desc: 'Our specialized agents check continuous cover, room rent caps, and moratorium clauses line by line.',
      icon: <FileCheck className="w-6 h-6 text-amber-500" />,
    },
    {
      num: '03',
      title: 'You Approve the Draft',
      desc: 'Review the ground-level complaint citing exact policy clauses. Nothing is ever sent without your one-tap approval.',
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
    },
    {
      num: '04',
      title: 'We Chase & Escalate',
      desc: 'We enforce 15-day statutory response windows, escalate on silence, and prepare binding Ombudsman packs.',
      icon: <Send className="w-6 h-6 text-rose-500" />,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            How It Works
          </span>
          <h2 className="text-3xl font-bold text-content">
            Four simple steps. Zero chasing.
          </h2>
          <p className="text-sm text-content-2">
            Built for families who need clarity, speed, and strict legal grounding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="rounded-2xl border border-border bg-surface p-6 shadow-xs relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {st.icon}
              </div>
              <span className="text-xs font-mono font-bold text-brand-500 mb-1 block">
                STEP {st.num}
              </span>
              <h3 className="text-base font-bold text-content mb-2">{st.title}</h3>
              <p className="text-xs text-content-2 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
