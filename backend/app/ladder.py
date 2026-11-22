import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from backend.app.db import get_connection
from backend.app.schemas import EscalationStep

LADDER_SEQUENCE = ["review", "gro", "regulator", "ombudsman", "consumer"]

def init_case_ladder(case_id: str, virtual_date: str) -> None:
    """Initializes the 5 ladder steps in the database for a new case."""
    conn = get_connection()
    with conn:
        # Step 1: Review (Active initially)
        conn.execute(
            """INSERT INTO ladder_steps (case_id, step, status, opened_on, deadline_on, notes)
               VALUES (?, 'review', 'active', ?, ?, 'Initial document reading and legal verification.')""",
            (case_id, virtual_date, virtual_date)
        )
        # Step 2: Insurer GRO (Locked until approved)
        conn.execute(
            """INSERT INTO ladder_steps (case_id, step, status, opened_on, deadline_on, notes)
               VALUES (?, 'gro', 'locked', NULL, NULL, 'Formal grievance with Insurer Grievance Redressal Officer (15-day window).')""",
            (case_id,)
        )
        # Step 3: Regulator / Bima Bharosa
        conn.execute(
            """INSERT INTO ladder_steps (case_id, step, status, opened_on, deadline_on, notes)
               VALUES (?, 'regulator', 'locked', NULL, NULL, 'IRDAI Bima Bharosa regulatory complaint for non-resolution.')""",
            (case_id,)
        )
        # Step 4: Insurance Ombudsman
        conn.execute(
            """INSERT INTO ladder_steps (case_id, step, status, opened_on, deadline_on, notes)
               VALUES (?, 'ombudsman', 'locked', NULL, NULL, 'Quasi-judicial binding dispute representation before Ombudsman.')""",
            (case_id,)
        )
        # Step 5: Consumer Commission
        conn.execute(
            """INSERT INTO ladder_steps (case_id, step, status, opened_on, deadline_on, notes)
               VALUES (?, 'consumer', 'locked', NULL, NULL, 'Consumer Disputes Redressal Commission (User option).')""",
            (case_id,)
        )
    conn.close()

def get_ladder_steps(case_id: str) -> List[Dict[str, Any]]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, case_id, step, status, opened_on, deadline_on, notes
           FROM ladder_steps WHERE case_id = ? ORDER BY id ASC""",
        (case_id,)
    )
    rows = cur.fetchall()
    conn.close()

    steps = []
    for r in rows:
        steps.append({
            "id": r["id"],
            "case_id": r["case_id"],
            "step": r["step"],
            "status": r["status"],
            "opened_on": r["opened_on"],
            "deadline_on": r["deadline_on"],
            "notes": r["notes"]
        })
    return steps

def update_step_status(
    case_id: str,
    step: str,
    status: str,
    opened_on: Optional[str] = None,
    deadline_on: Optional[str] = None,
    notes: Optional[str] = None
) -> None:
    conn = get_connection()
    with conn:
        updates = ["status = ?"]
        params = [status]
        if opened_on is not None:
            updates.append("opened_on = ?")
            params.append(opened_on)
        if deadline_on is not None:
            updates.append("deadline_on = ?")
            params.append(deadline_on)
        if notes is not None:
            updates.append("notes = ?")
            params.append(notes)
        params.extend([case_id, step])
        conn.execute(f"UPDATE ladder_steps SET {', '.join(updates)} WHERE case_id = ? AND step = ?", params)
    conn.close()
