import io
from pathlib import Path
from typing import Any, Dict, List
import fitz  # PyMuPDF
from PIL import Image

def process_pdf(pdf_path: Path, output_dir: Path) -> List[Dict[str, Any]]:
    """
    Extracts text and renders high-quality page PNGs (max width 1000px) from a PDF.
    Returns page metadata: page_num (1-indexed), text, png_path, width, height.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(str(pdf_path))
    pages_meta: List[Dict[str, Any]] = []

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        page_num = page_idx + 1
        text = page.get_text("text")

        # Render page to PNG at 150 dpi (zoom = 150/72 ≈ 2.08)
        zoom = 2.0
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)

        png_path = output_dir / f"page_{page_num}.png"
        pix.save(str(png_path))

        rect = page.rect
        pages_meta.append({
            "page": page_num,
            "text": text,
            "png_filename": f"page_{page_num}.png",
            "png_path": str(png_path),
            "width": rect.width,
            "height": rect.height,
        })

    doc.close()
    return pages_meta
