import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../lib/store';

export const DeadlineStrip: React.FC = () => {
  const { virtualDate } = useAppStore();

  const baseDate = new Date(virtualDate);
  const days = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    days.push(d);
  }

  // Key deadlines in the demo scenario
  const keyDeadlines = ['2026-09-11', '2026-09-23', '2026-10-02', '2026-10-22'];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-bold text-content">30-Day Statutory Deadline Horizon</h3>
        </div>
        <span className="text-[11px] text-content-3 font-mono">
          Virtual Now: {virtualDate}
        </span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {days.map((day, idx) => {
          const iso = day.toISOString().split('T')[0];
          const isToday = idx === 0;
          const hasDeadline = keyDeadlines.includes(iso);
          const dayName = day.toLocaleDateString('en-US', { weekday: 'narrow' });
          const dayNum = day.getDate();

          return (
            <div
              key={iso}
              className={`flex-shrink-0 w-9 h-14 rounded-xl flex flex-col items-center justify-center border text-xs font-mono transition-colors ${
                isToday
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 font-bold text-brand-600 dark:text-brand-300'
                  : hasDeadline
                  ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-semibold'
                  : 'border-border bg-surface-2 text-content-3'
              }`}
              title={`${iso} ${hasDeadline ? '(Deadline)' : ''}`}
            >
              <span className="text-[10px] uppercase opacity-75">{dayName}</span>
              <span className="text-sm">{dayNum}</span>
              {hasDeadline && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
