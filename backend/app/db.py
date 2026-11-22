import sqlite3
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from backend.app.config import DB_PATH, settings

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS app_state (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY,
    name TEXT,
    mobile TEXT,
    city TEXT,
    language TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS documents (
    doc_id TEXT PRIMARY KEY,
    case_id TEXT,
    kind TEXT,
    filename TEXT,
    bytes INTEGER,
    pages INTEGER,
    text_json TEXT,
    path TEXT,
    sha256 TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS cases (
    case_id TEXT PRIMARY KEY,
    title TEXT,
    insurer TEXT,
    policy_no TEXT,
    status TEXT,
    mode TEXT,
    language TEXT,
    scenario TEXT,
    facts_json TEXT,
    verdict_json TEXT,
    disputed_total INTEGER,
    recoverable_total INTEGER,
    recovered_total INTEGER DEFAULT 0,
    created_virtual TEXT,
    resolved_virtual TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS ladder_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    step TEXT,
    status TEXT,
    opened_on TEXT,
    deadline_on TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    direction TEXT,
    step TEXT,
    from_addr TEXT,
    to_addr TEXT,
    subject TEXT,
    body TEXT,
    status TEXT,
    simulated INTEGER DEFAULT 1,
    virtual_date TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    action TEXT,
    step TEXT,
    draft_subject TEXT,
    draft_body TEXT,
    evidence_json TEXT,
    status TEXT,
    created_virtual TEXT,
    decided_at TEXT
);

CREATE TABLE IF NOT EXISTS scheduled_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    due_virtual TEXT,
    kind TEXT,
    payload_json TEXT,
    done INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS trace_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    ts TEXT,
    virtual_date TEXT,
    agent TEXT,
    type TEXT,
    title TEXT,
    detail TEXT,
    data_json TEXT,
    source TEXT,
    judge_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_trace_case ON trace_events(case_id, id);

CREATE TABLE IF NOT EXISTS consents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    purpose TEXT,
    granted INTEGER,
    ts TEXT
);

CREATE TABLE IF NOT EXISTS llm_cache (
    key TEXT PRIMARY KEY,
    response_json TEXT,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT,
    title TEXT,
    body TEXT,
    link TEXT,
    read INTEGER DEFAULT 0,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS metrics (
    case_id TEXT PRIMARY KEY,
    llm_calls INTEGER DEFAULT 0,
    tools_called INTEGER DEFAULT 0,
    quotes_verified INTEGER DEFAULT 0,
    quotes_failed INTEGER DEFAULT 0,
    pii_blocked INTEGER DEFAULT 0,
    deadlines_met INTEGER DEFAULT 0,
    deadlines_total INTEGER DEFAULT 0,
    bytes_retained INTEGER DEFAULT 0
);
"""

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db() -> None:
    conn = get_connection()
    with conn:
        conn.executescript(SCHEMA_SQL)
        # Check initial state
        cur = conn.cursor()
        cur.execute("SELECT value FROM app_state WHERE key = 'virtual_now'")
        row = cur.fetchone()
        if not row:
            conn.execute(
                "INSERT INTO app_state (key, value) VALUES ('virtual_now', ?)",
                (settings.demo_start_date,)
            )
        
        # Check user profile seed (Priya Raghavan)
        cur.execute("SELECT id FROM user_profiles LIMIT 1")
        if not cur.fetchone():
            now_iso = datetime.now(timezone.utc).isoformat()
            conn.execute(
                """INSERT INTO user_profiles (id, name, mobile, city, language, created_at)
                   VALUES (1, 'Priya Raghavan', '9840123456', 'Chennai', 'en', ?)""",
                (now_iso,)
            )
    conn.close()

def reset_db() -> None:
    """Wipes all mutable data, keeping schema and initial state."""
    conn = get_connection()
    tables = [
        "documents", "cases", "ladder_steps", "messages", "approvals",
        "scheduled_events", "trace_events", "consents", "llm_cache",
        "notifications", "metrics"
    ]
    with conn:
        for t in tables:
            conn.execute(f"DELETE FROM {t}")
        conn.execute("UPDATE app_state SET value = ? WHERE key = 'virtual_now'", (settings.demo_start_date,))
    conn.close()
