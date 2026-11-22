from typing import Any, Dict

def compute_interest(amount: float, days_late: int, rate_percent: float = 8.5) -> Dict[str, Any]:
    """
    Computes statutory penal interest estimate per IRDAI PPI regulations (Bank Rate + 2%).
    Clearly marked as an estimate.
    """
    if days_late <= 0 or amount <= 0:
        return {
            "amount": amount,
            "days_late": max(days_late, 0),
            "rate_percent": rate_percent,
            "estimated_interest": 0,
            "total_with_interest": amount,
            "is_estimate": True,
            "note": "No delayed days accrued."
        }

    # Simple interest formula per IRDAI PPI regulations
    interest_raw = amount * (rate_percent / 100.0) * (days_late / 365.0)
    estimated_interest = round(interest_raw)

    return {
        "amount": amount,
        "days_late": days_late,
        "rate_percent": rate_percent,
        "estimated_interest": estimated_interest,
        "total_with_interest": amount + estimated_interest,
        "is_estimate": True,
        "note": f"Estimated penal interest at {rate_percent}% p.a. for {days_late} days late under IRDAI PPI Regulations."
    }
