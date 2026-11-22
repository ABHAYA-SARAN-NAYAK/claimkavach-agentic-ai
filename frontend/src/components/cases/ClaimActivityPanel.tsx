import React, { useState, useEffect } from 'react';
import { AgentAvatar } from '../brand/AgentAvatar';
import { fetchTimeline } from '../../lib/api';
import { TraceEvent, AgentName } from '../../lib/types';
import { CheckCircle2, Terminal, Sparkles, Filter } from 'lucide-react';
import { clsx } from 'clsx';

interface ClaimActivityPanelProps {
  caseId: string;
  className?: string;
}

export const ClaimActivityPanel: React.FC<ClaimActivityPanelProps> = ({ caseId, className }) => {
  const [expertMode, setExpertMode] = useState(false);
  const [events, setEvents] = useState<TraceEvent[]>([]);
  const [agentFilter, setAgentFilter] = useState<string>('all');

  useEffect(() => {
    fetchTimeline(caseId)
      .then((evts) => {
        if (Array.isArray(evts)) setEvents(evts);
      })
      .catch(() => {});
  }, [caseId]);

  const filteredEvents = events.filter((e) => {
    if (agentFilter === 'all') return true;
    return e.agent?.toLowerCase() === agentFilter.toLowerCase();
  });

  return (
    <div className={clsx('rounded-card border border-border bg-surface shadow-xs p-5 transition-all', className)}>
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-bold text-carbon text-sm">What ClaimKavach Did</h3>
          <p className="text-[11px] text-carbon-3">Autonomous agent defense execution</p>
        </div>

        <button
          type="button"
          onClick={() => setExpertMode(!expertMode)}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-btn border transition-all inline-flex items-center gap-1.5 ${
            expertMode
              ? 'bg-evergreen-50 text-evergreen-700 border-evergreen-700/40'
              : 'bg-surface-warm text-carbon-2 border-border hover:bg-border/30'
          }`}
        >
          <Terminal className="w-3 h-3" />
          {expertMode ? 'Expert View' : 'Simple Summary'}
        </button>
      </div>

      {/* Content */}
      <div className="pt-3">
        {!expertMode ? (
          /* Simple Mode: 4-6 plain lines */
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <div className="text-xs text-carbon leading-relaxed">
                <span className="font-semibold">3 documents reviewed</span>: policy wording, hospital final bill, and repudiation letter read end-to-end.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <div className="text-xs text-carbon leading-relaxed">
                <span className="font-semibold">3 deductions analyzed</span> across 14 clauses and statutory IRDAI guidelines.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
              <div className="text-xs text-carbon leading-relaxed">
                <span className="font-semibold">2 deductions verified as fair</span>: ₹22,000 proportionate deduction and ₹18,000 non-medical expenses.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-clay-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-carbon leading-relaxed">
                <span className="font-semibold text-clay-600">1 deduction worth challenging</span>: ₹60,000 repudiation violates the statutory 48-month Moratorium rule.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-evergreen-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-carbon leading-relaxed">
                <span className="font-semibold">Formal grievance drafted</span> with verified citations pointing to Clause 5.4.
              </div>
            </div>
          </div>
        ) : (
          /* Expert Mode: Full Agent Trace with badges, filter, and monospace logs */
          <div className="space-y-3">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-carbon-3 text-[10px] uppercase font-bold mr-1 flex items-center gap-1">
                <Filter className="w-2.5 h-2.5" /> Filter:
              </span>
              {['all', 'lekha', 'nyaya', 'doot', 'rakshak'].map((ag) => (
                <button
                  key={ag}
                  onClick={() => setAgentFilter(ag)}
                  className={`px-2 py-0.5 rounded-full capitalize transition-colors ${
                    agentFilter === ag
                      ? 'bg-evergreen-700 text-white font-semibold'
                      : 'bg-surface-warm text-carbon-2 hover:bg-border/40'
                  }`}
                >
                  {ag}
                </button>
              ))}
            </div>

            {/* Log Stream */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 font-mono text-[11px] pr-1">
              {filteredEvents.length === 0 ? (
                <div className="text-carbon-3 text-center py-4">No events logged for this filter.</div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-card border border-border bg-surface-warm/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-sans">
                      <div className="flex items-center gap-1.5">
                        <AgentAvatar agent={evt.agent as AgentName} size="sm" />
                        <span className="font-bold text-xs text-carbon capitalize">{evt.agent}</span>
                      </div>
                      <span className="text-[10px] text-carbon-3">
                        {evt.virtual_date || evt.ts?.slice(11, 19) || '2026-09-08'}
                      </span>
                    </div>

                    <div className="text-carbon font-semibold text-xs font-sans">
                      {evt.title}
                    </div>

                    {evt.detail && (
                      <div className="text-carbon-2 leading-relaxed break-words font-mono text-[10px]">
                        {evt.detail}
                      </div>
                    )}

                    {evt.judge_note && (
                      <div className="text-clay-600 italic text-[10px] border-t border-border/40 pt-1">
                        Note: {evt.judge_note}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 pt-1 text-[10px] text-carbon-3">
                      <span className="px-1.5 py-0.2 rounded bg-surface border border-border uppercase font-semibold">
                        source: {evt.source || 'gemini'}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-surface border border-border">
                        type: {evt.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
