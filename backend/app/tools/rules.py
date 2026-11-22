import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from backend.app.config import DATA_DIR

_RULES_CACHE: Optional[List[Dict[str, Any]]] = None

def load_rules() -> List[Dict[str, Any]]:
    global _RULES_CACHE
    if _RULES_CACHE is None:
        rules_path = DATA_DIR / "rules.json"
        if rules_path.exists():
            with open(rules_path, "r", encoding="utf-8") as f:
                _RULES_CACHE = json.load(f)
        else:
            _RULES_CACHE = []
    return _RULES_CACHE

def lookup_rule(rule_id: str) -> Optional[Dict[str, Any]]:
    rules = load_rules()
    for r in rules:
        if r.get("id") == rule_id:
            return r
    return None

def search_rules(query: str) -> List[Dict[str, Any]]:
    q = query.lower().strip()
    rules = load_rules()
    matches = []
    for r in rules:
        text = f"{r.get('id', '')} {r.get('title', '')} {r.get('plain_en', '')} {r.get('applies_to', '')}".lower()
        if q in text:
            matches.append(r)
    return matches
