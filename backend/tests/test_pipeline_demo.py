import json
from backend.app.db import init_db, get_connection
from backend.app.clock import reset_virtual_clock, set_virtual_now, advance_virtual_days
from backend.app.routes_api import (
    load_judge_demo, get_case, approve_action, ApprovalActionRequest,
    advance_clock, AdvanceClockRequest
)
from backend.app.twin.engine import set_judge_config

def test_full_judge_demo_simulation_flow():
    # 1. Initialize clean DB and reset clock to 2026-09-08
    init_db()
    reset_virtual_clock()
    set_judge_config({
        "insurer_behavior": "partial_offer",
        "auto_approve": False,
        "pacing": 1.0
    })

    # 2. Trigger demo load
    demo_res = load_judge_demo(sync=True)
    case_id = demo_res["case_id"]
    assert case_id is not None

    # Fetch case details
    case_data = get_case(case_id)
    assert case_data["insurer"] == "Meridian Health Insurance Co. Ltd."
    assert case_data["policy_no"] == "MH-FF-2021-004512"

    # Verify Verdict lines per PRD Section 7 & 15:
    # D1 strong_case Rs 60,000; D2 and D3 valid_deduction; recoverable_total = 60,000
    verdict = case_data["verdict"]
    assert verdict is not None
    assert verdict["overall"]["likely_recoverable"] == 60000
    assert verdict["overall"]["disputed_total"] == 100000

    lines = {l["deduction_id"]: l for l in verdict["lines"]}
    assert lines["D1"]["verdict"] == "strong_case"
    assert lines["D1"]["recoverable_amount"] == 60000

    assert lines["D2"]["verdict"] == "valid_deduction"
    assert lines["D2"]["recoverable_amount"] == 0

    assert lines["D3"]["verdict"] == "valid_deduction"
    assert lines["D3"]["recoverable_amount"] == 0

    # Verify next action approval is pending
    next_action = case_data["next_action"]
    assert next_action is not None
    assert next_action["status"] == "pending"
    approval_id = next_action["id"]

    # 3. User approves GRO complaint
    app_res = approve_action(approval_id, ApprovalActionRequest())
    assert app_res["status"] == "approved"

    # 4. Advance clock by 15 days (Day +15 -> 2026-09-23)
    adv1 = advance_clock(AdvanceClockRequest(days=15))
    assert adv1["virtual_now"] == "2026-09-23"

    # Verify GRO step is done and Regulator step is active
    c_after_15 = get_case(case_id)
    ladder_map = {s["step"]: s["status"] for s in c_after_15["ladder"]}
    assert ladder_map["gro"] == "done"
    assert ladder_map["regulator"] in ("active", "waiting")

    # Approve regulator step if pending
    reg_app = c_after_15["next_action"]
    if reg_app and reg_app["status"] == "pending":
        approve_action(reg_app["id"], ApprovalActionRequest())

    # 5. Advance clock by 9 days (Day +24 -> 2026-10-02)
    adv2 = advance_clock(AdvanceClockRequest(days=9))
    assert adv2["virtual_now"] == "2026-10-02"

    # Partial offer arrives -> declined -> Ombudsman opened
    c_after_24 = get_case(case_id)
    ladder_map2 = {s["step"]: s["status"] for s in c_after_24["ladder"]}
    assert ladder_map2["regulator"] == "done"
    assert ladder_map2["ombudsman"] in ("active", "waiting")

    omb_app = c_after_24["next_action"]
    if omb_app and omb_app["status"] == "pending":
        approve_action(omb_app["id"], ApprovalActionRequest())

    # 6. Advance clock by 20 days (Day +44 -> 2026-10-22)
    adv3 = advance_clock(AdvanceClockRequest(days=20))
    assert adv3["virtual_now"] == "2026-10-22"

    # Verify Case Resolved with Rs 60,000 recovered!
    c_resolved = get_case(case_id)
    assert c_resolved["status"] == "resolved"
    assert c_resolved["recovered_total"] == 60000

    # Verify metrics
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT bytes_retained, deadlines_met FROM metrics WHERE case_id = ?", (case_id,))
    m = cur.fetchone()
    conn.close()
    assert m is not None
    assert m["bytes_retained"] == 0
