from typing import Any, Dict, Optional
from backend.app.schemas import (
    FactSheet, InsurerInfo, PolicyInfo, PolicyClause, ClaimInfo,
    BillItem, RoomInfo, LetterInfo, DeductionItem,
    Verdict, OverallVerdict, VerdictLine, LocalizedText,
    EvidenceRef, ToolResultItem
)

def get_scripted_factsheet(language: str = "en") -> FactSheet:
    return FactSheet(
        insurer=InsurerInfo(
            name="Meridian Health Insurance Co. Ltd.",
            grievance_email="grievance@meridian-health.example",
            grievance_officer="Mr. A. Kulkarni"
        ),
        policy=PolicyInfo(
            policy_no="MH-FF-2021-004512",
            product="Suraksha Plus Family Floater",
            holder="Priya Raghavan",
            sum_insured=500000,
            inception_date="2021-04-01",
            renewal_dates=[
                "2022-04-01", "2023-04-01", "2024-04-01", "2025-04-01", "2026-04-01"
            ],
            clauses=[
                PolicyClause(
                    id="2.1",
                    title="Sum Insured",
                    text="The Sum Insured under this policy is ₹5,00,000 per policy year on a family floater basis.",
                    page=2
                ),
                PolicyClause(
                    id="3.2",
                    title="Room Rent",
                    text="Room rent is covered up to ₹5,000 per day. If a higher category room is opted for, all associated medical expenses shall be reduced in the same proportion (proportionate deduction).",
                    page=2
                ),
                PolicyClause(
                    id="4.1",
                    title="Initial Waiting Period",
                    text="No claim is payable for illness in the first 30 days of the first policy.",
                    page=3
                ),
                PolicyClause(
                    id="4.2",
                    title="Pre-Existing Disease Waiting Period",
                    text="Pre-existing diseases are covered after 36 months of continuous coverage.",
                    page=3
                ),
                PolicyClause(
                    id="5.4",
                    title="Moratorium",
                    text="After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud.",
                    page=3
                ),
                PolicyClause(
                    id="6.1",
                    title="Non-Payable Items",
                    text="Consumables listed in Annexure I are not payable.",
                    page=4
                ),
                PolicyClause(
                    id="8.1",
                    title="Grievance Redressal",
                    text="The Insurer shall acknowledge a complaint within 3 days and endeavour to resolve it within 15 days at grievance@meridian-health.example.",
                    page=4
                ),
            ]
        ),
        claim=ClaimInfo(
            patient="Ramesh Raghavan",
            admission="2026-08-10",
            discharge="2026-08-14",
            billed_total=240000,
            approved_total=140000,
            claim_submitted_on="2026-08-20"
        ),
        bill_items=[
            BillItem(category="room", label="Room charges (Single Deluxe Private)", amount=26000, page=1),
            BillItem(category="nursing", label="Nursing & Patient Care Charges", amount=9000, page=1),
            BillItem(category="doctor", label="Surgeon & Anaesthetist Professional Fees", amount=60000, page=1),
            BillItem(category="other", label="Orthopaedic Knee Implant Kit", amount=80000, page=1),
            BillItem(category="medicine", label="Medicines & Inpatient Pharmacy", amount=25000, page=2),
            BillItem(category="investigations", label="Investigations, X-Ray & Laboratory", amount=22000, page=2),
            BillItem(category="consumables", label="Consumables (Gloves, surgical kits, PPE)", amount=18000, page=2),
        ],
        room=RoomInfo(rate_per_day=6500, days=4),
        letter=LetterInfo(
            date="2026-09-05",
            reference="MH/CLM/2026/118742",
            deductions=[
                DeductionItem(
                    id="D1",
                    amount=60000,
                    stated_reason="Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2).",
                    cited_clause="4.2",
                    quote="Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2).",
                    page=1
                ),
                DeductionItem(
                    id="D2",
                    amount=22000,
                    stated_reason="Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2).",
                    cited_clause="3.2",
                    quote="Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2).",
                    page=1
                ),
                DeductionItem(
                    id="D3",
                    amount=18000,
                    stated_reason="Non-payable consumables (Annexure I, Clause 6.1).",
                    cited_clause="6.1",
                    quote="Non-payable consumables (Annexure I, Clause 6.1).",
                    page=1
                ),
            ]
        ),
        missing=[],
        confidence=0.98
    )

