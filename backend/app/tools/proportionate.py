from typing import Any, Dict, Optional

def calc_proportionate_deduction(
    eligible_total: float,
    actual_rate: float,
    limit_rate: float,
    insurer_deducted: Optional[float] = None
) -> Dict[str, Any]:
    """
    Computes proportionate deduction on associated medical expenses when room rent exceeds the policy cap.
    Formula:
      ratio = (actual_rate - limit_rate) / actual_rate
      expected_deduction = eligible_total * ratio
    """
    if actual_rate <= limit_rate or actual_rate <= 0:
        return {
            "eligible_total": eligible_total,
            "actual_rate": actual_rate,
            "limit_rate": limit_rate,
            "ratio": 0.0,
            "expected_deduction": 0,
            "difference": (0 - (insurer_deducted or 0)),
            "is_within_tolerance": (insurer_deducted or 0) <= 0,
        }

    ratio = (actual_rate - limit_rate) / actual_rate
    expected_deduction_raw = eligible_total * ratio
    expected_deduction = round(expected_deduction_raw)

    diff = 0
    within_tolerance = True
    if insurer_deducted is not None:
        diff = abs(insurer_deducted - expected_deduction)
        # Tolerance: difference <= 500 or <= 2% of deduction is considered standard hospital/insurer rounding
        within_tolerance = (diff <= 500) or (diff / max(expected_deduction, 1) < 0.03)

    return {
        "eligible_total": eligible_total,
        "actual_rate": actual_rate,
        "limit_rate": limit_rate,
        "ratio_percent": round(ratio * 100, 2),
        "expected_deduction": expected_deduction,
        "insurer_deducted": insurer_deducted,
        "difference": diff,
        "is_within_tolerance": within_tolerance,
    }
