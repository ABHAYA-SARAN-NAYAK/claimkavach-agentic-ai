from datetime import datetime
from typing import Any, Dict, Optional

def months_between(start_date_str: str, end_date_str: str, threshold: Optional[int] = None) -> Dict[str, Any]:
    """
    Computes whole completed months between start_date and end_date.
    If threshold is provided, checks whether completed months >= threshold.
    """
    d1 = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    d2 = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    if d2 < d1:
        return {
            "start_date": start_date_str,
            "end_date": end_date_str,
            "months": 0,
            "days_remainder": 0,
            "meets_threshold": False if threshold else None,
            "threshold": threshold
        }

    # Month difference
    years_diff = d2.year - d1.year
    months_diff = d2.month - d1.month
    total_months = years_diff * 12 + months_diff

    # If end day of month is less than start day of month, we haven't completed this full month
    if d2.day < d1.day:
        total_months -= 1
        # days into remainder
        # rough or exact remainder
        days_remainder = (d2 - d1.replace(year=d1.year + (total_months // 12), month=(d1.month + (total_months % 12)))).days if total_months >= 0 else 0
    else:
        days_remainder = d2.day - d1.day

    meets = (total_months >= threshold) if threshold is not None else None

    return {
        "start_date": start_date_str,
        "end_date": end_date_str,
        "months": total_months,
        "days_remainder": days_remainder,
        "meets_threshold": meets,
        "threshold": threshold,
    }
