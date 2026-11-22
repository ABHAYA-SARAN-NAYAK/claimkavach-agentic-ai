import React from 'react';
import { TraceEvent } from '../../lib/types';
import { AgentAvatar } from '../brand/AgentAvatar';
import { formatDate } from '../../lib/format';

interface ActivityFeedProps {
  events: TraceEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  const latestEvents = [...events].reverse().slice(0, 8);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-content">Autonomous Agent Feed</h3>
        <span className="text-[11px] text-content-3 font-mono">Live</span>
      </div>

      <div className="space-y-2.5">
        {latestEvents.length === 0 ? (
          <p className="text-xs text-content-3 italic py-4 text-center">
            No agent activity yet. Start a case to see the live feed.
          </p>
        ) : (
          latestEvents.map((ev, i) => (
            <div
              key={ev.id || i}
              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-2/60 transition-colors"
            >
              <AgentAvatar agent={ev.agent} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-content truncate">{ev.title}</p>
                <p className="text-[11px] text-content-3 truncate">
                  {ev.detail || ev.judge_note || 'Autonomous action executed'}
                </p>
              </div>
              <span className="text-[10px] font-mono text-content-3 flex-shrink-0">
                {formatDate(ev.virtual_date)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
