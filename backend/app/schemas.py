from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

# -----------------
# Lekha FactSheet
# -----------------

class InsurerInfo(BaseModel):
    name: str = ""
    grievance_email: Optional[str] = None
    grievance_officer: Optional[str] = None

class PolicyClause(BaseModel):
    id: str
    title: str
    text: str
    page: int = 1

class PolicyInfo(BaseModel):
    policy_no: str = ""
    product: str = ""
    holder: str = ""
    sum_insured: int = 0
    inception_date: str = ""
    renewal_dates: List[str] = Field(default_factory=list)
    clauses: List[PolicyClause] = Field(default_factory=list)

class ClaimInfo(BaseModel):
    patient: str = ""
    admission: str = ""
    discharge: str = ""
    billed_total: int = 0
    approved_total: int = 0
    claim_submitted_on: Optional[str] = None

class BillItem(BaseModel):
    category: Literal["room", "nursing", "doctor", "medicine", "consumables", "investigations", "other"] = "other"
    label: str = ""
    amount: int = 0
    page: int = 1

class RoomInfo(BaseModel):
    rate_per_day: int = 0
    days: int = 0

class DeductionItem(BaseModel):
    id: str  # e.g. "D1"
    amount: int = 0
    stated_reason: str = ""
    cited_clause: Optional[str] = None
    quote: str = ""
    page: int = 1

class LetterInfo(BaseModel):
    date: str = ""
    reference: Optional[str] = None
    deductions: List[DeductionItem] = Field(default_factory=list)

class FactSheet(BaseModel):
    insurer: InsurerInfo = Field(default_factory=InsurerInfo)
    policy: PolicyInfo = Field(default_factory=PolicyInfo)
    claim: ClaimInfo = Field(default_factory=ClaimInfo)
    bill_items: List[BillItem] = Field(default_factory=list)
    room: RoomInfo = Field(default_factory=RoomInfo)
    letter: LetterInfo = Field(default_factory=LetterInfo)
    missing: List[str] = Field(default_factory=list)
    confidence: float = 1.0


# -----------------
# Nyaya Verdict
# -----------------

class LocalizedText(BaseModel):
    lang: str = "en"
    text: str = ""

class OverallVerdict(BaseModel):
    disputed_total: int = 0
    likely_recoverable: int = 0
    summary_en: str = ""
    summary_local: LocalizedText = Field(default_factory=LocalizedText)

class EvidenceRef(BaseModel):
    source: Literal["letter", "policy", "bill"] = "policy"
    quote: str = ""
    page: int = 1

class ToolResultItem(BaseModel):
    tool: str
    output: Dict[str, Any] = Field(default_factory=dict)

class VerdictLine(BaseModel):
    deduction_id: str  # "D1", etc.
    verdict: Literal["strong_case", "possible", "valid_deduction", "need_info"]
    confidence: float = 0.0
    recoverable_amount: int = 0
    reasoning_en: str = ""
    reasoning_local: LocalizedText = Field(default_factory=LocalizedText)
    evidence: List[EvidenceRef] = Field(default_factory=list)
    rule_ids: List[str] = Field(default_factory=list)
    tool_results: List[ToolResultItem] = Field(default_factory=list)

class Verdict(BaseModel):
    overall: OverallVerdict = Field(default_factory=OverallVerdict)
    lines: List[VerdictLine] = Field(default_factory=list)
    recommended_path: List[str] = Field(default_factory=lambda: ["gro", "regulator", "ombudsman"])


# -----------------
# Ladder & State
# -----------------

class EscalationStep(BaseModel):
    step: Literal["review", "gro", "regulator", "ombudsman", "consumer"]
    status: Literal["locked", "active", "waiting", "done", "skipped"] = "locked"
    opened_on: Optional[str] = None
    deadline_on: Optional[str] = None
    reply_due_days: int = 15
    notes: str = ""


# -----------------
# Agent Trace Event
# -----------------

class TraceEvent(BaseModel):
    id: Optional[int] = None
    ts: str = ""
    virtual_date: str = ""
    case_id: str = ""
    agent: Literal["lekha", "nyaya", "doot", "rakshak", "system"]
    type: Literal[
        "agent_start", "thinking", "llm_call", "tool_call", "tool_result",
        "evidence", "artifact", "draft", "approval_needed", "approved", "sent",
        "reply_received", "clock", "escalation", "guardrail", "warn", "error",
        "agent_done", "case_done"
    ]
    title: str
    detail: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)
    source: Literal["gemini", "local", "tool", "simulated", "fallback"] = "local"
    judge_note: Optional[str] = None


# -----------------
# API Payloads
# -----------------

class CreateCaseRequest(BaseModel):
    doc_ids: Dict[str, str]  # {"policy": doc_id, "bill": doc_id, "letter": doc_id}
    language: str = "en"
    consent: List[str] = Field(default_factory=list)
    mode: Optional[str] = None  # auto, demo, live
    scenario: str = "judge_demo"

class AdvanceClockRequest(BaseModel):
    days: int

class SetClockRequest(BaseModel):
    date: str

class JudgeConfigRequest(BaseModel):
    insurer_behavior: Optional[Literal["silent", "partial_offer", "reject_again", "pay_full"]] = None
    auto_approve: Optional[bool] = None
    pacing: Optional[float] = None

class ApprovalActionRequest(BaseModel):
    edited_body: Optional[str] = None
