import React, { useState, useEffect, useRef } from 'react';
import { TraceEvent, AgentName } from '../../lib/types';
import { AgentAvatar } from '../brand/AgentAvatar';
import { CopyButton } from '../ui/CopyButton';
import { Pause, Play, Filter, ShieldAlert, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDate } from '../../lib/format';

interface AgentLogProps {
  events: TraceEvent[];
}

export const AgentLog: React.FC<AgentLogProps> = ({ events }) => {
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = events.filter((e) => {
    if (filterAgent === 'all') return true;
    return e.agent.toLowerCase() === filterAgent.toLowerCase();
  });

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filtered.length, autoScroll]);

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const jsonDump = JSON.stringify(events, null, 2);

  return (
    <div className="flex flex-col h-[650px] rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
      {/* Log Header Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2/60 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-content">
            Live Autonomous Agent Trace
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-content-3">
            {filtered.length} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Agent Filter */}
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="text-xs bg-surface border border-border rounded-lg px-2.5 py-1 text-content font-medium focus:outline-none"
          >
            <option value="all">All Agents</option>
            <option value="lekha">Lekha (Reader)</option>
            <option value="nyaya">Nyaya (Judge)</option>
            <option value="doot">Doot (Escalator)</option>
            <option value="rakshak">Rakshak (Guardian)</option>
            <option value="system">System</option>
          </select>

          {/* Autoscroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors',
              autoScroll
                ? 'bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300'
                : 'bg-surface border-border text-content-3 hover:text-content'
            )}
            title={autoScroll ? 'Pause Autoscroll' : 'Resume Autoscroll'}
          >
            {autoScroll ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{autoScroll ? 'Auto-scroll On' : 'Paused'}</span>
          </button>

          {/* Copy Trace JSON */}
          <CopyButton text={jsonDump} />
        </div>
      </div>

      {/* Events List */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 font-sans text-xs"
        aria-live="polite"
      >
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-content-3 text-xs italic">
            Waiting for agent events...
          </div>
        ) : (
          filtered.map((ev, index) => {
            const isTool = ev.type === 'tool_call' || ev.type === 'tool_result';
            const isGuardrail = ev.type === 'guardrail';
            const hasData = ev.data && Object.keys(ev.data).length > 0;
            const isExpanded = !!expandedRows[ev.id || index];

            return (
              <div
                key={ev.id || index}
                className={clsx(
                  'rounded-xl border p-3 transition-colors',
                  isGuardrail
                    ? 'border-danger/30 bg-danger-bg/20 dark:bg-danger-bg/10'
                    : isTool
                    ? 'border-border bg-surface-2/40'
                    : 'border-border bg-surface hover:bg-surface-2/30'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AgentAvatar agent={ev.agent} size="sm" />
                    <span className="font-semibold text-content text-xs">{ev.title}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-surface-3/50 text-content-3">
                      {ev.source}
                    </span>
                    <span className="text-[11px] font-mono text-content-3">
                      {formatDate(ev.virtual_date)}
                    </span>
                  </div>
                </div>

                {ev.detail && (
                  <p className="mt-1.5 text-xs text-content-2 leading-relaxed pl-8">
                    {ev.detail}
                  </p>
                )}

                {/* Judge Note in muted italic per PRD 12 */}
                {ev.judge_note && (
                  <p className="mt-1.5 text-[11px] text-content-3 italic pl-8">
                    "{ev.judge_note}"
                  </p>
                )}

                {/* Monospace Tool Payload */}
                {hasData && (
                  <div className="mt-2 pl-8">
                    <button
                      onClick={() => toggleExpand(ev.id || index)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide Payload' : 'View Payload JSON'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isExpanded && (
                      <pre className="mt-1.5 p-2 rounded-lg bg-surface-3/60 dark:bg-surface-2 text-[10px] font-mono overflow-x-auto text-content-2">
                        {JSON.stringify(ev.data, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
