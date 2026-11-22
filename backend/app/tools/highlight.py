import re
from pathlib import Path
from typing import Any, Dict, List
import fitz  # PyMuPDF

def find_highlights(pdf_path: Path, quote: str) -> List[Dict[str, Any]]:
    """
    Locates text bounding boxes for a quote inside a PDF.
    Returns list of rect objects with page index and pixel/percentage dimensions.
    """
    clean_quote = " ".join(quote.strip().split())
    if not clean_quote:
        return []

    results: List[Dict[str, Any]] = []
    doc = fitz.open(str(pdf_path))

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        page_num = page_idx + 1
        pw = page.rect.width
        ph = page.rect.height

        # 1. Direct search
        rects = page.search_for(clean_quote)

        # 2. If not found and quote is long, try search by first and last sentence fragments
        if not rects and len(clean_quote) > 30:
            words = clean_quote.split()
            # Try first 6 words
            first_chunk = " ".join(words[:6])
            rects_first = page.search_for(first_chunk)
            if rects_first:
                rects.extend(rects_first)
                # Try subsequent chunks if available
                if len(words) > 10:
                    mid_chunk = " ".join(words[6:12])
                    rects.extend(page.search_for(mid_chunk))

        for r in rects:
            results.append({
                "page": page_num,
                "x0": round(r.x0, 2),
                "y0": round(r.y0, 2),
                "x1": round(r.x1, 2),
                "y1": round(r.y1, 2),
                "pw": round(pw, 2),
                "ph": round(ph, 2),
                "pct_x0": round(r.x0 / pw, 4),
                "pct_y0": round(r.y0 / ph, 4),
                "pct_w": round((r.x1 - r.x0) / pw, 4),
                "pct_h": round((r.y1 - r.y0) / ph, 4),
            })

    doc.close()
    return results
