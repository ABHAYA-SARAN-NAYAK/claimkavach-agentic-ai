import json
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from backend.app.config import SAMPLES_DIR
from backend.app.tools.pdfs import process_pdf

class WatermarkCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        page_count = len(self.pages)
        for page in self.pages:
            self.__dict__.update(page)
            self.draw_watermark()
            super().showPage()
        super().save()

    def draw_watermark(self):
        self.saveState()
        self.setFont("Helvetica-Bold", 32)
        self.setFillColor(colors.Color(0.85, 0.85, 0.88, alpha=0.35))
        self.translate(300, 420)
        self.rotate(45)
        self.drawCentredString(0, 0, "SYNTHETIC SAMPLE — NOT A REAL DOCUMENT")
        self.restoreState()

def create_policy_pdf(pdf_path: Path):
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#241263"),
        spaceAfter=10
    )
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#5A38F0"),
        spaceBefore=12,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0B1220"),
        spaceAfter=6
    )
    bold_style = ParagraphStyle(
        'DocBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    story = []

    # Page 1: Policy Schedule & Renewal History
    story.append(Paragraph("MERIDIAN HEALTH INSURANCE CO. LTD.", title_style))
    story.append(Paragraph("Suraksha Plus Family Floater — Policy Schedule", h2_style))
    story.append(Spacer(1, 10))

    sched_data = [
        [Paragraph("<b>Policy Number:</b>", body_style), Paragraph("MH-FF-2021-004512", body_style)],
        [Paragraph("<b>Policyholder:</b>", body_style), Paragraph("Priya Raghavan", body_style)],
        [Paragraph("<b>Primary Insured:</b>", body_style), Paragraph("Ramesh Raghavan (Father, Age: 58)", body_style)],
        [Paragraph("<b>Sum Insured:</b>", body_style), Paragraph("₹5,00,000 per policy year", body_style)],
        [Paragraph("<b>Original Inception Date:</b>", body_style), Paragraph("2021-04-01", body_style)],
        [Paragraph("<b>Current Policy Period:</b>", body_style), Paragraph("2026-04-01 to 2027-03-31", body_style)],
        [Paragraph("<b>Grievance Officer:</b>", body_style), Paragraph("Mr. A. Kulkarni (grievance@meridian-health.example)", body_style)],
    ]
    t_sched = Table(sched_data, colWidths=[160, 350])
    t_sched.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F6F7FB")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_sched)
    story.append(Spacer(1, 15))

    story.append(Paragraph("Policy Continuous Renewal History", h2_style))
    renewal_data = [
        ["Policy Year", "Period From", "Period To", "Status"],
        ["Year 1 (Inception)", "01-Apr-2021", "31-Mar-2022", "Active / Renewed"],
        ["Year 2 (Renewal)", "01-Apr-2022", "31-Mar-2023", "Renewed"],
        ["Year 3 (Renewal)", "01-Apr-2023", "31-Mar-2024", "Renewed"],
        ["Year 4 (Renewal)", "01-Apr-2024", "31-Mar-2025", "Renewed"],
        ["Year 5 (Renewal)", "01-Apr-2025", "31-Mar-2026", "Renewed"],
        ["Year 6 (Renewal)", "01-Apr-2026", "31-Mar-2027", "Active (Continuous)"],
    ]
    t_renew = Table(renewal_data, colWidths=[130, 120, 120, 140])
    t_renew.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E3DCFF")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor("#241263")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_renew)

    # Page 2: Section 2 & Section 3
    story.append(PageBreak())
    story.append(Paragraph("SECTION 2 — COVERAGE AND SUM INSURED", h2_style))
    story.append(Paragraph("<b>2.1 Sum Insured</b> — The Sum Insured under this policy is ₹5,00,000 per policy year on a family floater basis.", body_style))
    story.append(Paragraph("The sum insured applies collectively to all insured persons named in the Policy Schedule.", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("SECTION 3 — ROOM RENT AND HOSPITAL CHARGES", h2_style))
    story.append(Paragraph("<b>3.2 Room Rent</b> — Room rent is covered up to ₹5,000 per day. If a higher category room is opted for, all associated medical expenses shall be reduced in the same proportion (proportionate deduction).", body_style))
    story.append(Paragraph("Associated medical expenses include nursing fees, doctor and specialist charges, operation theatre charges, and surgeon fees. Medicines, diagnostic tests, and implants are excluded from proportionate deduction.", body_style))

    # Page 3: Section 4 & Section 5
    story.append(PageBreak())
    story.append(Paragraph("SECTION 4 — WAITING PERIODS", h2_style))
    story.append(Paragraph("<b>4.1 Initial Waiting Period</b> — No claim is payable for illness in the first 30 days of the first policy.", body_style))
    story.append(Paragraph("<b>4.2 Pre-Existing Disease Waiting Period</b> — Pre-existing diseases are covered after 36 months of continuous coverage.", body_style))
    story.append(Paragraph("Any condition declared at proposal or diagnosed before inception is subject to continuous renewal completion.", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("SECTION 5 — GENERAL TERMS AND MORATORIUM", h2_style))
    story.append(Paragraph("<b>5.4 Moratorium</b> — After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud.", body_style))
    story.append(Paragraph("This clause applies to all policies that have completed five continuous years without a lapse in renewal.", body_style))

    # Page 4: Section 6 & Section 8
    story.append(PageBreak())
    story.append(Paragraph("SECTION 6 — EXCLUSIONS AND NON-PAYABLE ITEMS", h2_style))
    story.append(Paragraph("<b>6.1 Non-Payable Items</b> — Consumables listed in Annexure I are not payable.", body_style))
    story.append(Paragraph("Charges for disposable items including surgical gloves, masks, PPE, sanitisers, diapers, admission kits, and food supplements are non-admissible.", body_style))
    story.append(Spacer(1, 15))

    story.append(Paragraph("SECTION 8 — GRIEVANCE REDRESSAL MECHANISM", h2_style))
    story.append(Paragraph("<b>8.1 Grievance Redressal</b> — The Insurer shall acknowledge a complaint within 3 days and endeavour to resolve it within 15 days at grievance@meridian-health.example.", body_style))
    story.append(Paragraph("Policyholders not satisfied with the response may approach the Insurance Ombudsman appointed under the Insurance Ombudsman Rules, 2017.", body_style))

    doc.build(story, canvasmaker=WatermarkCanvas)

def create_bill_pdf(pdf_path: Path):
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'BillTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor("#0D9488"),
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BillBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0B1220")
    )
    h2_style = ParagraphStyle(
        'BillH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#0F766E"),
        spaceBefore=8,
        spaceAfter=6
    )

    story = []

    # Page 1: Hospital Header, Patient details & Items 1-4
    story.append(Paragraph("CITY CARE HOSPITAL, CHENNAI", title_style))
    story.append(Paragraph("FINAL INPATIENT BILL (SUMMARY)", h2_style))
    story.append(Spacer(1, 8))

    pat_info = [
        [Paragraph("<b>Patient Name:</b>", body_style), Paragraph("Ramesh Raghavan", body_style),
         Paragraph("<b>Bill No:</b>", body_style), Paragraph("CCH/BILL/2026/8941", body_style)],
        [Paragraph("<b>Age / Gender:</b>", body_style), Paragraph("58 / Male", body_style),
         Paragraph("<b>Date of Admission:</b>", body_style), Paragraph("2026-08-10", body_style)],
        [Paragraph("<b>Primary Doctor:</b>", body_style), Paragraph("Dr. K. Swaminathan (Ortho)", body_style),
         Paragraph("<b>Date of Discharge:</b>", body_style), Paragraph("2026-08-14", body_style)],
        [Paragraph("<b>Procedure:</b>", body_style), Paragraph("Total Knee Replacement (Left)", body_style),
         Paragraph("<b>Stay Duration:</b>", body_style), Paragraph("4 Days", body_style)],
    ]
    t_pat = Table(pat_info, colWidths=[110, 150, 110, 140])
    t_pat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0F2F8")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_pat)
    story.append(Spacer(1, 12))

    story.append(Paragraph("Hospital Bill Items (Part 1)", h2_style))
    items_p1 = [
        ["Sl", "Item Category & Description", "Qty / Days", "Rate (₹)", "Amount (₹)"],
        ["1", "Room charges (Single Deluxe Private)", "4 days", "6,500", "26,000"],
        ["2", "Nursing & Patient Care Charges", "4 days", "2,250", "9,000"],
        ["3", "Surgeon & Anaesthetist Professional Fees", "1 procedure", "60,000", "60,000"],
        ["4", "Orthopaedic Knee Implant Kit", "1 unit", "80,000", "80,000"],
    ]
    t_items1 = Table(items_p1, colWidths=[30, 240, 75, 75, 90])
    t_items1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#C2F5EB")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('ALIGN', (2,0), (-1,-1), 'RIGHT'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_items1)

    # Page 2: Items 5-7, Totals & Signatures
    story.append(PageBreak())
    story.append(Paragraph("Hospital Bill Items (Part 2 — Continued)", h2_style))
    items_p2 = [
        ["Sl", "Item Category & Description", "Qty / Days", "Rate (₹)", "Amount (₹)"],
        ["5", "Medicines & Inpatient Pharmacy", "Detailed list", "-", "25,000"],
        ["6", "Investigations, X-Ray & Laboratory", "Panels", "-", "22,000"],
        ["7", "Consumables (Gloves, surgical kits, PPE)", "Lump sum", "-", "18,000"],
        ["", "TOTAL BILLED AMOUNT", "", "", "₹2,40,000"],
    ]
    t_items2 = Table(items_p2, colWidths=[30, 240, 75, 75, 90])
    t_items2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#C2F5EB")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-2), 0.5, colors.HexColor("#CBD0E0")),
        ('GRID', (0,-1), (-1,-1), 1, colors.HexColor("#0D9488")),
        ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor("#E6FBF7")),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('ALIGN', (2,0), (-1,-1), 'RIGHT'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_items2)
    story.append(Spacer(1, 25))

    sign_data = [
        [Paragraph("Prepared by: Billing Desk", body_style),
         Paragraph("Authorised Signatory: City Care Hospital", body_style)]
    ]
    t_sign = Table(sign_data, colWidths=[250, 260])
    story.append(t_sign)

    doc.build(story, canvasmaker=WatermarkCanvas)

def create_letter_pdf(pdf_path: Path):
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'LetterTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=colors.HexColor("#B42318"),
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'LetterBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#0B1220"),
        spaceAfter=6
    )
    h2_style = ParagraphStyle(
        'LetterH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#B42318"),
        spaceBefore=8,
        spaceAfter=6
    )

    story = []

    # Page 1: Rejection & Settlement Letter Header and Deductions Table
    story.append(Paragraph("MERIDIAN HEALTH INSURANCE CO. LTD.", title_style))
    story.append(Paragraph("CLAIM SETTLEMENT AND DISBURSEMENT VOUCHER", h2_style))
    story.append(Spacer(1, 6))

    meta_info = [
        [Paragraph("<b>Date:</b>", body_style), Paragraph("2026-09-05", body_style),
         Paragraph("<b>Claim Reference:</b>", body_style), Paragraph("MH/CLM/2026/118742", body_style)],
        [Paragraph("<b>Policyholder:</b>", body_style), Paragraph("Priya Raghavan", body_style),
         Paragraph("<b>Policy No:</b>", body_style), Paragraph("MH-FF-2021-004512", body_style)],
        [Paragraph("<b>Patient Name:</b>", body_style), Paragraph("Ramesh Raghavan", body_style),
         Paragraph("<b>Hospital:</b>", body_style), Paragraph("City Care Hospital, Chennai", body_style)],
        [Paragraph("<b>Billed Amount:</b>", body_style), Paragraph("₹2,40,000", body_style),
         Paragraph("<b>Approved Amount:</b>", body_style), Paragraph("₹1,40,000", body_style)],
    ]
    t_meta = Table(meta_info, colWidths=[100, 160, 110, 140])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEECEB")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD0E0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Itemised Deduction Details", h2_style))
    ded_data = [
        ["Item", "Deduction Reason & Cited Clause", "Disallowed (₹)"],
        [
            "D1",
            Paragraph("Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2).", body_style),
            "₹60,000"
        ],
        [
            "D2",
            Paragraph("Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2).", body_style),
            "₹22,000"
        ],
        [
            "D3",
            Paragraph("Non-payable consumables (Annexure I, Clause 6.1).", body_style),
            "₹18,000"
        ],
        [
            "",
            Paragraph("<b>TOTAL DEDUCTIONS APPLIED:</b>", body_style),
            "<b>₹1,00,000</b>"
        ]
    ]
    t_ded = Table(ded_data, colWidths=[40, 380, 90])
    t_ded.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#FEECEB")),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('GRID', (0,0), (-1,-2), 0.5, colors.HexColor("#CBD0E0")),
        ('GRID', (0,-1), (-1,-1), 1, colors.HexColor("#B42318")),
        ('ALIGN', (2,0), (2,-1), 'RIGHT'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_ded)

    # Page 2: Settlement summary & Ombudsman notice
    story.append(PageBreak())
    story.append(Paragraph("Settlement Breakdown & Rights Notice", h2_style))
    story.append(Paragraph("Net approved amount of ₹1,40,000 has been initiated via NEFT to your registered bank account.", body_style))
    story.append(Paragraph("Please note that all deductions applied above are strictly in accordance with policy terms and conditions agreed at proposal.", body_style))
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>Ombudsman details are available on request.</b>", body_style))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Claims Department<br/>Meridian Health Insurance Co. Ltd.", body_style))

    doc.build(story, canvasmaker=WatermarkCanvas)

