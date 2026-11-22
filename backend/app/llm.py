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

# Track if primary model was permanently switched due to 404/permission errors
_switched_to_backup: bool = False
_switch_reason: Optional[str] = None

def get_active_model(override_model: Optional[str] = None) -> str:
    global _switched_to_backup
    if override_model:
        return override_model
    if _switched_to_backup:
        return settings.gemini_fallback_model
    return settings.gemini_model

def get_switch_status() -> tuple[bool, Optional[str]]:
    return _switched_to_backup, _switch_reason

def reset_switch_status() -> None:
    global _switched_to_backup, _switch_reason
    _switched_to_backup = False
    _switch_reason = None

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

def _is_quota_error(exc: Exception) -> bool:
    err = str(exc).lower()
    return "429" in err or "resource_exhausted" in err or "quota" in err or "rate limit" in err

def _is_not_found_or_perm(exc: Exception) -> bool:
    err = str(exc).lower()
    return "not found" in err or "not_found" in err or "404" in err or "permission" in err or "403" in err

def call_structured_llm(
    prompt: str,
    system_prompt: str,
    response_model: Type[T],
    api_key: Optional[str] = None,
    mode: str = "auto",
    fallback_factory: Optional[Any] = None,
    model_override: Optional[str] = None,
    fallback_model_override: Optional[str] = None,
) -> tuple[T, str, Optional[str]]:
    """
    Calls Google GenAI with structured output schema.
    Tries primary model (gemini-2.5-flash).
    On 429/quota error, retries ONCE on backup model (gemini-2.5-flash-lite).
    On model not found / permission error, switches to backup model for remainder of run.
    If backup also fails, uses deterministic scripted fallback.
    
    Returns: (result_model, source ['gemini'|'fallback'|'cache'], judge_note)
    """
    global _switched_to_backup, _switch_reason

    effective_key = api_key or settings.gemini_api_key

    # Check mode
    if mode == "demo" or not is_key_configured(effective_key):
        if fallback_factory:
            return fallback_factory(), "fallback", "Ran in Demo Simulation mode using verified legal logic."
        raise ValueError("Demo mode requested but no fallback factory provided.")

    primary_model = get_active_model(model_override)
    backup_model = fallback_model_override or settings.gemini_fallback_model

    # Check cache
    cache_str = f"{primary_model}:{system_prompt}:{prompt}"
    cache_key = hashlib.sha256(cache_str.encode("utf-8")).hexdigest()
    cached = get_cached_response(cache_key)
    if cached:
        try:
            parsed = response_model.model_validate_json(cached)
            return parsed, "cache", "Retrieved from local cache to preserve free-tier quota."
        except Exception:
            pass

    # Helper to execute GenAI call
    def _execute_genai(model_name: str) -> tuple[T, str]:
        from google import genai
        from google.genai import types

        rate_limiter.wait()
        client = genai.Client(api_key=effective_key)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=response_model,
                temperature=0.1,
            ),
        )
        resp_text = response.text or ""
        parsed = response_model.model_validate_json(resp_text)
        set_cached_response(cache_key, resp_text)
        return parsed, resp_text

    # Step 1: Attempt primary model
    try:
        parsed, _ = _execute_genai(primary_model)
        return parsed, "gemini", f"Analyzed live using Google {primary_model}."

    except Exception as primary_exc:
        logger.warning(f"Primary model {primary_model} call failed: {primary_exc}")

        # Check for model not found / permission error
        if _is_not_found_or_perm(primary_exc):
            _switched_to_backup = True
            _switch_reason = f"Primary model {primary_model} was unavailable ({type(primary_exc).__name__}), switched to {backup_model}."
            logger.info(f"Permanently switching to backup model {backup_model}: {_switch_reason}")

        # If quota/429 or switched, try backup model ONCE
        if (_is_quota_error(primary_exc) or _is_not_found_or_perm(primary_exc)) and backup_model != primary_model:
            try:
                logger.info(f"Retrying on backup model: {backup_model}")
                parsed, _ = _execute_genai(backup_model)
                note = "The main AI model was busy, so a lighter model answered." if _is_quota_error(primary_exc) else f"Switched to backup model {backup_model}."
                return parsed, "gemini", note
            except Exception as backup_exc:
                logger.warning(f"Backup model {backup_model} also failed: {backup_exc}")

        # Both live models failed -> use scripted fallback gracefully
        if fallback_factory:
            return fallback_factory(), "fallback", f"Live Gemini fallback triggered ({type(primary_exc).__name__}). Handled gracefully."
        raise primary_exc
