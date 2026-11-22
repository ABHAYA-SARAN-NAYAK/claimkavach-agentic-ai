import React from 'react';
import { ExternalLink, TrendingUp, AlertTriangle, Users, FileX } from 'lucide-react';
import { CountUp } from '../ui/CountUp';

export const ProblemStats: React.FC = () => {
  const stats = [
    {
      num: 41,
      suffix: '%',
      label: 'Spike in Health Complaints',
      detail: 'Health insurance grievances surged 41% to 1,37,361 in FY25.',
      source: 'IRDAI Report via Angel One',
      link: 'https://angelone.in',
      icon: <TrendingUp className="w-5 h-5 text-rose-500" />,
    },
    {
      num: 70,
      prefix: '~',
      suffix: '%',
      label: 'Unpaid / Refused Claims',
      detail: 'Nearly 7 in 10 complaints relate to refused, delayed or partly paid claims.',
      source: 'IRDAI Official Annual Data',
      link: 'https://angelone.in',
      icon: <FileX className="w-5 h-5 text-amber-500" />,
    },
    {
      num: 50,
      prefix: '>',
      suffix: '%',
      label: 'Faced Dispute or Deduction',
      detail: 'Over 50% of policyholders claiming in past 3 years faced denial or reduction.',
      source: 'LocalCircles / Business Today',
      link: 'https://businesstoday.in',
      icon: <AlertTriangle className="w-5 h-5 text-brand-500" />,
    },
    {
      num: 40,
      suffix: '%',
      label: 'Severe Friction Rate',
      detail: '4 in 10 claimants experience harassment or arbitrary claim cuts.',
      source: 'Hansa Research / Moneylife 2026',
      link: 'https://moneylife.in',
      icon: <Users className="w-5 h-5 text-teal-500" />,
    },
  ];

  return (
    <section className="py-16 bg-surface-2/40 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            The Healthcare Claim Crisis in India
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-content">
            When hospitals discharge, insurers repudiate.
          </h2>
          <p className="text-sm text-content-2">
            Exhausted families rarely have the legal bandwidth or stamina to read 40 pages of policy fine print or chase grievance desks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-content-3 uppercase">{s.label}</span>
                {s.icon}
              </div>

              <div>
                <div className="text-3xl font-extrabold font-mono text-content">
                  {s.prefix}
                  <CountUp end={s.num} />
                  {s.suffix}
                </div>
                <p className="text-xs text-content-2 mt-1 leading-relaxed">{s.detail}</p>
              </div>

              <div className="pt-2 border-t border-border">
                <a
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>{s.source}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory enforcement notice per PRD 1.1 */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 text-center max-w-3xl mx-auto">
          <strong>IRDAI Regulatory Precedent:</strong> In November 2026, IRDAI fined Star Health ₹2 crore for rejecting claims on untenable grounds where policyholders were left unaware of the legal basis for deductions.
        </div>
      </div>
    </section>
  );
};
