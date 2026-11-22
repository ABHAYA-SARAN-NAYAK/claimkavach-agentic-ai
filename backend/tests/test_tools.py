from backend.app.tools.months import months_between
from backend.app.tools.coverage import continuous_coverage
from backend.app.tools.proportionate import calc_proportionate_deduction
from backend.app.tools.deadline import check_deadline
from backend.app.tools.interest import compute_interest
from backend.app.tools.rules import lookup_rule, search_rules

def test_months_between():
    res = months_between("2021-04-01", "2026-08-10", threshold=60)
    assert res["months"] == 64
    assert res["meets_threshold"] is True

def test_continuous_coverage():
    renewals = ["2022-04-01", "2023-04-01", "2024-04-01", "2025-04-01", "2026-04-01"]
    res = continuous_coverage("2021-04-01", renewals, "2026-08-10")
    assert res["continuous_months"] == 64
    assert res["is_continuous"] is True
    assert res["meets_moratorium_60m"] is True
    assert res["meets_ped_36m"] is True
    assert len(res["gaps_found"]) == 0

def test_calc_proportionate_deduction():
    # Room cap = 5000, actual = 6500, eligible items = 95000, insurer deducted = 22000
    res = calc_proportionate_deduction(
        eligible_total=95000,
        actual_rate=6500,
        limit_rate=5000,
        insurer_deducted=22000
    )
    # 95000 * (1500 / 6500) ≈ 21923.08
    assert res["expected_deduction"] == 21923
    assert res["difference"] == 77
    assert res["is_within_tolerance"] is True

def test_check_deadline():
    res = check_deadline("2026-09-08", 15, "2026-09-20")
    assert res["due_date"] == "2026-09-23"
    assert res["days_left"] == 3
    assert res["urgency"] == "warning"
    assert res["is_overdue"] is False

def test_compute_interest():
    res = compute_interest(amount=60000, days_late=30, rate_percent=8.5)
    assert res["is_estimate"] is True
    assert res["estimated_interest"] > 0
    assert res["total_with_interest"] > 60000

def test_rules():
    r = lookup_rule("R_MORATORIUM")
    assert r is not None
    assert r["params"]["months"] == 60
    assert r["verified"] is False

    matches = search_rules("moratorium")
    assert len(matches) >= 1
