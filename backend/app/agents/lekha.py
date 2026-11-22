import json
import logging
from typing import Any, Dict, List, Optional
from backend.app.schemas import FactSheet
from backend.app.llm import call_structured_llm
from backend.app.demo.scripted import get_scripted_factsheet
from backend.app.events import emit_event

logger = logging.getLogger("claimkavach.lekha")

LEKHA_SYSTEM_PROMPT = """You are Lekha, the document-reading agent of ClaimKavach, a tool that helps Indian families dispute health-insurance claim rejections.
You receive the text or images of three documents: an insurance policy, a hospital bill, and an insurer's claim settlement or rejection letter.
Extract ONLY what is written. Never guess. Use null when something is not present.
For every policy clause you return, copy the clause text EXACTLY as printed (no paraphrasing) and give its clause number and page.
For every deduction in the letter, copy the insurer's stated reason EXACTLY as a short quote and give its page.
List renewal dates if a renewal history table exists. List anything missing that would be needed to judge the claim.
Return ONLY JSON matching the schema."""

def run_lekha(
    case_id: str,
    virtual_date: str,
    doc_texts: Dict[str, str],
    api_key: Optional[str] = None,
    mode: str = "auto",
    scenario: str = "judge_demo"
) -> FactSheet:
    """
    Executes Lekha to parse policy, bill, and rejection letter into a structured FactSheet.
    """
    emit_event(
        case_id=case_id,
        agent="lekha",
        type_="agent_start",
        title="Lekha started reading documents",
        virtual_date=virtual_date,
        detail="Examining policy clauses, bill line-items, and deduction notices.",
        judge_note="Lekha extracts raw facts and clauses without inferring or guessing."
    )

    emit_event(
        case_id=case_id,
        agent="lekha",
        type_="thinking",
        title="Scanning document text for policy clauses and hospital items",
        virtual_date=virtual_date,
        detail="Parsing room rent caps, continuous renewal history, and repudiation grounds."
    )

    prompt = (
        f"--- POLICY DOCUMENT ---\n{doc_texts.get('policy', '')}\n\n"
        f"--- HOSPITAL BILL ---\n{doc_texts.get('bill', '')}\n\n"
        f"--- SETTLEMENT / REJECTION LETTER ---\n{doc_texts.get('letter', '')}\n"
    )

    def fallback():
        return get_scripted_factsheet()

    factsheet, source, judge_note = call_structured_llm(
        prompt=prompt,
        system_prompt=LEKHA_SYSTEM_PROMPT,
        response_model=FactSheet,
        api_key=api_key,
        mode=mode,
        fallback_factory=fallback
    )

    emit_event(
        case_id=case_id,
        agent="lekha",
        type_="artifact",
        title="FactSheet compiled",
        virtual_date=virtual_date,
        detail=f"Extracted {len(factsheet.policy.clauses)} policy clauses, {len(factsheet.bill_items)} bill items, and {len(factsheet.letter.deductions)} deductions.",
        data=factsheet.model_dump(),
        source=source,
        judge_note=judge_note or "Lekha compiled the verified factsheet from the provided documents."
    )

    emit_event(
        case_id=case_id,
        agent="lekha",
        type_="agent_done",
        title="Lekha finished extraction",
        virtual_date=virtual_date,
        detail=f"Policy {factsheet.policy.policy_no} identified from {factsheet.insurer.name}."
    )

    return factsheet
