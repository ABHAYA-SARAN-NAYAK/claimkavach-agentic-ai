from datetime import datetime, timedelta
from typing import Any, Dict, List
from backend.app.tools.months import months_between

def continuous_coverage(
    inception_date: str,
    renewal_dates: List[str],
    on_date: str
) -> Dict[str, Any]:
    """
    Evaluates continuous policy coverage from inception through renewal dates up to on_date.
    Checks for lapses (standard IRDAI grace period is 30 days).
    """
    d_inc = datetime.strptime(inception_date, "%Y-%m-%d").date()
    d_on = datetime.strptime(on_date, "%Y-%m-%d").date()

    # Parse and sort all renewal dates
    parsed_renewals = []
    for r in renewal_dates:
        if isinstance(r, str) and r.strip():
            parsed_renewals.append(datetime.strptime(r.strip(), "%Y-%m-%d").date())
    parsed_renewals.sort()

    timeline = [d_inc] + parsed_renewals
    gaps: List[Dict[str, Any]] = []

    # Check for gaps between yearly periods (standard policy year = 365/366 days)
    for i in range(len(timeline) - 1):
        prev = timeline[i]
        curr = timeline[i + 1]
        # Expected renewal is ~1 year later (365 - 366 days)
        # Gap occurs if difference between renewals exceeds 365 + 30 days grace period
        diff_days = (curr - prev).days
        if diff_days > 396:  # 366 + 30
            gaps.append({
                "from": prev.strftime("%Y-%m-%d"),
                "to": curr.strftime("%Y-%m-%d"),
                "gap_days": diff_days - 365,
                "reason": "Renewal lapsed beyond 30-day grace period"
            })

    # If gaps occurred, continuous coverage is measured from the last gap; else from inception
    effective_start = timeline[-1] if gaps else d_inc
    if gaps:
        calc = months_between(effective_start.strftime("%Y-%m-%d"), on_date)
    else:
        calc = months_between(inception_date, on_date)

    continuous_months = calc["months"]

    return {
        "inception_date": inception_date,
        "on_date": on_date,
        "renewal_count": len(parsed_renewals),
        "continuous_months": continuous_months,
        "is_continuous": len(gaps) == 0,
        "gaps_found": gaps,
        "meets_moratorium_60m": continuous_months >= 60,
        "meets_ped_36m": continuous_months >= 36,
    }
