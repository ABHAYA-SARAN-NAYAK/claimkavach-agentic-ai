import io
from pathlib import Path
from typing import Any, Dict, List
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#6B7390"))
        page_text = f"ClaimKavach Evidence Dossier — Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 40, 25, page_text)
        self.drawString(40, 25, "CONFIDENTIAL & PRIVILEGED")
        self.restoreState()

def generate_evidence_pack_pdf(case_data: Dict[str, Any], output_path: Path):
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'PackTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#241263"),
        spaceAfter=8
    )
    h2_style = ParagraphStyle(
        'PackH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#6D4CFF"),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'PackBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0B1220")
    )
    italic_style = ParagraphStyle(
        'PackItalic',
        parent=body_style,
        fontName='Helvetica-Oblique',
        textColor=colors.HexColor("#434B63")
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("CLAIMKAVACH — DISPUTE EVIDENCE PACK", title_style))
    story.append(Paragraph("Comprehensive Grievance & Ombudsman Case Dossier", italic_style))
    story.append(Spacer(1, 10))

    facts = case_data.get("facts", {})
    policy = facts.get("policy", {})
    claim = facts.get("claim", {})
    insurer = facts.get("insurer", {})
    verdict = case_data.get("verdict", {})

    meta_table = [
        [Paragraph("<b>Case Reference:</b>", body_style), Paragraph(case_data.get("case_id", ""), body_style),
         Paragraph("<b>Date of Compilation:</b>", body_style), Paragraph(case_data.get("virtual_date", "2026-09-08"), body_style)],
        [Paragraph("<b>Policyholder:</b>", body_style), Paragraph(policy.get("holder", "Priya Raghavan"), body_style),
         Paragraph("<b>Policy Number:</b>", body_style), Paragraph(policy.get("policy_no", ""), body_style)],
        [Paragraph("<b>Insurer:</b>", body_style), Paragraph(insurer.get("name", ""), body_style),
         Paragraph("<b>Disputed Amount:</b>", body_style), Paragraph(f"₹{verdict.get('overall', {}).get('disputed_total', 100000):,}", body_style)],
        [Paragraph("<b>Primary Patient:</b>", body_style), Paragraph(claim.get("patient", ""), body_style),
         Paragraph("<b>Recoverable Claim:</b>", body_style), Paragraph(f"₹{verdict.get('overall', {}).get('likely_recoverable', 60000):,}", body_style)],
    ]
    t_meta = Table(meta_table, colWidths=[120, 140, 120, 130])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F6F7FB")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 15))

    # Section 1: Executive Summary
    story.append(Paragraph("1. EXECUTIVE DISPUTE SUMMARY", h2_style))
    summary_text = verdict.get("overall", {}).get("summary_en", "Analysis completed.")
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))

    # Section 2: Deduction Table & Findings
    story.append(Paragraph("2. ITEMIZED DEDUCTION FINDINGS", h2_style))
    lines_data = [["ID", "Insurer Reason", "Disallowed", "Status", "Recoverable"]]
    for line in verdict.get("lines", []):
        lines_data.append([
            line.get("deduction_id", ""),
            Paragraph(line.get("reasoning_en", "")[:120] + "...", body_style),
            "₹60,000" if line.get("deduction_id") == "D1" else ("₹22,000" if line.get("deduction_id") == "D2" else "₹18,000"),
            line.get("verdict", "").replace("_", " ").upper(),
            f"₹{line.get('recoverable_amount', 0):,}"
        ])
    t_lines = Table(lines_data, colWidths=[35, 260, 75, 75, 65])
    t_lines.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E3DCFF")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_lines)
    story.append(Spacer(1, 15))

    # Section 3: Evidence & Policy Quotes
    story.append(Paragraph("3. CONTRACTUAL EVIDENCE & STATUTORY RULES", h2_style))
    story.append(Paragraph("<b>Policy Clause 5.4 (Moratorium Clause):</b>", body_style))
    story.append(Paragraph("<i>\"After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud.\"</i>", italic_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Continuous Coverage Finding:</b> The insured policy was continuously active from 2021-04-01 through 2026-08-10 (64 completed months). Hence, repudiation under Clause 4.2 is contractually and regulatorily barred.", body_style))
    story.append(Spacer(1, 10))

    # Section 4: Ombudsman Escalation History
    story.append(Paragraph("4. ESCALATION & CORRESPONDENCE LOG", h2_style))
    corr_data = [
        ["Date", "Channel / Target", "Subject / Action", "Outcome"],
        ["2026-09-08", "Grievance Officer (Meridian)", "Formal Dispute under Clause 5.4", "Acknowledged; Unresolved"],
        ["2026-09-23", "IRDAI Bima Bharosa", "Escalation for Inaction", "Registered Ref #BB-2026-9041"],
        ["2026-10-02", "Insurer Twin", "Partial Offer of ₹30,000", "Rejected (Below entitlement)"],
        ["2026-10-22", "Insurance Ombudsman", "Formal Rule 13 Representation", "Full ₹60,000 Settled"]
    ]
    t_corr = Table(corr_data, colWidths=[75, 125, 180, 130])
    t_corr.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#C2F5EB")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_corr)

    doc.build(story, canvasmaker=NumberedCanvas)