def get_scripted_verdict(language: str = "en") -> Verdict:
    summaries = {
        "en": "We analysed your 3 documents. The insurer wrongly deducted ₹60,000 under non-disclosure; your policy completed 64 months of continuous cover, so Clause 5.4 Moratorium bars this deduction. However, deductions D2 (₹22,000 proportionate room rent) and D3 (₹18,000 consumables) are valid under your policy terms.",
        "hi": "हमने आपके 3 दस्तावेजों का विश्लेषण किया। बीमाकर्ता ने गैर-प्रकटीकरण के तहत ₹60,000 गलत तरीके से काटे; आपकी पॉलिसी के 64 महीने पूरे हो चुके हैं, अतः क्लॉज 5.4 (मोरेटोरियम) के तहत यह कटौती अवैध है। हालांकि कटौती D2 (₹22,000 कमरा किराया) और D3 (₹18,000 उपभोग्य) आपकी पॉलिसी के अनुसार वैध हैं।",
        "ta": "நாங்கள் உங்கள் 3 ஆவணங்களையும் ஆய்வு செய்தோம். முந்தைய நோய் என்ற தவறான காரணத்திற்காக காப்பீட்டாளர் பிடித்தம் செய்த ₹60,000 தவறானது; உங்கள் பாலிசி 64 மாதங்கள் நிறைவடைந்துள்ளதால் கிளாஸ் 5.4 படி இப்பிடித்தம் செல்லாது. ஆனால் D2 (₹22,000 விகிதாசார அறை வாடகை) மற்றும் D3 (₹18,000 நுகர்பொருட்கள்) உங்கள் பாலிசி விதிமுறைகளின்படி சரியானவையே."
    }

    d1_reasoning = {
        "en": "The insurer rejected ₹60,000 alleging pre-existing hypertension under Clause 4.2. However, your continuous policy duration is 64 months (from 2021-04-01 to admission on 2026-08-10). Under Policy Clause 5.4 and IRDAI Moratorium rules (R_MORATORIUM), claims cannot be repudiated on non-disclosure grounds after 60 continuous months.",
        "hi": "बीमा कंपनी ने क्लॉज 4.2 का हवाला देकर ₹60,000 काटे। लेकिन आपका निरंतर कवरेज 64 महीने का है। पॉलिसी क्लॉज 5.4 एवं आईआरडीएआई मोरेटोरियम नियम के तहत 60 महीने बाद गैर-प्रकटीकरण के आधार पर क्लेम खारिज नहीं किया जा सकता।",
        "ta": "கிளாஸ் 4.2-ஐக் கூறி காப்பீட்டாளர் ₹60,000-ஐ நிராகரித்துள்ளார். ஆனால் உங்கள் பாலிசி தொடர்ந்து 64 மாதங்கள் செயலில் உள்ளது. கிளாஸ் 5.4 மற்றும் IRDAI விதிகளின்படி 60 மாதங்களுக்குப் பிறகு இக்காரணத்தைக் கூறி க்ளெய்மை நிராகரிக்க முடியாது."
    }

    d2_reasoning = {
        "en": "Your policy caps room rent at ₹5,000/day (Clause 3.2). A room charged at ₹6,500/day was opted for. Associated medical expenses (room, nursing, surgeon fees totaling ₹95,000) are subject to proportionate reduction (approx 23.08% = ₹21,923). The deducted amount of ₹22,000 matches within standard rounding tolerance. This deduction is valid.",
        "hi": "आपकी पॉलिसी में कमरे का किराया ₹5,000/दिन तक सीमित है (क्लॉज 3.2)। वास्तविक कमरा ₹6,500/दिन था। आनुपातिक गणना ₹21,923 आती है जो ₹22,000 से मेल खाती है। यह कटौती पॉलिसी के अनुसार वैध है।",
        "ta": "உங்கள் பாலிசியில் அறை வாடகை வரம்பு நாள் ஒன்றுக்கு ₹5,000 (கிளாஸ் 3.2). மருத்துவமனையில் நாள் ஒன்றுக்கு ₹6,500 அறை எடுக்கப்பட்டது. இதற்கான விகிதாசார பிடித்தம் ₹21,923 வருகிறது. எனவே ₹22,000 பிடித்தம் செய்யப்பட்டது பாலிசி விதிகளின்படி சரியானதே."
    }

    d3_reasoning = {
        "en": "Hospital consumables totaling ₹18,000 are explicitly non-payable under Policy Clause 6.1 and IRDAI Standard Annexure I. This deduction is fair and compliant with the policy.",
        "hi": "पॉलिसी क्लॉज 6.1 और आईआरडीएआई दिशानिर्देशों के तहत ₹18,000 की अस्पताल उपभोग्य वस्तुएं देय नहीं हैं। यह कटौती उचित है।",
        "ta": "மருத்துவமனை நுகர்பொருட்கள் ₹18,000 பாலிசி கிளாஸ் 6.1 மற்றும் IRDAI விதிகளின்படி வழங்கப்பட மாட்டாது. இப்பிடித்தம் சரியானதே."
    }

    chosen_lang = language if language in summaries else "en"

    return Verdict(
        overall=OverallVerdict(
            disputed_total=100000,
            likely_recoverable=60000,
            summary_en=summaries["en"],
            summary_local=LocalizedText(lang=chosen_lang, text=summaries[chosen_lang])
        ),
        lines=[
            VerdictLine(
                deduction_id="D1",
                verdict="strong_case",
                confidence=0.87,
                recoverable_amount=60000,
                reasoning_en=d1_reasoning["en"],
                reasoning_local=LocalizedText(lang=chosen_lang, text=d1_reasoning[chosen_lang]),
                evidence=[
                    EvidenceRef(
                        source="policy",
                        quote="After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud.",
                        page=3
                    ),
                    EvidenceRef(
                        source="letter",
                        quote="Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2).",
                        page=1
                    )
                ],
                rule_ids=["R_MORATORIUM", "R_PED_WAITING"],
                tool_results=[
                    ToolResultItem(
                        tool="continuous_coverage",
                        output={
                            "inception_date": "2021-04-01",
                            "on_date": "2026-08-10",
                            "continuous_months": 64,
                            "is_continuous": True,
                            "meets_moratorium_60m": True
                        }
                    )
                ]
            ),
            VerdictLine(
                deduction_id="D2",
                verdict="valid_deduction",
                confidence=0.95,
                recoverable_amount=0,
                reasoning_en=d2_reasoning["en"],
                reasoning_local=LocalizedText(lang=chosen_lang, text=d2_reasoning[chosen_lang]),
                evidence=[
                    EvidenceRef(
                        source="policy",
                        quote="Room rent is covered up to ₹5,000 per day. If a higher category room is opted for, all associated medical expenses shall be reduced in the same proportion (proportionate deduction).",
                        page=2
                    ),
                    EvidenceRef(
                        source="letter",
                        quote="Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2).",
                        page=1
                    )
                ],
                rule_ids=["R_PROPORTIONATE_ROOM"],
                tool_results=[
                    ToolResultItem(
                        tool="calc_proportionate_deduction",
                        output={
                            "eligible_total": 95000,
                            "actual_rate": 6500,
                            "limit_rate": 5000,
                            "expected_deduction": 21923,
                            "insurer_deducted": 22000,
                            "difference": 77,
                            "is_within_tolerance": True
                        }
                    )
                ]
            ),
            VerdictLine(
                deduction_id="D3",
                verdict="valid_deduction",
                confidence=0.95,
                recoverable_amount=0,
                reasoning_en=d3_reasoning["en"],
                reasoning_local=LocalizedText(lang=chosen_lang, text=d3_reasoning[chosen_lang]),
                evidence=[
                    EvidenceRef(
                        source="policy",
                        quote="Consumables listed in Annexure I are not payable.",
                        page=4
                    ),
                    EvidenceRef(
                        source="letter",
                        quote="Non-payable consumables (Annexure I, Clause 6.1).",
                        page=1
                    )
                ],
                rule_ids=["R_NON_PAYABLE_LIST"],
                tool_results=[]
            )
        ],
        recommended_path=["gro", "regulator", "ombudsman"]
    )

def get_scripted_fallback_verdict(factsheet: FactSheet, language: str = "en") -> Verdict:
    """Honest fallback verdict for uploaded documents when Live AI is unavailable."""
    disputed = sum(d.amount for d in factsheet.letter.deductions) or 50000
    lines = []
    for d in factsheet.letter.deductions:
        lines.append(VerdictLine(
            deduction_id=d.id,
            verdict="need_info",
            confidence=0.5,
            recoverable_amount=0,
            reasoning_en=f"Automated offline scan for deduction {d.id} ({d.stated_reason or 'Amount ' + str(d.amount)}). Live AI analysis is required to evaluate against your full policy wording.",
            reasoning_local=LocalizedText(lang="en", text="Live AI connection needed for new documents."),
            evidence=[],
            rule_ids=[],
            tool_results=[]
        ))

    return Verdict(
        overall=OverallVerdict(
            disputed_total=disputed,
            likely_recoverable=0,
            summary_en="Documents parsed in offline mode. Connect Gemini API in Settings for live multi-agent reasoning on new documents.",
            summary_local=LocalizedText(lang="en", text="Live AI connection needed for new documents.")
        ),
        lines=lines,
        recommended_path=["gro"]
    )
