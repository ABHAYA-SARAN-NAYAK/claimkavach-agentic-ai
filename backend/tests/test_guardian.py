from backend.app.agents.rakshak import (
    check_consents, scan_and_redact_pii, verify_evidence, check_letter_tone
)
from backend.app.schemas import (
    Verdict, OverallVerdict, VerdictLine, LocalizedText, EvidenceRef
)

def test_rakshak_consents():
    case_id = "test_case_consent"
    assert check_consents(case_id, ["analyse_ai", "draft_complaints", "approval_required"], "2026-09-08") is True
    assert check_consents(case_id, ["analyse_ai"], "2026-09-08") is False

def test_rakshak_pii_redaction():
    text = "The insured Aadhaar is 1234 5678 9012 and patient is Ramesh."
    redacted = scan_and_redact_pii(text, "test_pii", "2026-09-08")
    assert "[REDACTED-AADHAAR]" in redacted
    assert "1234 5678 9012" not in redacted

def test_rakshak_evidence_blocks_fake_quote():
    case_id = "test_ev_fake"
    doc_text = "This is the real policy text mentioning continuous coverage of 60 months."
    
    # Verdict with fake quote
    fake_verdict = Verdict(
        overall=OverallVerdict(disputed_total=50000, likely_recoverable=50000),
        lines=[
            VerdictLine(
                deduction_id="D1",
                verdict="strong_case",
                confidence=0.9,
                recoverable_amount=50000,
                evidence=[EvidenceRef(source="policy", quote="A fake quote that is not in the text at all", page=1)],
                rule_ids=["R_MORATORIUM"]
            )
        ]
    )
    is_valid = verify_evidence(case_id, "2026-09-08", fake_verdict, doc_text)
    assert is_valid is False

def test_rakshak_evidence_blocks_fake_rule_id():
    case_id = "test_rule_fake"
    doc_text = "This policy covers room rent up to 5000."
    fake_verdict = Verdict(
        overall=OverallVerdict(disputed_total=50000, likely_recoverable=50000),
        lines=[
            VerdictLine(
                deduction_id="D1",
                verdict="strong_case",
                confidence=0.9,
                recoverable_amount=50000,
                evidence=[],
                rule_ids=["R_NON_EXISTENT_FAKE_RULE_XYZ"]
            )
        ]
    )
    is_valid = verify_evidence(case_id, "2026-09-08", fake_verdict, doc_text)
    assert is_valid is False

def test_rakshak_tone_checker():
    bad_text = "We will sue your fraudulent company and put your officers in jail."
    ok_text = "We respectfully request your office to disburse the wrongful deduction within 15 days."
    
    is_ok, err = check_letter_tone(bad_text)
    assert is_ok is False
    
    is_ok, err = check_letter_tone(ok_text)
    assert is_ok is True
