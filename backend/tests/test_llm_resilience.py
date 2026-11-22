import pytest
from unittest.mock import MagicMock, patch
from pydantic import BaseModel
from backend.app.llm import (
    call_structured_llm,
    reset_switch_status,
    get_switch_status,
    settings,
)

class SampleOutput(BaseModel):
    summary: str
    amount: int

def fallback_fn():
    return SampleOutput(summary="Fallback summary", amount=60000)

@pytest.fixture(autouse=True)
def clean_llm_state():
    reset_switch_status()
    with patch("backend.app.llm.rate_limiter.wait", return_value=None):
        yield

def test_primary_success_path():
    """Proves that primary model (gemini-2.5-flash) succeeds on first attempt."""
    mock_resp = MagicMock()
    mock_resp.text = '{"summary": "Primary success", "amount": 60000}'

    mock_client = MagicMock()
    mock_client.models.generate_content.return_value = mock_resp

    with patch("google.genai.Client", return_value=mock_client):
        res, source, note = call_structured_llm(
            prompt="Analyze claim",
            system_prompt="You are Lekha",
            response_model=SampleOutput,
            api_key="fake-test-key",
            mode="live",
            fallback_factory=fallback_fn,
        )

        assert res.summary == "Primary success"
        assert res.amount == 60000
        assert source == "gemini"
        assert "gemini-2.5-flash" in note
        assert mock_client.models.generate_content.call_count == 1
        assert mock_client.models.generate_content.call_args[1]["model"] == "gemini-2.5-flash"

def test_429_rate_limit_then_backup_success():
    """Proves that on HTTP 429 / Quota error, it retries ONCE on gemini-2.5-flash-lite."""
    mock_resp = MagicMock()
    mock_resp.text = '{"summary": "Backup success", "amount": 60000}'

    mock_client = MagicMock()
    # Call 1 raises 429 Quota exhausted, Call 2 returns success
    mock_client.models.generate_content.side_effect = [
        Exception("429 RESOURCE_EXHAUSTED: Quota exceeded for model gemini-2.5-flash"),
        mock_resp,
    ]

    with patch("google.genai.Client", return_value=mock_client):
        res, source, note = call_structured_llm(
            prompt="Analyze claim with retry",
            system_prompt="You are Lekha",
            response_model=SampleOutput,
            api_key="fake-test-key",
            mode="live",
            fallback_factory=fallback_fn,
        )

        assert res.summary == "Backup success"
        assert source == "gemini"
        assert "The main AI model was busy, so a lighter model answered." in note
        assert mock_client.models.generate_content.call_count == 2
        # Verify second call used backup model
        assert mock_client.models.generate_content.call_args_list[0][1]["model"] == "gemini-2.5-flash"
        assert mock_client.models.generate_content.call_args_list[1][1]["model"] == "gemini-2.5-flash-lite"

def test_primary_model_not_found_switches_to_backup():
    """Proves that on 'model not found' (404), it switches to backup model for the run."""
    mock_resp = MagicMock()
    mock_resp.text = '{"summary": "Switched backup success", "amount": 60000}'

    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = [
        Exception("404 NOT_FOUND: Model gemini-2.5-flash not found or permission denied"),
        mock_resp,
    ]

    with patch("google.genai.Client", return_value=mock_client):
        res, source, note = call_structured_llm(
            prompt="Analyze claim 404 test",
            system_prompt="You are Lekha",
            response_model=SampleOutput,
            api_key="fake-test-key",
            mode="live",
            fallback_factory=fallback_fn,
        )

        assert res.summary == "Switched backup success"
        assert source == "gemini"
        switched, reason = get_switch_status()
        assert switched is True
        assert "gemini-2.5-flash-lite" in reason

def test_both_failing_triggers_scripted_fallback():
    """Proves that when both primary and backup fail, it gracefully uses the scripted fallback."""
    mock_client = MagicMock()
    mock_client.models.generate_content.side_effect = [
        Exception("429 RESOURCE_EXHAUSTED"),
        Exception("503 Backend unavailable"),
    ]

    with patch("google.genai.Client", return_value=mock_client):
        res, source, note = call_structured_llm(
            prompt="Analyze claim double failure",
            system_prompt="You are Lekha",
            response_model=SampleOutput,
            api_key="fake-test-key",
            mode="live",
            fallback_factory=fallback_fn,
        )

        assert res.summary == "Fallback summary"
        assert res.amount == 60000
        assert source == "fallback"
        assert "Live Gemini fallback triggered" in note
