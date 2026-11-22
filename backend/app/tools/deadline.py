from datetime import datetime, timedelta
from typing import Any, Dict

def check_deadline(from_date_str: str, days: int, today_str: str) -> Dict[str, Any]:
    """
    Computes deadline, days left, and urgency classification.
    Urgency:
      - 'critical' if 0 <= days_left <= 2
      - 'warning' if 3 <= days_left <= 5
      - 'normal' if days_left > 5
      - 'overdue' if days_left < 0
    """
    d_from = datetime.strptime(from_date_str, "%Y-%m-%d").date()
    d_today = datetime.strptime(today_str, "%Y-%m-%d").date()

    d_due = d_from + timedelta(days=days)
    days_left = (d_due - d_today).days
    is_overdue = days_left < 0

    if is_overdue:
        urgency = "overdue"
        label = f"Overdue by {abs(days_left)} day{'s' if abs(days_left) != 1 else ''}"
    elif days_left <= 2:
        urgency = "critical"
        label = f"Reply due in {days_left} day{'s' if days_left != 1 else ''}"
    elif days_left <= 5:
        urgency = "warning"
        label = f"Reply due in {days_left} days"
    else:
        urgency = "normal"
        label = f"Reply due in {days_left} days"

    return {
        "from_date": from_date_str,
        "window_days": days,
        "due_date": d_due.strftime("%Y-%m-%d"),
        "today": today_str,
        "days_left": days_left,
        "is_overdue": is_overdue,
        "urgency": urgency,
        "label": label,
    }
