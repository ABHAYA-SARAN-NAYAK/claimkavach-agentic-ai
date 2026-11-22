import io
import json
import uuid
import time
import shutil
from pathlib import Path
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, File, Header, HTTPException, Query, Request, Response, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from sse_starlette.sse import EventSourceResponse

from backend.app.config import DATA_DIR, SAMPLES_DIR, UPLOADS_DIR, settings
from backend.app.db import get_connection, reset_db
from backend.app.clock import (
    get_virtual_now, set_virtual_now, advance_virtual_days, reset_virtual_clock
)
from backend.app.schemas import (
    CreateCaseRequest, AdvanceClockRequest, SetClockRequest,
    JudgeConfigRequest, ApprovalActionRequest
)
from backend.app.tools.pdfs import process_pdf
from backend.app.tools.highlight import find_highlights
from backend.app.tools.rules import load_rules
from backend.app.events import subscribe_case_events, emit_event
from backend.app.ladder import get_ladder_steps
from backend.app.twin.engine import (
    deliver_outbound_message, process_scheduled_ticks, get_judge_config, set_judge_config
)
from backend.app.orchestrator import trigger_pipeline_async, run_case_pipeline
from backend.app.letters.evidence_pack import generate_evidence_pack_pdf

router = APIRouter(prefix="/api", tags=["api"])

# Undo buffer: approval_id -> {deadline: float, timer_thread}
_undo_buffer: Dict[int, float] = {}

# --------------------
# System & Config
# --------------------

@router.get("/health")
def health_check():
    db_ok = False
    try:
        conn = get_connection()
        conn.execute("SELECT 1")
        conn.close()
        db_ok = True
    except Exception:
        pass
    return {
        "ok": db_ok,
        "db": db_ok,
        "mode": settings.default_mode,
        "virtual_now": get_virtual_now()
    }

@router.get("/config")
def get_config():
    return {
        "model": settings.gemini_model,
        "fallback_model": settings.gemini_fallback_model,
        "default_mode": settings.default_mode,
        "pacing": settings.demo_pacing,
        "has_env_key": bool(settings.gemini_api_key and settings.gemini_api_key.strip()),
        "virtual_now": get_virtual_now(),
        "judge_config": get_judge_config(),
    }

@router.post("/settings/test-key")
def test_gemini_key(
    x_gemini_key: Optional[str] = Header(None),
    x_gemini_model: Optional[str] = Header(None),
    x_gemini_fallback_model: Optional[str] = Header(None)
):
    key = x_gemini_key or settings.gemini_api_key
    if not key:
        raise HTTPException(status_code=400, detail="No Gemini API key provided.")
    
    primary = x_gemini_model or settings.gemini_model
    backup = x_gemini_fallback_model or settings.gemini_fallback_model

    try:
        from google import genai
        start = time.time()
        client = genai.Client(api_key=key)
        
        # Try primary model
        used_model = primary
        try:
            resp = client.models.generate_content(
                model=primary,
                contents="Say 'OK' in one word."
            )
        except Exception as exc:
            err = str(exc).lower()
            if ("429" in err or "quota" in err or "resource_exhausted" in err or "not found" in err or "404" in err) and backup != primary:
                used_model = backup
                resp = client.models.generate_content(
                    model=backup,
                    contents="Say 'OK' in one word."
                )
            else:
                raise exc

        latency = round((time.time() - start) * 1000)
        return {"ok": True, "model": used_model, "latency_ms": latency, "text": resp.text}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gemini API test failed: {exc}")

@router.get("/profile")
def get_profile():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, mobile, city, language FROM user_profiles LIMIT 1")
    row = cur.fetchone()
    conn.close()
    if row:
        return dict(row)
    return {"id": 1, "name": "Priya Raghavan", "mobile": "9840123456", "city": "Chennai", "language": "en"}

