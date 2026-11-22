import json
import logging
import time
import hashlib
from typing import Any, Dict, Optional, Type, TypeVar
from pydantic import BaseModel
from backend.app.config import settings
from backend.app.db import get_connection

logger = logging.getLogger("claimkavach.llm")

T = TypeVar("T", bound=BaseModel)

class RateLimiter:
    def __init__(self, rpm: int = 8):
        self.rpm = rpm
        self.interval = 60.0 / max(rpm, 1)
        self.last_call = 0.0

    def wait(self):
        now = time.time()
        elapsed = now - self.last_call
        if elapsed < self.interval:
            sleep_time = self.interval - elapsed
            time.sleep(sleep_time)
        self.last_call = time.time()

rate_limiter = RateLimiter(rpm=settings.gemini_rpm)

def get_cached_response(cache_key: str) -> Optional[str]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT response_json FROM llm_cache WHERE key = ?", (cache_key,))
    row = cur.fetchone()
    conn.close()
    if row:
        return row["response_json"]
    return None

def set_cached_response(cache_key: str, response_json: str) -> None:
    conn = get_connection()
    with conn:
        conn.execute(
            "INSERT OR REPLACE INTO llm_cache (key, response_json, created_at) VALUES (?, ?, datetime('now'))",
            (cache_key, response_json)
        )
    conn.close()

def is_key_configured(override_key: Optional[str] = None) -> bool:
    key = override_key or settings.gemini_api_key
    return bool(key and key.strip())

def call_structured_llm(
    prompt: str,
    system_prompt: str,
    response_model: Type[T],
    api_key: Optional[str] = None,
    mode: str = "auto",
    fallback_factory: Optional[Any] = None,
) -> tuple[T, str, Optional[str]]:
    """
    Calls Google GenAI with response schema or falls back cleanly.
    Returns: (result_model, source ['gemini'|'fallback'|'cache'], judge_note)
    """
    effective_key = api_key or settings.gemini_api_key

    # Check mode
    if mode == "demo" or not is_key_configured(effective_key):
        if fallback_factory:
            return fallback_factory(), "fallback", "Ran in Demo Simulation mode using verified legal logic."
        raise ValueError("Demo mode requested but no fallback factory provided.")

    # Check cache
    cache_str = f"{settings.gemini_model}:{system_prompt}:{prompt}"
    cache_key = hashlib.sha256(cache_str.encode("utf-8")).hexdigest()
    cached = get_cached_response(cache_key)
    if cached:
        try:
            parsed = response_model.model_validate_json(cached)
            return parsed, "cache", "Retrieved from local cache to preserve free-tier quota."
        except Exception:
            pass

    # Attempt Live Call
    try:
        from google import genai
        from google.genai import types

        rate_limiter.wait()
        client = genai.Client(api_key=effective_key)
        
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=response_model,
                temperature=0.1,
            )
        )
        resp_text = response.text or ""
        parsed = response_model.model_validate_json(resp_text)
        set_cached_response(cache_key, resp_text)
        return parsed, "gemini", "Analyzed live using Google Gemini."

    except Exception as exc:
        logger.warning(f"Live Gemini call failed or quota exceeded: {exc}. Using deterministic fallback.")
        if fallback_factory:
            return fallback_factory(), "fallback", f"Live Gemini fallback triggered ({type(exc).__name__}). Handled gracefully."
        raise exc
