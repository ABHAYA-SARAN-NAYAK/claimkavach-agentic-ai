import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = BASE_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

DATA_DIR = BASE_DIR / "data"
SAMPLES_DIR = BASE_DIR / "samples"
UPLOADS_DIR = BASE_DIR / "uploads"
LETTERS_DIR = BASE_DIR / "letters"
DB_PATH = BACKEND_DIR / "claimkavach.db"

# Ensure runtime directories exist
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseModel):
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY", None)
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    gemini_fallback_model: str = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.5-flash-lite")
    gemini_rpm: int = int(os.getenv("GEMINI_RPM", "8"))
    default_mode: str = os.getenv("DEFAULT_MODE", "auto")
    demo_start_date: str = os.getenv("DEMO_START_DATE", "2026-09-08")
    demo_pacing: float = float(os.getenv("DEMO_PACING", "1.0"))
    port: int = int(os.getenv("PORT", "8000"))

settings = Settings()