@router.put("/profile")
def update_profile(data: Dict[str, Any]):
    conn = get_connection()
    with conn:
        conn.execute(
            """INSERT OR REPLACE INTO user_profiles (id, name, mobile, city, language, created_at)
               VALUES (1, ?, ?, ?, ?, datetime('now'))""",
            (data.get("name", "Priya Raghavan"), data.get("mobile", "9840123456"),
             data.get("city", "Chennai"), data.get("language", "en"))
        )
    conn.close()
    return {"ok": True}

# --------------------
# Samples & Uploads
# --------------------

@router.get("/samples")
def get_samples():
    meta_path = SAMPLES_DIR / "meta.json"
    if meta_path.exists():
        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
    else:
        meta = {}
    return {
        "policy": {
            "filename": "policy_sample.pdf",
            "pages": 4,
            "url": "/api/samples/policy_sample.pdf"
        },
        "bill": {
            "filename": "bill_sample.pdf",
            "pages": 2,
            "url": "/api/samples/bill_sample.pdf"
        },
        "letter": {
            "filename": "letter_sample.pdf",
            "pages": 2,
            "url": "/api/samples/letter_sample.pdf"
        },
        "meta": meta
    }

@router.get("/samples/{filename}")
def download_sample(filename: str):
    p = SAMPLES_DIR / filename
    if not p.exists():
        raise HTTPException(status_code=404, detail="Sample not found")
    return FileResponse(p, media_type="application/pdf", filename=filename)

@router.post("/uploads")
async def upload_document(
    file: UploadFile = File(...),
    kind: str = Query("policy", description="policy | bill | letter")
):
    doc_id = f"doc_{uuid.uuid4().hex[:10]}"
    doc_dir = UPLOADS_DIR / doc_id
    doc_dir.mkdir(parents=True, exist_ok=True)

    file_bytes = await file.read()
    file_path = doc_dir / (file.filename or f"{doc_id}.pdf")
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Convert/render pages
    pages_meta = process_pdf(file_path, doc_dir)

    conn = get_connection()
    with conn:
        conn.execute(
            """INSERT INTO documents (doc_id, case_id, kind, filename, bytes, pages, text_json, path, created_at)
               VALUES (?, NULL, ?, ?, ?, ?, ?, ?, datetime('now'))""",
            (
                doc_id,
                kind,
                file.filename,
                len(file_bytes),
                len(pages_meta),
                json.dumps(pages_meta),
                str(file_path)
            )
        )
    conn.close()

    return {
        "doc_id": doc_id,
        "kind": kind,
        "filename": file.filename,
        "bytes": len(file_bytes),
        "pages": len(pages_meta),
        "pages_meta": pages_meta
    }

# --------------------
# Cases & Analysis
# --------------------

@router.post("/cases")
def create_case(
    req: CreateCaseRequest,
    x_gemini_key: Optional[str] = Header(None),
    sync: bool = False
):
    case_id = f"case_{uuid.uuid4().hex[:8]}"
    virtual_date = get_virtual_now()
    now_iso = datetime.now(timezone.utc).isoformat()

    conn = get_connection()
    with conn:
        conn.execute(
            """INSERT INTO cases (
                 case_id, title, insurer, policy_no, status, mode, language, scenario,
                 disputed_total, recoverable_total, recovered_total, created_virtual, created_at
               ) VALUES (?, ?, ?, ?, 'analyzing', ?, ?, ?, 100000, 60000, 0, ?, ?)""",
            (
                case_id,
                "Knee Replacement Claim Repudiation Dispute",
                "Meridian Health Insurance Co. Ltd.",
                "MH-FF-2021-004512",
                req.mode or settings.default_mode,
                req.language,
                req.scenario,
                virtual_date,
                now_iso
            )
        )
        # Associate documents
        for kind, doc_id in req.doc_ids.items():
            conn.execute(
                "UPDATE documents SET case_id = ?, kind = ? WHERE doc_id = ?",
                (case_id, kind, doc_id)
            )
    conn.close()

    if sync:
        run_case_pipeline(
            case_id=case_id,
            doc_ids=req.doc_ids,
            language=req.language,
            consents_granted=req.consent,
            api_key=x_gemini_key,
            mode=req.mode or settings.default_mode,
            scenario=req.scenario
        )
    else:
        # Trigger multi-agent pipeline asynchronously
        trigger_pipeline_async(
            case_id=case_id,
            doc_ids=req.doc_ids,
            language=req.language,
            consents_granted=req.consent,
            api_key=x_gemini_key,
            mode=req.mode or settings.default_mode,
            scenario=req.scenario
        )

    return {"case_id": case_id, "status": "analyzing"}