def generate_all_samples():
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

    policy_pdf = SAMPLES_DIR / "policy_sample.pdf"
    bill_pdf = SAMPLES_DIR / "bill_sample.pdf"
    letter_pdf = SAMPLES_DIR / "letter_sample.pdf"

    print("Generating Policy PDF...")
    create_policy_pdf(policy_pdf)
    print("Generating Hospital Bill PDF...")
    create_bill_pdf(bill_pdf)
    print("Generating Settlement Letter PDF...")
    create_letter_pdf(letter_pdf)

    # Process and render page PNGs for each PDF
    print("Rendering page PNGs...")
    policy_pages = process_pdf(policy_pdf, SAMPLES_DIR / "policy_pages")
    bill_pages = process_pdf(bill_pdf, SAMPLES_DIR / "bill_pages")
    letter_pages = process_pdf(letter_pdf, SAMPLES_DIR / "letter_pages")

    # Generate meta.json per PRD section 7
    meta = {
        "scenario": "judge_demo",
        "policy": {
            "filename": "policy_sample.pdf",
            "pages": len(policy_pages),
            "quotes": [
                "The Sum Insured under this policy is ₹5,00,000 per policy year on a family floater basis.",
                "Room rent is covered up to ₹5,000 per day. If a higher category room is opted for, all associated medical expenses shall be reduced in the same proportion (proportionate deduction).",
                "No claim is payable for illness in the first 30 days of the first policy.",
                "Pre-existing diseases are covered after 36 months of continuous coverage.",
                "After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud.",
                "Consumables listed in Annexure I are not payable.",
                "The Insurer shall acknowledge a complaint within 3 days and endeavour to resolve it within 15 days at grievance@meridian-health.example."
            ]
        },
        "bill": {
            "filename": "bill_sample.pdf",
            "pages": len(bill_pages),
            "items_total": 240000,
            "quotes": [
                "Room charges (Single Deluxe Private)",
                "Nursing & Patient Care Charges",
                "Surgeon & Anaesthetist Professional Fees",
                "Consumables (Gloves, surgical kits, PPE)"
            ]
        },
        "letter": {
            "filename": "letter_sample.pdf",
            "pages": len(letter_pages),
            "deductions_total": 100000,
            "quotes": [
                "Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2).",
                "Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2).",
                "Non-payable consumables (Annexure I, Clause 6.1).",
                "Ombudsman details are available on request."
            ]
        }
    }

    meta_path = SAMPLES_DIR / "meta.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    print(f"Sample generation completed. Meta saved to {meta_path}")

if __name__ == "__main__":
    generate_all_samples()
