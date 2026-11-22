# ClaimKavach — Your Family's Shield Against Unfair Health-Insurance Rejections

> **"Don't accept the first 'No'."**
> An autonomous multi-agent AI web application (Lekha, Nyaya, Doot, Rakshak) that analyzes insurance policy wording, hospital bills, and rejection letters to fight unfair claim deductions for Indian policyholders.

Built for **IDEA//FORGE Online Hackathon — Track 1 (Civic Pulse, Digital Governance)**, Problem Idea 3 (Autonomous Public Service & Bureaucracy Execution Agent).

---

## 🛡️ Key Features

- **4 Specialized Agents**:
  - **Lekha (Reader)**: Extracts policy clauses, bill items, and rejection line items from PDFs with deterministic cross-verification.
  - **Nyaya (Judge)**: Determines validity line by line (`strong_case`, `possible`, `valid_deduction`, `need_info`) using strict computational tools.
  - **Doot (Escalator)**: Prepares formal grievance letters across a 5-step escalation ladder (GRO → Bima Bharosa → Ombudsman → Consumer Commission).
  - **Rakshak (Guardian)**: Enforces strict user consent, PII redaction, quote verification, and tone guardrails.
- **Virtual-Clock Time Machine**: Advance time (+1, +3, +7, +15, +30 days) to simulate deadlines, insurer replies, and automatic escalations.
- **Simulated Twins**: In-process simulated insurer grievance mailbox (`/twin/insurer`) and regulator portal (`/twin/regulator`).
- **Interactive Evidence Viewer**: Split-screen document inspection with bounding box highlight overlays for exact cited clauses.
- **Judge Mode & One-Click Demo**: 60-second end-to-end demo flow for hackathon judges with customizable pacing and insurer behavior.
- **Multi-language Support**: English, हिन्दी (Hindi), and தமிழ் (Tamil).
- **100% Free-Tier & Privacy Preserving**: Zero paid APIs or required credit cards. Synthetic data only.

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Windows
```cmd
run.bat
```

### macOS / Linux
```bash
chmod +x run.sh
./run.sh
```

The app will be available at **http://localhost:8000**.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:
```env
GEMINI_API_KEY=               # Optional: Gemini API key for Live AI mode (free tier)
GEMINI_MODEL=gemini-2.5-flash # Default model
GEMINI_RPM=8                  # Rate limit per minute
DEFAULT_MODE=auto             # 'auto', 'demo', or 'live'
DEMO_START_DATE=2026-09-08    # Initial virtual date
DEMO_PACING=1.0               # Simulation speed multiplier
PORT=8000                     # Port to run on
```
*Note: If no Gemini API key is provided, ClaimKavach runs seamlessly in **Demo Simulation Mode** with real tools, state machine, twin engine, and virtual clock.*

---

## 🧪 Testing

Run backend test suite:
```bash
pytest backend/tests -v
```

---

## 🏛️ Disclaimer
Prototype built for demonstration purposes. Uses synthetic data only. Not legal advice. Insurer & regulator portals are simulated.
