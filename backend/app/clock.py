from datetime import date, datetime, timedelta
from typing import List, Optional
from backend.app.config import settings
from backend.app.db import get_connection

DEFAULT_START = settings.demo_start_date

def get_virtual_now() -> str:
    """Returns the current virtual date string (YYYY-MM-DD)."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT value FROM app_state WHERE key = 'virtual_now'")
    row = cur.fetchone()
    conn.close()
    if row and row["value"]:
        return row["value"]
    return DEFAULT_START

def set_virtual_now(new_date_str: str) -> str:
    """Sets virtual date to an explicit YYYY-MM-DD."""
    # Validate date
    datetime.strptime(new_date_str, "%Y-%m-%d")
    conn = get_connection()
    with conn:
        conn.execute(
            "INSERT INTO app_state (key, value) VALUES ('virtual_now', ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (new_date_str,)
        )
    conn.close()
    return new_date_str

def advance_virtual_days(days: int) -> str:
    """Advances virtual date by N days and returns new YYYY-MM-DD."""
    current = get_virtual_now()
    cur_date = datetime.strptime(current, "%Y-%m-%d").date()
    new_date = cur_date + timedelta(days=days)
    return set_virtual_now(new_date.strftime("%Y-%m-%d"))

def reset_virtual_clock() -> str:
    """Resets virtual date back to DEMO_START_DATE."""
    return set_virtual_now(DEFAULT_START)

def parse_date(d_str: str) -> date:
    return datetime.strptime(d_str, "%Y-%m-%d").date()

def format_date(d: date) -> str:
    return d.strftime("%Y-%m-%d")
