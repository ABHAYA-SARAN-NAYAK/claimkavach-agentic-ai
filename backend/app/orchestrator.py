import json
import logging
import threading
from typing import Any, Dict, List, Optional
from backend.app.config import settings
from backend.app.db import get_connection
from backend.app.clock import get_virtual_now
from backend.app.ladder import init_case_ladder, update_step_status
from backend.app.agents.rakshak import check_consents, verify_evidence, scan_and_redact_pii
from backend.app.agents.lekha import run_lekha
from backend.app.agents.nyaya import run_nyaya
from backend.app.agents.doot import run_doot
from backend.app.events import emit_event

logger = logging.getLogger("claimkavach.orchestrator")

def run_case_pipeline(
    case_id: str,
    doc_ids: Dict[str, str],
    language: str = "en",
    consents_granted: Optional[List[str]] = None,
    api_key: Optional[str] = None,
    mode: str = "auto",
    scenario: str = "judge_demo"
) -> None:
    """
    Runs the multi-agent pipeline sequentially in a background worker thread.
    Persists intermediate results to SQLite after every stage.
    """
    virtual_date = get_virtual_now()

    # Stage 0: Rakshak Consent Gate
    if not check_consents(case_id, consents_granted or ["analyse_ai", "draft_complaints", "approval_required"], virtual_date):
        logger.error(f"Case {case_id} halted: consent not granted.")
        return

    # Initialize ladder
    init_case_ladder(case_id, virtual_date)

    # Fetch document texts
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT kind, text_json FROM documents WHERE case_id = ?", (case_id,))
    doc_rows = cur.fetchall()
    conn.close()

    doc_texts: Dict[str, str] = {}
    for r in doc_rows:
        try:
            pages = json.loads(r["text_json"])
            full_text = "\n".join(p.get("text", "") for p in pages)
            doc_texts[r["kind"]] = full_text
        except Exception:
            doc_texts[r["kind"]] = ""

    # Stage 1: Lekha (Reader)
    factsheet = run_lekha(
        case_id=case_id,
        virtual_date=virtual_date,
        doc_texts=doc_texts,
        api_key=api_key,
        mode=mode,
        scenario=scenario
    )

    # Persist factsheet
    conn = get_connection()
    with conn:
        conn.execute(
            """UPDATE cases SET
                 insurer = ?,
                 policy_no = ?,
                 facts_json = ?
               WHERE case_id = ?""",
            (
                factsheet.insurer.name,
                factsheet.policy.policy_no,
                factsheet.model_dump_json(),
                case_id
            )
        )
    conn.close()

    # Stage 2: Nyaya (Judge)
    verdict = run_nyaya(
        case_id=case_id,
        virtual_date=virtual_date,
        factsheet=factsheet,
        language=language,
        api_key=api_key,
        mode=mode,
        scenario=scenario
    )

    # Stage 3: Rakshak Evidence Verification
    combined_docs = " ".join(doc_texts.values())
    verify_evidence(case_id, virtual_date, verdict, combined_docs)

    # Persist verdict & amounts
    conn = get_connection()
    with conn:
        conn.execute(
            """UPDATE cases SET
                 verdict_json = ?,
                 disputed_total = ?,
                 recoverable_total = ?
               WHERE case_id = ?""",
            (
                verdict.model_dump_json(),
                verdict.overall.disputed_total,
                verdict.overall.likely_recoverable,
                case_id
            )
        )
    conn.close()

    # Update Step 1 (Review) -> done, Step 2 (GRO) -> active
    update_step_status(case_id, "review", status="done", notes="Analysis and clause cross-verification completed.")
    update_step_status(case_id, "gro", status="active", opened_on=virtual_date, notes="Drafting formal grievance for Insurer Grievance Redressal Officer.")

    # Stage 4: Doot (Escalator) - drafts GRO letter & creates pending approval
    run_doot(case_id, virtual_date, factsheet, verdict, step="gro")

def trigger_pipeline_async(
    case_id: str,
    doc_ids: Dict[str, str],
    language: str = "en",
    consents_granted: Optional[List[str]] = None,
    api_key: Optional[str] = None,
    mode: str = "auto",
    scenario: str = "judge_demo"
) -> threading.Thread:
    t = threading.Thread(
        target=run_case_pipeline,
        args=(case_id, doc_ids, language, consents_granted, api_key, mode, scenario),
        daemon=True
    )
    t.start()
    return t
