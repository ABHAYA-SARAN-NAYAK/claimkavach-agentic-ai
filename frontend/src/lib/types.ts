export type AgentName = 'lekha' | 'nyaya' | 'doot' | 'rakshak' | 'system';

export type VerdictType = 'strong_case' | 'possible' | 'valid_deduction' | 'need_info';

export type StepType = 'review' | 'gro' | 'regulator' | 'ombudsman' | 'consumer';

export type StepStatus = 'locked' | 'active' | 'waiting' | 'done' | 'skipped';

export interface LocalizedText {
  lang: string;
  text: string;
}

export interface PolicyClause {
  id: string;
  title: string;
  text: string;
  page: number;
}

export interface PolicyInfo {
  policy_no: string;
  product: string;
  holder: string;
  sum_insured: number;
  inception_date: string;
  renewal_dates: string[];
  clauses: PolicyClause[];
}

export interface BillItem {
  category: 'room' | 'nursing' | 'doctor' | 'medicine' | 'consumables' | 'investigations' | 'other';
  label: string;
  amount: number;
  page: number;
}

export interface DeductionItem {
  id: string;
  amount: number;
  stated_reason: string;
  cited_clause?: string | null;
  quote: string;
  page: number;
}

export interface FactSheet {
  insurer: {
    name: string;
    grievance_email?: string | null;
    grievance_officer?: string | null;
  };
  policy: PolicyInfo;
  claim: {
    patient: string;
    admission: string;
    discharge: string;
    billed_total: number;
    approved_total: number;
    claim_submitted_on?: string | null;
  };
  bill_items: BillItem[];
  room: {
    rate_per_day: number;
    days: number;
  };
  letter: {
    date: string;
    reference?: string | null;
    deductions: DeductionItem[];
  };
  missing: string[];
  confidence: number;
}

export interface EvidenceRef {
  source: 'letter' | 'policy' | 'bill';
  quote: string;
  page: number;
}

export interface ToolResultItem {
  tool: string;
  output: Record<string, any>;
}

export interface VerdictLine {
  deduction_id: string;
  verdict: VerdictType;
  confidence: number;
  recoverable_amount: number;
  reasoning_en: string;
  reasoning_local: LocalizedText;
  evidence: EvidenceRef[];
  rule_ids: string[];
  tool_results: ToolResultItem[];
}

export interface Verdict {
  overall: {
    disputed_total: number;
    likely_recoverable: number;
    summary_en: string;
    summary_local: LocalizedText;
  };
  lines: VerdictLine[];
  recommended_path: string[];
}

export interface EscalationStep {
  id: number;
  case_id: string;
  step: StepType;
  status: StepStatus;
  opened_on: string | null;
  deadline_on: string | null;
  notes: string;
}

export interface TraceEvent {
  id: number;
  ts: string;
  virtual_date: string;
  case_id: string;
  agent: AgentName;
  type:
    | 'agent_start'
    | 'thinking'
    | 'llm_call'
    | 'tool_call'
    | 'tool_result'
    | 'evidence'
    | 'artifact'
    | 'draft'
    | 'approval_needed'
    | 'approved'
    | 'sent'
    | 'reply_received'
    | 'clock'
    | 'escalation'
    | 'guardrail'
    | 'warn'
    | 'error'
    | 'agent_done'
    | 'case_done';
  title: string;
  detail?: string | null;
  data: Record<string, any>;
  source: 'gemini' | 'local' | 'tool' | 'simulated' | 'fallback';
  judge_note?: string | null;
}

export interface Approval {
  id: number;
  case_id: string;
  action: string;
  step: StepType;
  draft_subject: string;
  draft_body: string;
  evidence: Array<{ source: string; quote: string }>;
  status: 'pending' | 'approved' | 'rejected';
  created_virtual: string;
  decided_at?: string | null;
}

export interface Case {
  case_id: string;
  title: string;
  insurer: string;
  policy_no: string;
  status: string;
  mode: string;
  language: string;
  scenario: string;
  facts: FactSheet | null;
  verdict: Verdict | null;
  ladder: EscalationStep[];
  disputed_total: number;
  recoverable_total: number;
  recovered_total: number;
  created_virtual: string;
  resolved_virtual?: string | null;
  created_at: string;
  next_action?: Approval | null;
}

export interface Message {
  id: number;
  case_id: string;
  direction: 'outbound' | 'inbound';
  step: string;
  from_addr: string;
  to_addr: string;
  subject: string;
  body: string;
  status: string;
  simulated: number;
  virtual_date: string;
  created_at: string;
}

export interface Rule {
  id: string;
  title: string;
  plain_en: string;
  plain_hi: string;
  plain_ta: string;
  applies_to: string;
  params: Record<string, any>;
  source_name: string;
  source_url: string;
  verified: boolean;
}

export interface GlossaryItem {
  term: string;
  en: string;
  hi: string;
  ta: string;
}

export interface HighlightRect {
  page: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  pw: number;
  ph: number;
  pct_x0: number;
  pct_y0: number;
  pct_w: number;
  pct_h: number;
}
