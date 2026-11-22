import { useEffect } from 'react';
import { TraceEvent } from './types';

export function connectCaseSSE(
  caseId: string,
  onEvent: (event: TraceEvent) => void,
  onError?: (err: any) => void
): () => void {
  const url = `/api/cases/${caseId}/events`;
  const eventSource = new EventSource(url);

  eventSource.addEventListener('trace', (e: MessageEvent) => {
    try {
      const data: TraceEvent = JSON.parse(e.data);
      onEvent(data);
    } catch (err) {
      console.error('Failed to parse SSE trace payload:', err);
    }
  });

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}

export function useSSE(caseId: string, onEvent: (event: TraceEvent) => void) {
  useEffect(() => {
    if (!caseId) return;
    return connectCaseSSE(caseId, onEvent);
  }, [caseId]);
}
