from backend.app.db import init_db
from backend.app.ladder import init_case_ladder, get_ladder_steps, update_step_status

def test_ladder_lifecycle():
    init_db()
    case_id = "test_ladder_case"
    init_case_ladder(case_id, "2026-09-08")

    steps = get_ladder_steps(case_id)
    assert len(steps) == 5
    assert steps[0]["step"] == "review"
    assert steps[0]["status"] == "active"
    assert steps[1]["step"] == "gro"
    assert steps[1]["status"] == "locked"

    # Advance step 1 to done and step 2 to active
    update_step_status(case_id, "review", "done")
    update_step_status(case_id, "gro", "active", opened_on="2026-09-08", deadline_on="2026-09-23")

    updated = get_ladder_steps(case_id)
    assert updated[0]["status"] == "done"
    assert updated[1]["status"] == "active"
    assert updated[1]["deadline_on"] == "2026-09-23"
