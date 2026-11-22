from backend.app.config import SAMPLES_DIR
from backend.app.tools.highlight import find_highlights

def test_policy_moratorium_highlight():
    pdf_path = SAMPLES_DIR / "policy_sample.pdf"
    quote = "After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud."
    highlights = find_highlights(pdf_path, quote)
    assert len(highlights) >= 1
    h = highlights[0]
    assert h["page"] == 3
    assert h["pct_w"] > 0
    assert h["pct_h"] > 0

def test_letter_d1_highlight():
    pdf_path = SAMPLES_DIR / "letter_sample.pdf"
    quote = "Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2)."
    highlights = find_highlights(pdf_path, quote)
    assert len(highlights) >= 1
    h = highlights[0]
    assert h["page"] == 1
    assert h["pct_w"] > 0