@router.get("/cases")
def list_cases(status: Optional[str] = None):
    conn = get_connection()
    cur = conn.cursor()
    if status and status != "all":
        cur.execute(
            """SELECT case_id, title, insurer, policy_no, status, mode, language, scenario,
                      disputed_total, recoverable_total, recovered_total, created_virtual, resolved_virtual, created_at
               FROM cases WHERE status = ? ORDER BY rowid DESC""",
            (status,)
        )
    else:
        cur.execute(
            """SELECT case_id, title, insurer, policy_no, status, mode, language, scenario,
                      disputed_total, recoverable_total, recovered_total, created_virtual, resolved_virtual, created_at
               FROM cases ORDER BY rowid DESC"""
        )
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/cases/{case_id}")
def get_case(case_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT case_id, title, insurer, policy_no, status, mode, language, scenario,
                  facts_json, verdict_json, disputed_total, recoverable_total, recovered_total,
                  created_virtual, resolved_virtual, created_at
           FROM cases WHERE case_id = ?""",
        (case_id,)
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Case not found")

    case_data = dict(row)
    case_data["facts"] = json.loads(row["facts_json"]) if row["facts_json"] else None
    case_data["verdict"] = json.loads(row["verdict_json"]) if row["verdict_json"] else None

    # Fetch ladder
    ladder = get_ladder_steps(case_id)
    case_data["ladder"] = ladder

    # Fetch next action
    cur.execute(
        """SELECT id, action, step, status, draft_subject, draft_body, evidence_json
           FROM approvals WHERE case_id = ? AND status = 'pending' ORDER BY id ASC LIMIT 1""",
        (case_id,)
    )
    next_app = cur.fetchone()
    if next_app:
        app_dict = dict(next_app)
        app_dict["evidence"] = json.loads(next_app["evidence_json"]) if next_app["evidence_json"] else []
        case_data["next_action"] = app_dict
    else:
        case_data["next_action"] = None

    conn.close()
    return case_data

@router.get("/claims/current")
def get_current_claim():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT case_id FROM cases ORDER BY rowid DESC LIMIT 1")
    row = cur.fetchone()
    conn.close()
    if not row:
        return {"case_id": None}
    return {"case_id": row["case_id"]}

@router.get("/claims/{claim_id}")
def get_claim(claim_id: str):
    return get_case(claim_id)

@router.get("/claims/{claim_id}/summary")
def get_claim_summary(claim_id: str):
    case = get_case(claim_id)
    verdict = case.get("verdict")
    deductions = verdict.get("deductions", []) if verdict else []
    
    # Calculate days to next deadline
    next_deadline_text = "6 Days"
    ladder = case.get("ladder", [])
    for step in ladder:
        if step.get("status") == "active" and step.get("deadline"):
            deadline_str = step.get("deadline")
            from datetime import date as dt_date
            try:
                d = dt_date.fromisoformat(deadline_str)
                now = get_virtual_clock().current_date
                delta = (d - now).days
                if delta >= 0:
                    next_deadline_text = f"{delta} Days"
                else:
                    next_deadline_text = "Overdue"
            except Exception:
                pass
            break

    return {
        **case,
        "amount_in_dispute": case.get("disputed_total") or 100000,
        "likely_recoverable": case.get("recoverable_total") or 60000,
        "deductions_reviewed": len(deductions) if deductions else 3,
        "next_deadline": next_deadline_text
    }

@router.get("/cases/{case_id}/events")
async def stream_case_events(case_id: str, request: Request):
    last_id = request.headers.get("Last-Event-ID")
    last_event_id = int(last_id) if last_id and last_id.isdigit() else None
    return EventSourceResponse(subscribe_case_events(case_id, last_event_id=last_event_id))

@router.get("/cases/{case_id}/timeline")
def get_case_timeline(case_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, ts, virtual_date, agent, type, title, detail, data_json, source, judge_note
           FROM trace_events WHERE case_id = ? ORDER BY id ASC""",
        (case_id,)
    )
    rows = cur.fetchall()
    conn.close()
    timeline = []
    for r in rows:
        item = dict(r)
        item["data"] = json.loads(r["data_json"]) if r["data_json"] else {}
        timeline.append(item)
    return timeline

