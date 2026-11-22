import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List, Optional, Set
from backend.app.db import get_connection
from backend.app.schemas import TraceEvent

logger = logging.getLogger("claimkavach.events")

# Case-specific and global listeners
_subscribers: Dict[str, Set[asyncio.Queue]] = {}
_twin_subscribers: Set[asyncio.Queue] = set()
_lock = asyncio.Lock()

def persist_trace_event(event: TraceEvent) -> int:
    """Inserts a trace event into the SQLite database and returns the generated row id."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """INSERT INTO trace_events (case_id, ts, virtual_date, agent, type, title, detail, data_json, source, judge_note)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            event.case_id,
            event.ts,
            event.virtual_date,
            event.agent,
            event.type,
            event.title,
            event.detail,
            json.dumps(event.data),
            event.source,
            event.judge_note,
        )
    )
    event_id = cur.lastrowid
    conn.commit()
    conn.close()
    return event_id

async def broadcast_event(case_id: str, event_dict: Dict[str, Any]) -> None:
    """Delivers an event dictionary to all connected SSE clients."""
    async with _lock:
        queues = list(_subscribers.get(case_id, []))
    for q in queues:
        try:
            q.put_nowait(event_dict)
        except Exception:
            pass

async def broadcast_twin_event(event_dict: Dict[str, Any]) -> None:
    """Delivers a twin-related event to all twin viewers."""
    async with _lock:
        queues = list(_twin_subscribers)
    for q in queues:
        try:
            q.put_nowait(event_dict)
        except Exception:
            pass

def emit_event(
    case_id: str,
    agent: str,
    type_: str,
    title: str,
    virtual_date: str,
    detail: Optional[str] = None,
    data: Optional[Dict[str, Any]] = None,
    source: str = "local",
    judge_note: Optional[str] = None,
) -> TraceEvent:
    """Synchronous / thread-safe helper to persist and queue an event."""
    ts = datetime.now(timezone.utc).isoformat()
    ev = TraceEvent(
        ts=ts,
        virtual_date=virtual_date,
        case_id=case_id,
        agent=agent, # type: ignore
        type=type_, # type: ignore
        title=title,
        detail=detail,
        data=data or {},
        source=source, # type: ignore
        judge_note=judge_note,
    )
    event_id = persist_trace_event(ev)
    ev.id = event_id

    event_payload = ev.model_dump()

    # Try dispatching to event loop if running
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_event(case_id, event_payload))
    except RuntimeError:
        # Not in async context; try getting or creating
        pass

    return ev

async def subscribe_case_events(
    case_id: str,
    last_event_id: Optional[int] = None
) -> AsyncGenerator[Dict[str, Any], None]:
    """Yields SSE-compatible event dictionaries for a given case."""
    q: asyncio.Queue = asyncio.Queue()
    async with _lock:
        if case_id not in _subscribers:
            _subscribers[case_id] = set()
        _subscribers[case_id].add(q)

    try:
        # Send back-history if last_event_id or initial connect
        conn = get_connection()
        cur = conn.cursor()
        if last_event_id is not None:
            cur.execute(
                """SELECT id, ts, virtual_date, case_id, agent, type, title, detail, data_json, source, judge_note
                   FROM trace_events WHERE case_id = ? AND id > ? ORDER BY id ASC""",
                (case_id, last_event_id)
            )
        else:
            cur.execute(
                """SELECT id, ts, virtual_date, case_id, agent, type, title, detail, data_json, source, judge_note
                   FROM trace_events WHERE case_id = ? ORDER BY id ASC""",
                (case_id,)
            )
        rows = cur.fetchall()
        conn.close()

        for r in rows:
            ev = {
                "id": r["id"],
                "ts": r["ts"],
                "virtual_date": r["virtual_date"],
                "case_id": r["case_id"],
                "agent": r["agent"],
                "type": r["type"],
                "title": r["title"],
                "detail": r["detail"],
                "data": json.loads(r["data_json"]) if r["data_json"] else {},
                "source": r["source"],
                "judge_note": r["judge_note"],
            }
            yield {"event": "trace", "id": str(r["id"]), "data": json.dumps(ev)}

        # Stream new events
        while True:
            ev_data = await q.get()
            yield {"event": "trace", "id": str(ev_data.get("id", "")), "data": json.dumps(ev_data)}
    finally:
        async with _lock:
            if case_id in _subscribers and q in _subscribers[case_id]:
                _subscribers[case_id].remove(q)
                if not _subscribers[case_id]:
                    del _subscribers[case_id]

async def subscribe_twin_events() -> AsyncGenerator[Dict[str, Any], None]:
    q: asyncio.Queue = asyncio.Queue()
    async with _lock:
        _twin_subscribers.add(q)
    try:
        while True:
            ev_data = await q.get()
            yield {"event": "twin", "data": json.dumps(ev_data)}
    finally:
        async with _lock:
            _twin_subscribers.discard(q)
