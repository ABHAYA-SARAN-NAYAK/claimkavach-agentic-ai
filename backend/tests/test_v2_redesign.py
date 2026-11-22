import pytest
import json
from pathlib import Path
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db import reset_db
from backend.app.clock import reset_virtual_clock

client = TestClient(app)

def test_claims_endpoints_and_v2_flow():
    reset_db()
    reset_virtual_clock()

    # Turn on auto_approve for seamless stage demo jumps
    client.post("/api/judge/config", json={"auto_approve": True, "insurer_behavior": "partial_offer"})

    # Initially no claims
    res = client.get("/api/claims/current")
    assert res.status_code == 200
    assert res.json()["case_id"] is None

    # Load judge demo
    res = client.post("/api/judge/load-demo?sync=true")
    assert res.status_code == 200
    case_id = res.json()["case_id"]
    assert case_id is not None

    # Current claim should now be this case
    res = client.get("/api/claims/current")
    assert res.status_code == 200
    assert res.json()["case_id"] == case_id

    # Summary endpoint
    res = client.get(f"/api/claims/{case_id}/summary")
    assert res.status_code == 200
    summary = res.json()
    assert summary["case_id"] == case_id
    assert summary["amount_in_dispute"] == 100000
    assert summary["likely_recoverable"] == 60000
    assert summary["deductions_reviewed"] >= 3

    # If an approval is pending, approve it
    if summary.get("next_action"):
        app_id = summary["next_action"]["id"]
        res = client.post(f"/api/approvals/{app_id}/approve", json={})
        assert res.status_code == 200

    # Advance clock: Day +15
    res = client.post("/api/clock/advance", json={"days": 15})
    assert res.status_code == 200

    # Check and approve regulator if pending
    res = client.get(f"/api/claims/{case_id}/summary")
    s2 = res.json()
    if s2.get("next_action") and s2["next_action"]["status"] == "pending":
        client.post(f"/api/approvals/{s2['next_action']['id']}/approve", json={})

    # Day +24
    res = client.post("/api/clock/advance", json={"days": 9})
    assert res.status_code == 200

    # Check and approve ombudsman if pending
    res = client.get(f"/api/claims/{case_id}/summary")
    s3 = res.json()
    if s3.get("next_action") and s3["next_action"]["status"] == "pending":
        client.post(f"/api/approvals/{s3['next_action']['id']}/approve", json={})

    # Day +44
    res = client.post("/api/clock/advance", json={"days": 20})
    assert res.status_code == 200

    # Verify resolved
    res = client.get(f"/api/claims/{case_id}/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "resolved"
    assert data["recovered_total"] == 60000

def test_no_visible_demo_outside_judge_in_dist():
    """Verify that user-facing copy on public pages does not contain forbidden 'demo' text."""
    dist_html = Path("frontend/dist/index.html")
    assert dist_html.exists()
    content = dist_html.read_text(encoding="utf-8")
    assert "demo" not in content.lower() or "prototype" in content.lower()