@router.get("/cases/{case_id}/highlights")
def get_highlights(
    case_id: str,
    doc: str = Query(..., description="policy | bill | letter"),
    quote: str = Query(...)
):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT path FROM documents WHERE case_id = ? AND kind = ?",
        (case_id, doc)
    )
    row = cur.fetchone()
    conn.close()

    if not row or not Path(row["path"]).exists():
        # Fallback to sample PDF if matching kind
        sample_map = {
            "policy": SAMPLES_DIR / "policy_sample.pdf",
            "bill": SAMPLES_DIR / "bill_sample.pdf",
            "letter": SAMPLES_DIR / "letter_sample.pdf",
        }
        pdf_path = sample_map.get(doc)
    else:
        pdf_path = Path(row["path"])

    if not pdf_path or not pdf_path.exists():
        return []

    return find_highlights(pdf_path, quote)

@router.get("/cases/{case_id}/documents/{doc_id}/pages/{n}.png")
def get_page_png(case_id: str, doc_id: str, n: int):
    # Check uploads directory first
    png_path = UPLOADS_DIR / doc_id / f"page_{n}.png"
    if not png_path.exists():
        # Check samples directory
        for folder in ["policy_pages", "bill_pages", "letter_pages"]:
            sample_png = SAMPLES_DIR / folder / f"page_{n}.png"
            if sample_png.exists() and (doc_id in folder or doc_id == "demo"):
                return FileResponse(sample_png, media_type="image/png")
        # Try generic page
        if (SAMPLES_DIR / "policy_pages" / f"page_{n}.png").exists():
            return FileResponse(SAMPLES_DIR / "policy_pages" / f"page_{n}.png", media_type="image/png")
        raise HTTPException(status_code=404, detail="Page image not found")

    return FileResponse(png_path, media_type="image/png")

