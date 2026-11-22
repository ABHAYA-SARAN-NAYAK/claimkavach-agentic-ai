import React from 'react';
import { AgentAvatar } from '../brand/AgentAvatar';
import { AgentName } from '../../lib/types';

export const AgentCards: React.FC = () => {
  const agents: Array<{
    name: AgentName;
    title: string;
    role: string;
    example: string;
    safetyRule: string;
    color: string;
  }> = [
    {
      name: 'lekha',
      title: 'Lekha',
      role: 'Document Reading Specialist',
      example: 'Parsed 4-page policy schedule, verified 64 continuous months renewal history, and identified 3 itemized deductions.',
      safetyRule: 'Never guesses missing information; drops any quote not verbatim verified against document text.',
      color: '#6D4CFF',
    },
    {
      name: 'nyaya',
      title: 'Nyaya',
      role: 'Legal & Policy Reasoning Judge',
      example: 'Determined Deduction D1 (₹60,000) was barred by Clause 5.4 Moratorium, but validated D2 and D3 as lawful.',
      safetyRule: 'Strictly prohibited from mental arithmetic; mandates deterministic tool calculation for all dates and room ratios.',
      color: '#F79009',
    },
    {
      name: 'doot',
      title: 'Doot',
      role: 'Bureaucracy Escalator & Scribe',
      example: 'Composed formal 400-word grievance to Meridian Grievance Officer and initiated 15-day countdown.',
      safetyRule: 'Cannot dispatch any message without explicit policyholder approval; strictly adheres to 450-word cap.',
      color: '#14B8A6',
    },
    {
      name: 'rakshak',
      title: 'Rakshak',
      role: 'Guardian, Privacy & Grounding Sentry',
      example: 'Masked Aadhaar numbers, verified 12/12 evidence quotes, and purged document cache upon case settlement.',
      safetyRule: 'Blocks outbound letters containing adversarial or threatening legal tones; enforces zero-retention privacy.',
      color: '#F04438',
    },
  ];

  return (
    <section className="py-20 bg-surface-2/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Specialized Architecture
          </span>
          <h2 className="text-3xl font-bold text-content">
            Meet your autonomous defense team.
          </h2>
          <p className="text-sm text-content-2">
            Each agent has a strictly partitioned responsibility, real deterministic tools, and rigorous safety guardrails.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((ag) => (
            <div
              key={ag.name}
              className="rounded-2xl border border-border bg-surface p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <AgentAvatar agent={ag.name} size="lg" />
                  <div>
                    <h3 className="text-base font-bold text-content">{ag.title}</h3>
                    <p className="text-xs text-content-3">{ag.role}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-content-3">
                      What it did in Priya's case:
                    </span>
                    <p className="text-xs text-content-2 mt-1 leading-relaxed">{ag.example}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-2 border border-border/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Safety Guardrail:
                    </span>
                    <p className="text-[11px] text-content-3 mt-0.5 leading-relaxed">
                      {ag.safetyRule}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
