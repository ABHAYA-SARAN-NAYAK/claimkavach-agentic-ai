import pytest
from backend.app.db import init_db, reset_db
from backend.app.config import SAMPLES_DIR
from backend.app.tools.make_samples import generate_all_samples

@pytest.fixture(scope="session", autouse=True)
def ensure_samples_exist():
    policy_pdf = SAMPLES_DIR / "policy_sample.pdf"
    letter_pdf = SAMPLES_DIR / "letter_sample.pdf"
    if not policy_pdf.exists() or not letter_pdf.exists():
        generate_all_samples()

@pytest.fixture(autouse=True)
def setup_database():
    init_db()
    reset_db()
