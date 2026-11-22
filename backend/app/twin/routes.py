import json
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from backend.app.db import get_connection
from backend.app.events import subscribe_twin_events

router = APIRouter(prefix="/twin", tags=["twin"])

@router.get("/insurer/messages")
def get_insurer_messages():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, case_id, direction, step, from_addr, to_addr, subject, body, status, virtual_date, created_at
           FROM messages WHERE to_addr LIKE '%meridian%' OR from_addr LIKE '%meridian%'
           ORDER BY id DESC"""
    )
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/regulator/complaints")
def get_regulator_complaints():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, case_id, direction, step, from_addr, to_addr, subject, body, status, virtual_date, created_at
           FROM messages WHERE to_addr LIKE '%irdai%' OR from_addr LIKE '%irdai%' OR to_addr LIKE '%cioins%' OR from_addr LIKE '%cioins%'
           ORDER BY id DESC"""
    )
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/stream")
async def stream_twin():
    return EventSourceResponse(subscribe_twin_events())
