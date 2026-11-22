# ClaimKavach (क्लेमकवच) 🛡️

**Autonomous Health Insurance Claim Dispute Defense Agent for Indian Families**

ClaimKavach is a multi-agent AI system designed to analyze health insurance claim rejections, compute wrongful deductions, verify policy clauses with bounding-box evidence, and execute statutory grievance escalations under IRDAI regulations.

---

## 🤖 Gemini AI Models & Free Tier Architecture

ClaimKavach operates on a resilient dual-model strategy using Google's free-tier Gemini models:
- **Primary Model**: `gemini-2.5-flash` — Used by Lekha (Reader), Nyaya (Judge), and Doot (Escalator) for deep policy clause extraction and statutory legal reasoning.
- **Backup Model**: `gemini-2.5-flash-lite` — Automatically engaged if the primary model hits HTTP 429 / quota limits, or is temporarily unavailable.
- **Offline Deterministic Fallback**: If network or quota limits are completely exhausted, ClaimKavach transparently activates the scripted fallback factory so the demonstration and user dispute workflow never crashes.
- **Zero Pro Models**: Completely compliant with 100% free-tier constraints (no credit card required).

### Getting a Free Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Set in your `.env` or paste directly into the in-app **Settings Drawer**.

### Changing Models
You can customize models in `.env` or in real-time inside the **Settings Drawer**:
```env
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.5-flash-lite
GEMINI_RPM=8
```

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
GEMINI_API_KEY=               # Optional: Free Gemini API key from aistudio.google.com
GEMINI_MODEL=gemini-2.5-flash # Primary model for Lekha, Nyaya, Doot
GEMINI_FALLBACK_MODEL=gemini-2.5-flash-lite # Backup model for quota/rate limit retry
GEMINI_RPM=8                  # Rate limit per minute
DEFAULT_MODE=auto             # 'auto', 'demo', or 'live'
DEMO_START_DATE=2026-09-08    # Initial virtual date
PORT=8000                     # Port to run on
```
*Note: If no Gemini API key is provided, ClaimKavach runs seamlessly in **Demo Simulation Mode** with real PyMuPDF highlights, calculation tools, state machine, twin engine, and virtual clock.*

---

## 🧪 Testing

Run backend test suite:
```bash
pytest backend/tests -v
```

---

## 🏛️ Disclaimer
Prototype built for demonstration purposes. Uses synthetic data only. Not legal advice. Insurer and regulator portals are simulated.
