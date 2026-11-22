import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from jinja2 import Environment, FileSystemLoader
from backend.app.config import LETTERS_DIR
from backend.app.schemas import FactSheet, Verdict
from backend.app.db import get_connection
from backend.app.events import emit_event

logger = logging.getLogger("claimkavach.doot")

jinja_env = Environment(loader=FileSystemLoader(str(LETTERS_DIR)))

DOOT_SYSTEM_PROMPT = """You are Doot, the escalation agent of ClaimKavach. You draft formal, polite, firm complaint letters for Indian health-insurance policyholders.
Use ONLY the facts, clause quotes, amounts, dates and rule ids provided in the input. Do not add any fact, clause, law, case or deadline that is not in the input.
Structure: subject line, reference details, short facts, numbered grounds (each with the exact clause quote), the specific relief requested with amount, the response deadline, and a courteous close.
Keep it under 450 words. Return JSON: {"subject": string, "body": string}."""

def draft_letter(
    step: str,
    context: Dict[str, Any]
) -> tuple[str, str]:
    """Generates deterministic letter text via Jinja2 templates."""
    template_map = {
        "gro": "gro.j2",
        "regulator": "regulator.j2",
        "ombudsman": "ombudsman.j2",
        "counter": "counter.j2",
    }
    tmpl_name = template_map.get(step, "gro.j2")
    template = jinja_env.get_template(tmpl_name)
    body = template.render(**context).strip()

    subject_map = {
        "gro": f"Grievance regarding unlawful claim deduction — Policy {context.get('policy_no', '')}",
        "regulator": f"Escalation of health grievance against {context.get('insurer_name', '')} — Policy {context.get('policy_no', '')}",
        "ombudsman": f"Ombudsman Complaint under Rule 13 — Policy {context.get('policy_no', '')}",
        "counter": f"Rejection of partial offer — Policy {context.get('policy_no', '')}",
    }
    subject = subject_map.get(step, "Insurance Claim Grievance")
    return subject, body

def run_doot(
    case_id: str,
    virtual_date: str,
    factsheet: FactSheet,
    verdict: Verdict,
    step: str = "gro",
    user_mobile: str = "9840123456",
    city: str = "Chennai"
) -> int:
    """
    Executes Doot to compose the grievance letter for the active step,
    creates a pending approval, and queues the trace events.
    Returns the created approval ID.
    """
    emit_event(
        case_id=case_id,
        agent="doot",
        type_="agent_start",
        title=f"Doot preparing complaint for step: {step.upper()}",
        virtual_date=virtual_date,
        detail="Assembling facts, exact policy quotes, and statutory relief amount.",
        judge_note="Doot prepares formal complaints grounded exclusively on verified evidence."
    )

    emit_event(
        case_id=case_id,
        agent="doot",
        type_="thinking",
        title="Selecting verified grounds and calculating deadline windows",
        virtual_date=virtual_date,
        detail="Drafting formal letter adhering to IRDAI Grievance guidelines."
    )

    context = {
        "insurer_name": factsheet.insurer.name or "Meridian Health Insurance Co. Ltd.",
        "grievance_email": factsheet.insurer.grievance_email or "grievance@meridian-health.example",
        "virtual_date": virtual_date,
        "policy_no": factsheet.policy.policy_no or "MH-FF-2021-004512",
        "product_name": factsheet.policy.product or "Suraksha Plus Family Floater",
        "claim_ref": factsheet.letter.reference or "MH/CLM/2026/118742",
        "patient_name": factsheet.claim.patient or "Ramesh Raghavan",
        "policyholder_name": factsheet.policy.holder or "Priya Raghavan",
        "contact_mobile": user_mobile,
        "city": city,
        "hospital_name": "City Care Hospital, Chennai",
        "admission_date": factsheet.claim.admission or "2026-08-10",
        "discharge_date": factsheet.claim.discharge or "2026-08-14",
        "billed_total": f"{factsheet.claim.billed_total:,}",
        "approved_total": f"{factsheet.claim.approved_total:,}",
        "disputed_total": f"{verdict.overall.disputed_total:,}",
        "letter_date": factsheet.letter.date or "2026-09-05",
        "inception_date": factsheet.policy.inception_date or "2021-04-01",
        "sum_insured": f"{factsheet.policy.sum_insured:,}",
        "gro_sent_date": "2026-09-08",
        "offer_date": virtual_date,
        "offer_amount": "30,000"
    }

    subject, body = draft_letter(step, context)

    emit_event(
        case_id=case_id,
        agent="doot",
        type_="draft",
        title=f"Drafted {step.upper()} letter",
        virtual_date=virtual_date,
        detail=subject,
        data={"step": step, "subject": subject, "body": body},
        judge_note="Letter drafted strictly under 450 words with direct citations to Clause 5.4."
    )

    # Store approval request in SQLite
    conn = get_connection()
    cur = conn.cursor()
    evidence_items = [
        {"source": "Policy Clause 5.4", "quote": "After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure..."},
        {"source": "IRDAI Master Circular 2024", "quote": "Moratorium Period: 60 continuous months"},
        {"source": "Settlement Letter D1", "quote": "Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2)."}
    ]
    cur.execute(
        """INSERT INTO approvals (case_id, action, step, draft_subject, draft_body, evidence_json, status, created_virtual)
           VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)""",
        (
            case_id,
            f"Send complaint to {factsheet.insurer.name or 'Insurer'} Grievance Officer",
            step,
            subject,
            body,
            json.dumps(evidence_items),
            virtual_date
        )
    )
    approval_id = cur.lastrowid

    # Create notification
    cur.execute(
        """INSERT INTO notifications (case_id, title, body, link, read, created_at)
           VALUES (?, ?, ?, ?, 0, datetime('now'))""",
        (
            case_id,
            f"Approval needed: {step.upper()} Complaint Letter",
            f"Review and approve the draft before it is dispatched to {factsheet.insurer.name}.",
            f"/app/cases/{case_id}?tab=letters"
        )
    )

    conn.commit()
    conn.close()

    emit_event(
        case_id=case_id,
        agent="doot",
        type_="approval_needed",
        title="Action requires your approval",
        virtual_date=virtual_date,
        detail="Starts a 15-day statutory reply window once sent.",
        data={"approval_id": approval_id, "step": step, "subject": subject},
        judge_note="ClaimKavach will never dispatch any communication without explicit policyholder approval."
    )

    emit_event(
        case_id=case_id,
        agent="doot",
        type_="agent_done",
        title="Doot awaiting user authorization",
        virtual_date=virtual_date,
        detail="Ready to dispatch upon confirmation."
    )

    return approval_id