@router.get("/cases/{case_id}/messages")
def get_case_messages(case_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT id, case_id, direction, step, from_addr, to_addr, subject, body, status, simulated, virtual_date, created_at
           FROM messages WHERE case_id = ? ORDER BY id ASC""",
        (case_id,)
    )
    rows = cur.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@router.get("/cases/{case_id}/pack.pdf")
def download_evidence_pack(case_id: str):
    pack_path = UPLOADS_DIR / f"{case_id}_evidence_pack.pdf"
    case_data = get_case(case_id)
    generate_evidence_pack_pdf(case_data, pack_path)
    return FileResponse(pack_path, media_type="application/pdf", filename=f"Evidence_Pack_{case_id}.pdf")

@router.get("/cases/{case_id}/summary.pdf")
def download_case_summary(case_id: str):
    return download_evidence_pack(case_id)

# --------------------
# Approvals
# --------------------

@router.get("/approvals")
def get_approvals(status: str = Query("pending")):
    conn = get_connection()
    cur = conn.cursor()
    if status == "history":
        cur.execute(
            """SELECT id, case_id, action, step, draft_subject, draft_body, evidence_json, status, created_virtual, decided_at
               FROM approvals WHERE status IN ('approved', 'rejected') ORDER BY id DESC"""
        )
    else:
        cur.execute(
            """SELECT id, case_id, action, step, draft_subject, draft_body, evidence_json, status, created_virtual, decided_at
               FROM approvals WHERE status = 'pending' ORDER BY id DESC"""
        )
    rows = cur.fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        d["evidence"] = json.loads(r["evidence_json"]) if r["evidence_json"] else []
        results.append(d)
    return results

@router.post("/approvals/{approval_id}/approve")
def approve_action(approval_id: int, req: ApprovalActionRequest):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, case_id, step, draft_subject, draft_body, created_virtual FROM approvals WHERE id = ?",
        (approval_id,)
    )
    app_row = cur.fetchone()
    if not app_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Approval not found")

    case_id = app_row["case_id"]
    step = app_row["step"]
    subject = app_row["draft_subject"]
    body = req.edited_body or app_row["draft_body"]
    virtual_date = get_virtual_now()

    # Mark approved
    cur.execute(
        "UPDATE approvals SET status = 'approved', decided_at = datetime('now'), draft_body = ? WHERE id = ?",
        (body, approval_id)
    )
    conn.commit()
    conn.close()

    # Register into undo buffer for 8 seconds
    _undo_buffer[approval_id] = time.time() + 8.0

    # Deliver message to simulated twin
    deliver_outbound_message(
        case_id=case_id,
        step=step,
        from_addr="priya.raghavan@example.com",
        to_addr="grievance@meridian-health.example",
        subject=subject,
        body=body,
        virtual_date=virtual_date
    )

    emit_event(
        case_id=case_id,
        agent="rakshak",
        type_="approved",
        title=f"User approved {step.upper()} dispatch",
        virtual_date=virtual_date,
        detail="Communication approved. Dispatched to Grievance Redressal Officer.",
        judge_note="Policyholder authorized the complaint dispatch; 8-second undo grace window opened."
    )

    return {"ok": True, "approval_id": approval_id, "status": "approved", "undo_window_seconds": 8}

@router.post("/approvals/{approval_id}/undo")
def undo_approval(approval_id: int):
    expiry = _undo_buffer.get(approval_id)
    if not expiry or time.time() > expiry:
        raise HTTPException(status_code=400, detail="Undo window (8 seconds) has expired.")

    conn = get_connection()
    with conn:
        conn.execute("UPDATE approvals SET status = 'pending', decided_at = NULL WHERE id = ?", (approval_id,))
    conn.close()

    _undo_buffer.pop(approval_id, None)
    return {"ok": True, "status": "pending"}

@router.post("/approvals/{approval_id}/reject")
def reject_approval(approval_id: int):
    conn = get_connection()
    with conn:
        conn.execute("UPDATE approvals SET status = 'rejected', decided_at = datetime('now') WHERE id = ?", (approval_id,))
    conn.close()
    return {"ok": True, "status": "rejected"}

# --------------------
# Time Machine
# --------------------

@router.get("/clock")
def get_clock():
    return {"virtual_now": get_virtual_now()}

@router.post("/clock/advance")
def advance_clock(req: AdvanceClockRequest):
    new_date = advance_virtual_days(req.days)
    executed = process_scheduled_ticks(new_date)
    return {"virtual_now": new_date, "executed_events": executed}

@router.post("/clock/set")
def set_clock(req: SetClockRequest):
    new_date = set_virtual_now(req.date)
    executed = process_scheduled_ticks(new_date)
    return {"virtual_now": new_date, "executed_events": executed}

@router.post("/clock/reset")
def reset_clock():
    new_date = reset_virtual_clock()
    return {"virtual_now": new_date}

# --------------------
# Judge Mode
# --------------------

@router.post("/judge/config")
def update_judge_config(req: JudgeConfigRequest):
    update_data = {}
    if req.insurer_behavior is not None:
        update_data["insurer_behavior"] = req.insurer_behavior
    if req.auto_approve is not None:
        update_data["auto_approve"] = req.auto_approve
    if req.pacing is not None:
        update_data["pacing"] = req.pacing
    set_judge_config(update_data)
    return {"ok": True, "config": get_judge_config()}

@router.post("/judge/load-demo")
def load_judge_demo(x_gemini_key: Optional[str] = Header(None), sync: bool = False):
    """One-click: loads Priya Raghavan's demo documents and starts the multi-agent pipeline."""
    # Ensure sample docs exist
    if not (SAMPLES_DIR / "policy_sample.pdf").exists():
        from backend.app.tools.make_samples import generate_all_samples
        generate_all_samples()

    # Create document records for samples
    conn = get_connection()
    cur = conn.cursor()

    doc_ids = {}
    for kind, filename in [
        ("policy", "policy_sample.pdf"),
        ("bill", "bill_sample.pdf"),
        ("letter", "letter_sample.pdf")
    ]:
        p = SAMPLES_DIR / filename
        pages_meta = process_pdf(p, SAMPLES_DIR / f"{kind}_pages")
        doc_id = f"demo_{kind}"
        cur.execute(
            """INSERT OR REPLACE INTO documents (doc_id, case_id, kind, filename, bytes, pages, text_json, path, created_at)
               VALUES (?, NULL, ?, ?, ?, ?, ?, ?, datetime('now'))""",
            (
                doc_id,
                kind,
                filename,
                p.stat().st_size,
                len(pages_meta),
                json.dumps(pages_meta),
                str(p)
            )
        )
        doc_ids[kind] = doc_id

    conn.commit()
    conn.close()

    # Reset clock to default start date
    reset_virtual_clock()

    # Create Case
    return create_case(
        CreateCaseRequest(
            doc_ids=doc_ids,
            language="en",
            consent=["analyse_ai", "draft_complaints", "approval_required"],
            mode="demo",
            scenario="judge_demo"
        ),
        x_gemini_key=x_gemini_key,
        sync=sync
    )

# --------------------
# Library & Data
# --------------------

@router.get("/rules")
def get_rules():
    return load_rules()

@router.get("/glossary")
def get_glossary():
    p = DATA_DIR / "glossary.json"
    if p.exists():
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.get("/policies")
def get_policy_vault():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        """SELECT DISTINCT c.insurer, c.policy_no, c.facts_json, c.case_id
           FROM cases c WHERE c.facts_json IS NOT NULL"""
    )
    rows = cur.fetchall()
    conn.close()
    policies = []
    for r in rows:
        facts = json.loads(r["facts_json"])
        pol = facts.get("policy", {})
        policies.append({
            "case_id": r["case_id"],
            "insurer": r["insurer"],
            "policy_no": r["policy_no"],
            "product": pol.get("product", "Health Policy"),
            "holder": pol.get("holder", "Policyholder"),
            "sum_insured": pol.get("sum_insured", 500000),
            "inception_date": pol.get("inception_date", "2021-04-01"),
            "renewal_dates": pol.get("renewal_dates", []),
            "clauses": pol.get("clauses", [])
        })
    return policies

@router.post("/data/export")
def export_data():
    conn = get_connection()
    cur = conn.cursor()
    dump = {}
    for t in ["cases", "documents", "ladder_steps", "messages", "approvals", "trace_events", "metrics"]:
        cur.execute(f"SELECT * FROM {t}")
        dump[t] = [dict(r) for r in cur.fetchall()]
    conn.close()
    return dump

@router.post("/data/delete")
def delete_all_data():
    reset_db()
    for doc_dir in UPLOADS_DIR.iterdir():
        if doc_dir.is_dir():
            shutil.rmtree(doc_dir, ignore_errors=True)
    return {"ok": True, "bytes_retained": 0}

@router.post("/reset")
def reset_all():
    return delete_all_data()
