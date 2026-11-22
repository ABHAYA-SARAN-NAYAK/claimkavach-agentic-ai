# ClaimKavach — PRD.md

> **Your family's shield against unfair health-insurance rejections.**
> An autonomous multi-agent AI that reads your policy, hospital bill and rejection letter, tells you honestly whether the insurer is wrong, and then runs the whole complaint process for you — writing, sending, tracking deadlines and escalating — until the claim is paid or every option is used.

**Hackathon:** IDEA//FORGE Online Hackathon — Track 1 (Civic Pulse, Digital Governance), Problem Idea 3 (Autonomous Public Service & Bureaucracy Execution Agent).
**Build target:** A **prototype that looks and feels like a shipped, production-grade product** (think Linear / Stripe Dashboard / Razorpay quality), running on **100% free-tier infrastructure**.

---

## 0. Instructions for the AI coding agent (read first)

1. Build **exactly** what this file describes. Every page, component, endpoint, agent and animation must be **fully implemented and working**. No placeholders, no `TODO`, no `NotImplementedError`, no "lorem ipsum", no mock buttons that do nothing.
2. **Production-level polish is a hard requirement**: consistent design tokens, loading skeletons, empty states, error states, toasts, keyboard accessibility, responsive from 360 px to 1920 px, light + dark theme, smooth micro-animations.
3. **100% free tier, zero credit card.** Allowed: Gemini API free tier, SQLite, FastAPI, React/Vite, open-source libraries, Gmail SMTP (optional), Render free web service (optional). **Forbidden:** any paid API or paid hosting.
4. **One process, one port.** FastAPI serves the JSON API, the SSE stream, the simulated Insurer/Regulator "twin" endpoints, and the built React app from `frontend/dist`. Dev mode uses a Vite proxy.
5. **All data is synthetic.** Never use real names, policy numbers, Aadhaar, or health data. Show the honesty labels in §1.4 everywhere specified.
6. Use the font **Inter** (bundled via `@fontsource-variable/inter`, no CDN) for the entire UI. Use `JetBrains Mono` (`@fontsource/jetbrains-mono`) only for IDs, amounts in tables where tabular alignment is needed, and the agent log.
7. When something is ambiguous, choose the simplest option that keeps the **demo reliable**, and list it under "Deviations" in your final report.
8. Work in the order given in the companion build prompt. After each phase, run it and fix errors before moving on.

---

## 1. Product Overview

### 1.1 Name, pitch, problem
- **Name:** ClaimKavach ("Kavach" = shield). Tagline: **"Don't accept the first 'No'."**
- **One-line pitch:** Upload three papers. ClaimKavach finds out if your insurer is wrong, and fights for you until the claim is paid.
- **Problem:** When a family member is hospitalised, insurers often pay less than claimed or reject the claim with jargon-filled letters. Families, exhausted and worried, rarely check the policy wording, miss complaint deadlines, or give up. The complaint ladder (insurer grievance cell → regulator portal → ombudsman → consumer commission) has fixed windows, and missing one can kill the case.
- **Evidence for landing page & pitch (public reports, as of Nov 2026 — show with source links, see §16.3):**
  - Health-insurance complaints rose **41% to 1,37,361 in FY25** (IRDAI annual report, via Angel One).
  - **Nearly 7 in 10** complaints in general and health insurance relate to refused, delayed or partly paid claims and documentation disputes (same source).
  - A LocalCircles survey found **over 50%** of health policyholders who claimed in the past 3 years faced rejection or partial approval (Business Today).
  - Hansa Research CuES 2026: **4 in 10** claimants report issues (Moneylife, 21 Aug 2026).
  - IRDAI has **no data on why** health claims are denied (Insurance Business, parliamentary reply).
  - **IRDAI fined Star Health ₹2 crore** (Nov 2026) for rejecting claims on untenable grounds; policyholders were unaware of the basis for rejection or reduction (Business Standard / ETV Bharat).
- **Impact metrics shown in-app:** amount in dispute, amount likely recoverable, deadlines never missed, hours saved.

### 1.2 Target personas
1. **Priya Raghavan (34, Chennai, IT professional)** — primary. Her father was hospitalised; the insurer deducted ₹1,00,000. She has no time or legal knowledge. Wants clarity, control and zero chasing.
2. **Mr. Subramanian (62, retired, Madurai)** — secondary. Uncomfortable with English legalese; wants Tamil, big text, simple steps.
3. **Anita (41, Pune, bank clerk)** — policy holder for family of four; wants a "policy vault" to check coverage before a hospital visit.

### 1.3 Product principles
1. **Honest first.** Tell the user when the insurer is *right*. A trustworthy "this deduction is valid" is worth more than false hope.
2. **User stays in control.** Nothing is sent without explicit approval (one-tap "Approve & send").
3. **Evidence or silence.** Every claim the AI makes points to a highlighted line in the user's own documents or a stored rule. If it cannot, it says "I'm not sure".
4. **Calm design.** The user is stressed. Use generous whitespace, plain words, clear next step on every screen.
5. **Autonomy that is visible.** Judges and users can always see what each agent did, why, and with what evidence.

### 1.4 Honesty labels (must be visible exactly as specified)
- Persistent footer strip on every app page: `Prototype · Synthetic data only · Not legal advice · Insurer & regulator portals are simulated`.
- First-run modal "Before you start" (dismissible, remembered): explains the four points above in plain words.
- Rule cards show a badge `Reference rule — confirm on irdai.gov.in` when `verified=false` in `rules.json`.
- In Demo Simulation mode, a top-bar chip: `AI responses scripted · logic & tools real`.

### 1.5 MVP scope
**In scope:** Health-insurance claim **rejection or partial payment** disputes, one complete escalation ladder (insurer GRO → regulator portal → ombudsman pack), virtual clock ("Time Machine"), approvals, evidence viewer, multi-language UI (English, हिन्दी, தமிழ்), light/dark theme, Judge Mode.
**Out of scope:** Real insurers/regulator portals, real payments, login/accounts with real auth, life/motor insurance, cashless pre-authorisation, WhatsApp, native apps, any paid service.

---

## 2. Design System — "Calm Trust"

Goal: feel like a premium fintech/health product: **trustworthy, calm, modern, quietly powerful.** Light theme is default (trust, readability for older users); a polished dark theme is a toggle.

### 2.1 Colour tokens (implement as CSS variables in `index.css`, mapped in `tailwind.config.js`)

```css
:root {
  /* Brand */
  --brand-50:#F1EEFF; --brand-100:#E3DCFF; --brand-200:#C9BBFF; --brand-300:#A895FF;
  --brand-400:#8A72FF; --brand-500:#6D4CFF; --brand-600:#5A38F0; --brand-700:#4A2CCC; --brand-900:#241263;
  --teal-50:#E6FBF7; --teal-100:#C2F5EB; --teal-300:#5FE3CE; --teal-400:#2DD4BF; --teal-500:#14B8A6; --teal-600:#0D9488; --teal-700:#0F766E;

  /* Surfaces (light) */
  --bg:#F6F7FB; --surface:#FFFFFF; --surface-2:#F0F2F8; --surface-3:#E8EBF4;
  --border:#E3E6F0; --border-strong:#CBD0E0;

  /* Text (light) */
  --text:#0B1220; --text-2:#434B63; --text-3:#6B7390; --text-inverse:#FFFFFF;

  /* Semantic */
  --success:#12B76A; --success-bg:#E7F8F0; --success-text:#067647;
  --warning:#F79009; --warning-bg:#FFF4E0; --warning-text:#B54708;
  --danger:#F04438;  --danger-bg:#FEECEB;  --danger-text:#B42318;
  --info:#2E90FA;    --info-bg:#E8F2FF;    --info-text:#175CD3;

  /* Gradients */
  --grad-brand: linear-gradient(135deg,#6D4CFF 0%,#14B8A6 100%);
  --grad-hero: radial-gradient(1200px 600px at 15% -10%,rgba(109,76,255,.18),transparent 60%),
               radial-gradient(900px 500px at 95% 0%,rgba(20,184,166,.16),transparent 55%);

  /* Elevation */
  --shadow-xs:0 1px 2px rgba(16,24,40,.06);
  --shadow-sm:0 1px 3px rgba(16,24,40,.08),0 1px 2px rgba(16,24,40,.04);
  --shadow-md:0 8px 20px -6px rgba(16,24,40,.10),0 2px 6px rgba(16,24,40,.05);
  --shadow-lg:0 24px 48px -12px rgba(16,24,40,.18);
  --ring:0 0 0 3px rgba(109,76,255,.28);

  /* Radius */
  --r-sm:8px; --r-md:12px; --r-lg:16px; --r-xl:24px; --r-full:999px;
}
.dark {
  --bg:#0A0A0F; --surface:#12121A; --surface-2:#1A1A25; --surface-3:#232331;
  --border:rgba(255,255,255,.08); --border-strong:rgba(255,255,255,.16);
  --text:#F3F4F8; --text-2:#B5B9CC; --text-3:#8186A0;
  --brand-500:#8A72FF; --brand-600:#7A5FFF; --teal-500:#2DD4BF;
  --success-bg:rgba(18,183,106,.14); --warning-bg:rgba(247,144,9,.14);
  --danger-bg:rgba(240,68,56,.14);   --info-bg:rgba(46,144,250,.14);
  --success-text:#4ADE9B; --warning-text:#FDB022; --danger-text:#FF8A80; --info-text:#7CB9FF;
  --shadow-md:0 8px 24px -8px rgba(0,0,0,.6); --shadow-lg:0 28px 60px -12px rgba(0,0,0,.7);
  --grad-hero: radial-gradient(1100px 560px at 12% -10%,rgba(138,114,255,.22),transparent 60%),
               radial-gradient(900px 500px at 95% 0%,rgba(45,212,191,.16),transparent 55%);
}
```
**Agent colours (used for avatars, trace rows, stepper):** Lekha (Reader) `#6D4CFF`, Nyaya (Judge) `#F79009`, Doot (Escalator) `#14B8A6`, Rakshak (Guardian) `#F04438`, System `#8186A0`.
**Verdict colours:** Strong case = success, Possible = warning, Valid deduction = info (blue), Needs more info = neutral grey.

### 2.2 Typography (Inter Variable)
| Token | Size / Line | Weight | Use |
|---|---|---|---|
| display | 56/60 (desktop), 36/42 (mobile) | 700, tracking -0.03em | Landing hero |
| h1 | 32/40 | 650 | Page titles |
| h2 | 24/32 | 650 | Section titles |
| h3 | 18/26 | 600 | Card titles |
| body | 16/26 | 400 | Default |
| body-sm | 14/22 | 400/500 | Tables, meta |
| caption | 12/18 | 500, uppercase tracking .04em | Labels, chips |
| mono | 13/20 JetBrains Mono | 450 | IDs, agent log, amounts in tables |
Use `font-feature-settings: "cv11","ss01","tnum"` on numeric UI. Minimum body text 16 px; "Large text" setting scales root to 18 px.

### 2.3 Spacing, grid, layout
- 4 px base scale (4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 120).
- App shell: left **sidebar 264 px** (collapsible to 72 px icon rail), **top bar 64 px**, content `max-width: 1280px`, page padding 32 px desktop / 16 px mobile.
- Dashboard grid: 12 columns, 24 px gutter. Cards radius `--r-lg`, 1 px `--border`, `--shadow-sm`, hover lift (`translateY(-2px)` + `--shadow-md`) on interactive cards.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. On `< lg` the sidebar becomes a slide-over drawer and a **bottom tab bar** (Home, Cases, Approvals, Policies, More) appears with safe-area padding.

### 2.4 Motion
- Library: `framer-motion`. Easing `cubic-bezier(0.22, 1, 0.36, 1)`. Durations: micro 120 ms, UI 200 ms, page 280 ms, emphasis 600 ms.
- Page transition: fade + 8 px upward slide. Lists: staggered children (40 ms).
- Buttons: press scale 0.98; primary button has a soft sheen sweep on hover.
- Numbers: **count-up** on stat cards (800 ms, ease-out) when first in view.
- Stepper: connecting line **draws** to the active step; active node has a gentle pulse ring.
- Agent "thinking": three-dot wave in the agent's colour + shimmering text line.
- Verdict reveal: card scales from 0.96, confidence ring animates 0→value, evidence chips fade in sequentially.
- Success moment (claim recovered): shield icon with checkmark draws (SVG stroke), subtle radial glow, amount counts up. **No confetti.**
- Skeleton loaders (shimmer) for any async content > 150 ms.
- Respect `prefers-reduced-motion`: disable transforms/looping animations, keep opacity fades only.

### 2.5 Iconography & imagery
- `lucide-react`, 1.75 px stroke, 20 px default. No emoji in UI chrome.
- Illustrations: simple inline SVG (shield, documents, bridge-arch, timeline) in brand colours for empty states and landing sections. No stock photos.
- **Logo (inline SVG component `Logo.tsx`)** — shield with a check forming a small arch/bridge:
```svg
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="kg" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
    <stop stop-color="#6D4CFF"/><stop offset="1" stop-color="#14B8A6"/></linearGradient></defs>
  <path d="M24 4 7 10v12c0 11 7.2 18.3 17 22 9.8-3.7 17-11 17-22V10L24 4Z" fill="url(#kg)"/>
  <path d="M15 25.5c2.2-5.2 5.4-7.8 9-7.8s6.8 2.6 9 7.8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
  <path d="m18.5 27 4 4 7.5-8.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>
</svg>
```
Wordmark: "ClaimKavach" in Inter 700, "Claim" in `--text`, "Kavach" with `--grad-brand` text fill. Also generate `favicon.svg` and `manifest.webmanifest` (name, theme colour `#6D4CFF`, icons from the SVG).

### 2.6 Core components (build all, in `frontend/src/components/ui/`)
Button (primary / secondary / ghost / danger / icon; sizes sm md lg; loading state), Input, Textarea, Select, Checkbox, Switch, Segmented control, Tabs (animated underline), Badge/Chip, Card, Modal, Drawer, Tooltip, Popover, Dropdown menu, Toast (`sonner`), Skeleton, Progress bar, Confidence ring, Avatar, Kbd, Divider, EmptyState, ErrorState, Stat card, Data table (sortable, sticky header, responsive card-list on mobile), Command palette (`cmdk`, ⌘K / Ctrl+K), Stepper (horizontal desktop / vertical mobile), Dropzone, CountUp, CopyButton.

### 2.7 Accessibility & UX rules
- WCAG 2.1 AA contrast; visible focus ring (`--ring`) on all interactive elements; full keyboard navigation; skip-to-content link.
- Semantic landmarks; `aria-live="polite"` for the agent log and toasts; `aria-label` on icon buttons; tab order matches visual order.
- Touch targets ≥ 44 px on mobile. Forms: inline validation, helpful error text, never colour alone.
- Plain language: no insurance jargon without a tap-to-explain tooltip (glossary in §16.2).
- Every screen has exactly one primary action. Every empty state explains what to do next.
- Currency: `₹1,84,000` Indian grouping via `Intl.NumberFormat('en-IN')`. Dates `12 Sep 2026`. Relative time in tooltips.

---

## 3. Information Architecture & Routes

**Public (marketing) site**
| Route | Page |
|---|---|
| `/` | Landing |
| `/how-it-works` | How it works (agents, ladder, safety) |
| `/rights` | Know Your Rights library (public) |
| `/privacy` | Privacy & safety |

**App (after "Continue" on onboarding)** — all under `/app`
| Route | Page |
|---|---|
| `/app/onboarding` | 3-step onboarding (language, profile, consent notice) |
| `/app` | Dashboard |
| `/app/cases` | Cases list |
| `/app/cases/new` | New case wizard |
| `/app/cases/:id` | Case detail (tabs: Overview, Analysis, Timeline, Letters, Documents, Agent Log) |
| `/app/approvals` | Approvals inbox |
| `/app/policies` | Policy vault |
| `/app/rights` | Rights library (in-app, searchable) |
| `/app/settings` | Settings (profile, language, theme, AI mode, API key, Time Machine, data reset) |
| `/twin/insurer` | Simulated insurer inbox (read-only viewer used by Judge Mode) |
| `/twin/regulator` | Simulated regulator portal view (read-only) |

Global elements: Sidebar, Top bar (search ⌘K, virtual date chip, notifications bell, language switch, theme toggle, profile menu), Footer strip (§1.4), Judge Mode dock (floating, bottom-right, toggle with `J` key or ⚙ in top bar), Command palette.

---

## 4. Page-by-Page Specification

### 4.1 Landing `/` (public, must look like a funded startup site)
Sticky translucent nav (logo, How it works, Know your rights, Privacy, language switch, theme toggle, **Open the app** button).
1. **Hero** — gradient mesh background (`--grad-hero`) with slow-drifting blurred orbs (CSS animation, disabled on reduced motion). Headline: *"Insurance said no. We say, show me the policy."* Sub: *"ClaimKavach reads your papers, tells you honestly if the insurer is wrong, and fights the complaint process for you."* Buttons: **Start with Priya's case (demo)** (primary → loads judge scenario) and **See how it works** (secondary). Right side: an animated **product mock** (real React components, not an image): a case card with verdict ring counting to 87, evidence chips, and a mini timeline ticking forward.
2. **Trust strip** — "Built on public IRDAI & ombudsman processes" + 4 small chips: *Evidence-backed · You approve every send · Plain language · Free to use*.
3. **The problem in numbers** — 4 animated stat cards with the cited stats from §1.1, each with a small source link; below, a one-sentence line about the Star Health fine.
4. **How it works** — 4 steps with line-drawn icons and scroll-triggered reveal: *Upload 3 papers → We check the insurer's reasons → You approve the complaint → We chase and escalate*.
5. **Meet your agent team** — 4 cards (Lekha, Nyaya, Doot, Rakshak) with colour avatar, role, one example of "what it did", and hover flip to show its safety rule.
6. **Live preview** — interactive mini-demo of the Analysis screen (static data) with highlighted clause evidence.
7. **Honest by design** — three columns: *"Sometimes the insurer is right — we say so"*, *"Nothing is sent without your tap"*, *"No made-up law: every claim cites your own papers or a listed rule"*.
8. **Languages & accessibility** — EN / हिन्दी / தமிழ், large text mode, works on a ₹8,000 phone.
9. **FAQ** (accordion, 6 items: Is this legal advice? Will the insurer really reply? What does it cost? Is my data safe? What if I'm wrong? Which insurers?). Answers must be honest about the prototype status.
10. **Final CTA** and **footer** (disclaimer, sources list, hackathon credit).

### 4.2 How it works `/how-it-works`
Vertical storytelling page: the 5-rung **Escalation Ladder** diagram (animated), the 4 agents with their inputs/outputs, the "Evidence or silence" rule, a "What we will never do" list, and a pipeline diagram (SVG) of Reader → Judge → Approval → Escalator → Clock → Guardian.

### 4.3 Know Your Rights `/rights` and `/app/rights`
Searchable (client-side fuzzy) card list from `rules.json` plus glossary: each card shows title, plain-language explanation (EN/HI/TA), where it applies, source name + link, `verified` badge, and "Use in my case" (in-app only). Filters: Claim delay, Waiting period, Moratorium, Deductions, Complaint steps.

### 4.4 Privacy & safety `/privacy`
Plain-language page: what is stored (SQLite on the demo server), what leaves the server (document text sent to Gemini in Live mode, PII-scanned first), how to delete everything (one click in Settings), synthetic-data warning.

### 4.5 Onboarding `/app/onboarding`
Full-screen 3-step flow with progress dots and animated transitions:
1. **Choose language** (3 large cards). 2. **About you** (name, mobile — validated 10 digits, city optional) — stored in `worker_profiles` as `user_profiles`. 3. **How this works** (the four honesty points + "I understand" checkbox) → **Go to dashboard**. Skippable via "Use demo profile (Priya)".

### 4.6 Dashboard `/app`
Header: greeting ("Good evening, Priya") + virtual date chip + primary button **New case**.
Row 1 — **4 stat cards** (count-up): *Amount in dispute*, *Likely recoverable*, *Active cases*, *Next deadline* (with live countdown chip and a coloured urgency bar).
Row 2 — left (8 cols) **Active cases** list (CaseCard: insurer logo-initials avatar, claim title, amount, verdict badge, current ladder step mini-stepper, next deadline); right (4 cols) **Needs your approval** card stack (ApprovalCard compact) + **Agent activity** live feed (last 8 events, auto-updating).
Row 3 — **Recovery chart** (Recharts area: potential vs recovered over virtual time) and **Deadlines calendar strip** (next 30 virtual days, dots for deadlines).
Empty state (no cases): illustration + "Upload your first rejection letter" + **Load demo case** button.

### 4.7 Cases list `/app/cases`
Search, filter chips (All / Active / Awaiting you / Resolved), sort. Desktop = data table (Case, Insurer, Disputed, Status, Step, Next deadline); mobile = card list. Row click → case detail. Bulk nothing.

### 4.8 New case wizard `/app/cases/new`
Stepper at top (Upload → Check → Consent → Analyse).
1. **Upload**: three large Dropzones side by side (stacked on mobile): *Policy document*, *Hospital bill*, *Rejection / settlement letter*. Accept PDF, JPG, PNG, max 8 MB each. After upload: thumbnail of page 1, file name, size, replace/remove. Button **Use demo documents** fills all three with the synthetic set (§8).
2. **Check**: confirm basics the Reader pre-filled (editable): insurer name, policy number, patient name, claim amount, amount paid, rejection date. Shows skeletons while Reader runs; trace mini-log visible.
3. **Consent**: three itemised checkboxes — *Analyse my documents with AI*; *Draft complaints on my behalf*; *Send complaints only after I approve each one*. Also the synthetic-data warning.
4. **Analyse** → creates case, navigates to Case detail with the Analysis tab streaming live.

### 4.9 Case detail `/app/cases/:id`
**Header (sticky):** claim title, insurer, policy no., status badge, amounts (disputed / likely recoverable), virtual date, primary contextual action (e.g. "Review approval" or "Open ombudsman pack").
**Escalation Ladder bar** under the header: 5 rungs — *1 Review* · *2 Insurer GRO* · *3 Regulator (Bima Bharosa)* · *4 Insurance Ombudsman* · *5 Consumer Commission (your choice)* — each with state (done / active / waiting / locked), the deadline clock, and a tooltip with the rule behind the wait.
**Tabs (animated underline, URL-synced `?tab=`):**
1. **Overview** — verdict summary card, money breakdown donut (Valid deductions vs Contestable vs Paid), next-best-action card, mini timeline, latest correspondence.
2. **Analysis** — the heart of the product:
   - **Deduction table:** each deduction line with amount, insurer's stated reason, **Nyaya's verdict badge** (*Strong case / Possible / Valid deduction / Need more info*), confidence ring, and one-line plain explanation (in user's language).
   - Click a row → **Evidence panel** (split view): left = *Insurer says* (highlighted passage in the rejection letter), right = *Your policy says* (highlighted clause page image with yellow overlay boxes from PyMuPDF `search_for`), centre = *Why this matters* with the rule card(s) used and the tool results (e.g. "Continuous coverage at admission: 64 months · Moratorium in clause 5.4: 60 months").
   - **Honesty banner** when any deduction is valid: "This part looks fair under your policy. We will not fight it."
   - **Interest/delay estimator** (only if a delay rule applies) labelled *Estimate*.
3. **Timeline** — vertical timeline of everything (documents, analysis, approvals, sends, replies, clock jumps, escalations) with agent avatars, timestamps (virtual), and deadlines shown as flags. Filters by agent.
4. **Letters** — thread view of outbound/inbound messages (email-like cards with To/From/Subject/Date, status chips *Draft / Awaiting approval / Sent / Delivered(sim) / Replied*). Outbound drafts are editable (rich textarea) with **Approve & send**, **Save**, **Discard**. A **PDF** download for every letter and the **Evidence Pack** (cover, timeline, clause comparison, letters).
5. **Documents** — grid of the three uploads and generated PDFs; click opens full-screen viewer with page navigation, zoom, and evidence highlights toggle.
6. **Agent Log** — the live trace (§12) full-height, filter by agent, copy as JSON, "Pause autoscroll".
**Resolved state:** hero success card (shield draw animation, "₹60,000 recovered"), timeline summary, **Download case summary (print-friendly)**.

### 4.10 Approvals `/app/approvals`
Inbox of pending actions. **ApprovalCard:** what the agent wants to do ("Send complaint to Meridian Health's Grievance Officer"), why (one sentence + evidence chips), the full draft preview (expand), cost/risk note ("Starts a 15-day reply window"), buttons **Approve & send** (primary), **Edit**, **Not now**. After approval: card collapses with a check animation and a toast with *Undo* for 8 seconds (undo cancels before the simulated send fires).
Tabs: Pending / History.

### 4.11 Policy vault `/app/policies`
List of policies the Reader has extracted (insurer, policy no., sum insured, inception, continuous months, renewal chips). Detail drawer: **Coverage cheat-sheet** — key clauses extracted with page references (Room-rent limit, Waiting periods, Moratorium, Exclusions, Grievance contacts) shown as expandable rows, each with the highlighted source page. Button **Check this before a hospital visit** (opens a read-only summary).

### 4.12 Settings `/app/settings`
Sections (left sub-nav on desktop, accordion on mobile): **Profile**, **Language & display** (language, theme light/dark/system, large text), **AI engine** (Gemini key input — password type, stored in `localStorage`, "Test key" button; model name default `gemini-2.5-flash`; mode Auto / Live AI / Demo Simulation), **Email (optional)** (Gmail address + app password for real demo-inbox sending — stored in memory only for the session, never persisted), **Time Machine** (see §9.4), **Data** (Export JSON, **Delete all my data**), **About** (version, honesty labels, sources).

### 4.13 Simulated twins `/twin/insurer`, `/twin/regulator`
Clean, clearly labelled "SIMULATED" pages styled like a plain corporate inbox/portal. **Insurer twin:** shows the Grievance Officer inbox: received complaints, auto-acknowledgements, and scripted replies with virtual dates. **Regulator twin:** shows a "Bima Bharosa (simulated)" complaint register with reference numbers and status. Both read-only and auto-refresh via SSE; used on stage in a second tab/window.

### 4.14 Judge Mode dock (floating)
Collapsible panel: **Load Priya's case** (one click: creates case with demo docs and runs the pipeline), **Time Machine** quick buttons (+1 d, +3 d, +7 d, +15 d, +30 d), **Insurer behaviour** select (*Silent / Partial offer / Reject again / Pay in full*), **Auto-approve after 1.5 s** switch, **Pacing** slider (0.5×–2×), **Open insurer inbox**, **Open regulator portal**, **Reset demo**. Keyboard: `J` toggles, `T` jumps +3 days. Dock matches the design system (glass in dark mode).

### 4.15 Global behaviours
- **Command palette (⌘K):** navigate pages, open cases, run "New case", "Jump +3 days", "Toggle theme", "Switch language".
- **Notifications bell:** popover list of recent events (approval needed, reply received, deadline in 3 days) with unread dot; click deep-links.
- **Toasts:** success/info/error with action buttons.
- **Error boundary:** friendly full-page error with "Reload" and "Copy error id".
- **404 page:** shield illustration + back link.
- **Offline/slow:** banner if SSE disconnects, auto-reconnect with `Last-Event-ID`.
- **Print stylesheet** for the case summary and letters.

---

## 5. Core Agentic AI Architecture (the heart of the product)

### 5.1 Why agents are strictly required
- The task spans **weeks**, so it needs persistent state, a **clock**, and autonomous follow-up — a chatbot forgets and a normal app cannot decide.
- It requires **cross-document reasoning** (policy vs bill vs letter) plus deterministic tools (month counting, proportional-deduction recalculation).
- It requires **action**: drafting, sending, noticing silence, escalating — with a human approval gate and a grounding guardrail.

### 5.2 Agents (names and roles)
| Agent | Role | Colour |
|---|---|---|
| **Lekha** (Reader) | Extracts facts from the three documents | violet |
| **Nyaya** (Judge) | Decides, line by line, whether each deduction holds | amber |
| **Doot** (Escalator) | Drafts letters, plans the ladder, reacts to replies and silence | teal |
| **Rakshak** (Guardian) | Verifies evidence, blocks unsupported claims, enforces consent/approval, scans PII | red |

### 5.3 Shared types (`backend/app/schemas.py`, Pydantic v2; also mirrored in `frontend/src/lib/types.ts`)

```json
// FactSheet (output of Lekha)
{
  "insurer": {"name": "string", "grievance_email": "string|null", "grievance_officer": "string|null"},
  "policy": {
    "policy_no": "string", "product": "string", "holder": "string", "sum_insured": 0,
    "inception_date": "YYYY-MM-DD", "renewal_dates": ["YYYY-MM-DD"],
    "clauses": [{"id": "string", "title": "string", "text": "string", "page": 1}]
  },
  "claim": {"patient": "string", "admission": "YYYY-MM-DD", "discharge": "YYYY-MM-DD",
            "billed_total": 0, "approved_total": 0, "claim_submitted_on": "YYYY-MM-DD|null"},
  "bill_items": [{"category": "room|nursing|doctor|medicine|consumables|investigations|other", "label": "string", "amount": 0, "page": 1}],
  "room": {"rate_per_day": 0, "days": 0},
  "letter": {"date": "YYYY-MM-DD", "reference": "string|null",
             "deductions": [{"id": "D1", "amount": 0, "stated_reason": "string", "cited_clause": "string|null", "quote": "string", "page": 1}]},
  "missing": ["string"],
  "confidence": 0.0
}
// Verdict (output of Nyaya)
{
  "overall": {"disputed_total": 0, "likely_recoverable": 0, "summary_en": "string", "summary_local": {"lang": "hi|ta|en", "text": "string"}},
  "lines": [{
    "deduction_id": "D1", "verdict": "strong_case|possible|valid_deduction|need_info",
    "confidence": 0.0, "recoverable_amount": 0,
    "reasoning_en": "string", "reasoning_local": {"lang": "string", "text": "string"},
    "evidence": [{"source": "letter|policy|bill", "quote": "string", "page": 1}],
    "rule_ids": ["R_MORATORIUM"], "tool_results": [{"tool": "string", "output": {}}]
  }],
  "recommended_path": ["gro", "regulator", "ombudsman"]
}
// EscalationStep (state machine record)
{"step": "gro|regulator|ombudsman|consumer", "status": "locked|active|waiting|done|skipped",
 "opened_on": "date|null", "deadline_on": "date|null", "reply_due_days": 15, "notes": "string"}
```

### 5.4 Pipeline
`Consent check (Rakshak) → Lekha → [Rakshak verifies facts] → Nyaya → [Rakshak verifies evidence] → Approval gate → Doot (draft + send) → Clock waits → on event (reply/silence) → Nyaya re-evaluates (if reply) → Doot next step → … → Resolved/Exhausted → Rakshak purge & summary.`
Orchestrator: plain Python state machine (`orchestrator.py`), each stage runs in a background thread and emits trace events. **No LangGraph.** Persist `case_state` in SQLite after every stage so a refresh or restart resumes.

### 5.5 Agent specifications

#### Lekha (Reader)
- **Input:** text per page extracted with PyMuPDF; for scanned/image pages, page PNGs sent to Gemini vision. PII scan runs first.
- **Call:** one `generate_content` with `response_schema=FactSheet`.
- **System prompt (verbatim):**
```
You are Lekha, the document-reading agent of ClaimKavach, a tool that helps Indian families dispute health-insurance claim rejections.
You receive the text or images of three documents: an insurance policy, a hospital bill, and an insurer's claim settlement or rejection letter.
Extract ONLY what is written. Never guess. Use null when something is not present.
For every policy clause you return, copy the clause text EXACTLY as printed (no paraphrasing) and give its clause number and page.
For every deduction in the letter, copy the insurer's stated reason EXACTLY as a short quote and give its page.
List renewal dates if a renewal history table exists. List anything missing that would be needed to judge the claim.
Return ONLY JSON matching the schema.
```
- **Post-processing (deterministic):** verify every `quote` and clause `text` exists in the extracted document text (normalised whitespace/case). Any quote that is not found is dropped and added to `missing`.

#### Nyaya (Judge)
- **Tools** (real Python functions in `backend/app/tools/`, called by Gemini function-calling; every call emits `tool_call` + `tool_result` trace events):
  - `months_between(start_date, end_date)` → whole months + whether ≥ threshold.
  - `continuous_coverage(inception_date, renewal_dates, on_date)` → continuous months, gaps found.
  - `calc_proportionate_deduction(eligible_total, actual_rate, limit_rate)` → expected deduction and difference vs insurer's amount.
  - `lookup_rule(rule_id)` / `search_rules(query)` → from `rules.json`.
  - `check_deadline(from_date, days, today)` → due date, days left, urgency.
  - `compute_interest(amount, days_late, rate_percent)` → estimate (clearly labelled).
- **Two-phase calls:** (1) tool-using reasoning call (function calling on); (2) structured call with `response_schema=Verdict`, given the FactSheet and tool results. Never combine tools and schema in one call.
- **System prompt (verbatim):**
```
You are Nyaya, the judging agent of ClaimKavach. You examine each deduction in an insurer's claim letter and decide whether it is supported by the policy and by the rules in the rule library.
You MUST use the tools for any number, date or month calculation. Never calculate in your head.
For every deduction return one verdict: strong_case (the insurer's reason conflicts with the policy or a listed rule), possible (arguable but uncertain), valid_deduction (the insurer is right), or need_info.
Be honest. If the insurer is right, say valid_deduction. If you are not sure, say need_info or possible with LOW confidence.
Every verdict must include evidence quotes copied exactly from the provided documents, and the rule_ids you relied on (only ids that exist in the rule library).
Never invent laws, clauses or case names. Explain in simple words a worried family can understand, and also in the requested local language.
Return ONLY JSON matching the schema.
```

#### Doot (Escalator)
- **Responsibilities:** (a) draft the next letter for the current ladder step; (b) set deadline clocks; (c) on reply/silence ask Nyaya for a recommendation (accept / counter / escalate); (d) assemble the Evidence Pack; (e) never send without an approved `approval`.
- **Letter drafting:** one `generate_content` call to polish a **deterministic template** (templates in `backend/app/letters/*.j2` for GRO complaint, regulator complaint, ombudsman complaint, counter-offer response). The model may rewrite tone and fill plain-language facts; **it may not add facts, clauses or laws**. Rakshak checks the result.
- **System prompt (verbatim):**
```
You are Doot, the escalation agent of ClaimKavach. You draft formal, polite, firm complaint letters for Indian health-insurance policyholders.
Use ONLY the facts, clause quotes, amounts, dates and rule ids provided in the input. Do not add any fact, clause, law, case or deadline that is not in the input.
Structure: subject line, reference details, short facts, numbered grounds (each with the exact clause quote), the specific relief requested with amount, the response deadline, and a courteous close.
Keep it under 450 words. Return JSON: {"subject": string, "body": string}.
```
- **Ladder logic (`ladder.py`, deterministic):**
  | Step | Opens when | Wait window | If no/poor reply |
  |---|---|---|---|
  | 1 GRO complaint | User approves letter | `rules.json: R_GRO_REPLY_DAYS` (default 15 days; policy clause 8.1 says 15 days) | Open step 2 |
  | 2 Regulator (Bima Bharosa twin) | Window ended, or reply rejects | 15 days | Open step 3 |
  | 3 Ombudsman pack | Step 2 window ended/unsatisfied; must be within 1 year of insurer's final reply (`R_OMBUDSMAN_LIMIT`) | Pack generated; filing is simulated at the regulator twin | Offer step 4 |
  | 4 Consumer commission | User choice only | — | Draft + guidance only; no send |
  Each opening of a step creates a **pending approval**; it is never auto-sent (except when Judge Mode "auto-approve" is ON).

#### Rakshak (Guardian) — deterministic first, LLM second
1. **Consent gate:** blocks the pipeline unless all 3 consents are true; logs to `consents`.
2. **PII scan:** regexes (`\b\d{4}\s?\d{4}\s?\d{4}\b`, 9–18 digit runs, emails other than the insurer's) on outbound LLM payloads. Match → redact or block, increment `pii_blocked`, emit `guardrail` event.
3. **Evidence verifier:** every `evidence.quote` must be found in the case's document text; every `rule_id` must exist in `rules.json`; every number in a letter must match a value in FactSheet/Verdict. Failures → the line is downgraded to `need_info`, the letter is regenerated once with the failure listed, else the template-only version is used. Emit `guardrail` events with `judge_note`.
4. **Approval gate:** no outbound message without `approvals.status='approved'`.
5. **Tone check:** letters must not threaten legal action beyond listing the next lawful step; reject words from a small blocklist.
6. **Purge:** on resolution or "Delete all my data": delete uploaded files, page images and text; keep nothing; show "bytes_retained: 0".

### 5.6 LLM client rules (`llm.py`)
- Official `google-genai` SDK. Model from env `GEMINI_MODEL` (default `gemini-2.5-flash`; if it errors with "model not found", the app falls back to Demo Simulation and shows the reason).
- Key priority: request header `X-Gemini-Key` (from Settings/localStorage) → `.env`. Never log or persist the key.
- **Rate limiter:** token bucket `GEMINI_RPM` (default 8/min). Wait ≤ 20 s then fall back.
- **JSON safety:** schema-constrained output → on parse failure do one repair retry → else scripted fallback.
- **Per-call fallback:** any failure returns the scripted response in `demo/scripted.py` and emits a trace event with `source="fallback"` and a clear `judge_note`. **The pipeline never crashes because of the AI.**
- **Modes:** `auto` (Live if key works else Demo), `live`, `demo`. In `demo` mode the AI outputs are scripted but **all tools, validators, the clock, ladder and twin logic are real**, so the app is fully functional offline.
- Estimated calls per case: Lekha 1, Nyaya 2, Doot 1 per letter, Rakshak 0–1. Cache results per document hash in SQLite to protect free-tier limits.

### 5.7 Insurer & Regulator twins (simulation engine)
- In-process module `twin/engine.py` exposes `deliver(message)` and `tick(virtual_now)`.
- **Insurer behaviours** (chosen in Judge Mode or per scenario): `silent`, `partial_offer` (offers a goodwill amount below the strong-case amount), `reject_again` (repeats the original reasons), `pay_full`.
- Scripted timing for scenario `judge_demo` with behaviour `partial_offer`: Day +3 auto-acknowledgement; Day +15 no resolution; (after step 2 opened) Day +24 partial offer of ₹30,000 "as goodwill, without prejudice"; user/Doot declines (Nyaya: offer below strong-case amount ₹60,000) → ombudsman pack → Day +20 after filing: insurer agrees to pay ₹60,000 → case resolved.
- All twin messages are stored in `messages` with `direction='inbound'`, `simulated=1`, and labelled "Simulated" in the UI.
- **Optional real email:** if Gmail SMTP credentials are provided in Settings, outbound letters are also emailed to the demo inbox the presenter specifies (never to a real insurer). Failure to send never blocks the flow.

### 5.8 Rules library (`backend/app/data/rules.json`)
Each entry: `{ "id", "title", "plain_en", "plain_hi", "plain_ta", "applies_to", "params", "source_name", "source_url", "verified": false }`. All entries ship with `verified:false` and the UI badge `Reference rule — confirm on irdai.gov.in`. Seed entries (values are **reference defaults**, editable, and must be confirmed against official IRDAI texts before real use):
- `R_MORATORIUM` — after 60 continuous months of coverage, claims cannot be contested on non-disclosure/misrepresentation except proven fraud (`params.months=60`). Source: IRDAI Master Circular on Health Insurance Business 2024.
- `R_PED_WAITING` — pre-existing disease waiting period cap (`params.months=36`). Same source.
- `R_CLAIM_SETTLE_DAYS` — reimbursement claim to be settled within a stated number of days of last necessary document (`params.days=30`, interest `bank_rate+2%`). Source: IRDAI (Protection of Policyholders' Interests) Regulations 2017.
- `R_GRO_REPLY_DAYS` — insurer's grievance reply window (`params.days=15`).
- `R_OMBUDSMAN_ELIGIBILITY` — approach the insurer first; Ombudsman complaint allowed after rejection or no satisfactory reply, within **one year** of the insurer's reply (`params.window_days=365`, `params.insurer_wait_days=30`). Source: Insurance Ombudsman Rules 2017.
- `R_OMBUDSMAN_INSURER_RESPONSE` — insurers must submit documents to the Ombudsman within 7 days or face ex-parte orders (`params.days=7`). Source: IRDAI direction reported 31 Jul 2026.
- `R_NON_PAYABLE_LIST` — consumables on the IRDAI non-payable list are not payable unless the policy covers them. Source: IRDAI guidance.
- `R_PROPORTIONATE_ROOM` — proportionate deduction applies when policy wording imposes a room-rent limit (policy-defined).
- `R_SETTLEMENT_LETTER_ITEMISE` — insurers must itemise allowed, disallowed and non-payable amounts in settlement letters (as directed in the Star Health order, Nov 2026).
- `R_BIMA_BHAROSA` — policyholders can lodge complaints with IRDAI via the Bima Bharosa portal after exhausting the insurer's internal channel; toll-free 155255 / 1800-4254-732; complaints@irdai.gov.in.

---

## 6. Time Machine & Clock (virtual time)

- All business logic uses `clock.now()` (virtual date). Stored in `app_state(key='virtual_now')`. Default start for the demo scenario: `2026-09-08` (3 days after the rejection letter). `DEMO_START_DATE` env overrides.
- **Time Machine controls** (Settings and Judge Mode): +1, +3, +7, +15, +30 days; "Set date"; "Back to start". Jumping time processes, in order, every scheduled event between old and new date (acknowledgements, deadlines, twin replies) and emits a `clock` trace event per event, with an animated "calendar flip" in the top-bar date chip.
- Deadlines shown to users are always in virtual dates with a countdown chip (`3 days left`, turns amber ≤ 5, red ≤ 2).
- Background worker thread ticks every 1 s only to deliver scheduled twin messages; no real-time waits.

---

## 7. Demo Scenario & Synthetic Sample Data (`python -m app.tools.make_samples`)

Generate three **PDFs** with `reportlab` (text-based, so quotes can be searched) plus PNG page renders with PyMuPDF. Put a faint "SYNTHETIC SAMPLE — NOT A REAL DOCUMENT" watermark on every page. Insurer and people are fictional.

**Persona:** Priya Raghavan (policyholder), father **Ramesh Raghavan, 58**, Chennai. Insurer: **Meridian Health Insurance Co. Ltd.** Product: **Suraksha Plus Family Floater**. Policy no. `MH-FF-2021-004512`. Sum insured ₹5,00,000. Inception **2021-04-01**, renewed every 1 April through 2026 (renewal table in the policy). Grievance email `grievance@meridian-health.example`, officer "Mr. A. Kulkarni".

**Policy PDF (4 pages)** must contain these clauses with these exact numbers and wording:
- `2.1 Sum Insured` — "The Sum Insured under this policy is ₹5,00,000 per policy year on a family floater basis."
- `3.2 Room Rent` — "Room rent is covered up to ₹5,000 per day. If a higher category room is opted for, all associated medical expenses shall be reduced in the same proportion (proportionate deduction)."
- `4.1 Initial Waiting Period` — "No claim is payable for illness in the first 30 days of the first policy."
- `4.2 Pre-Existing Disease Waiting Period` — "Pre-existing diseases are covered after 36 months of continuous coverage."
- `5.4 Moratorium` — "After 60 continuous months of coverage have been completed, no claim shall be contestable by the Insurer on grounds of non-disclosure or misrepresentation, except for proven fraud."
- `6.1 Non-Payable Items` — "Consumables listed in Annexure I are not payable."
- `8.1 Grievance Redressal` — "The Insurer shall acknowledge a complaint within 3 days and endeavour to resolve it within 15 days at grievance@meridian-health.example."
- A **Renewal History** table: 01-Apr-2021, 2022, 2023, 2024, 2025, 2026 (all "Renewed", no gaps).

**Hospital bill PDF (2 pages):** City Care Hospital, Chennai; admission 2026-08-10, discharge 2026-08-14 (4 days); procedure: total knee replacement. Items: Room charges 4 days × ₹6,500 = ₹26,000; Nursing ₹9,000; Surgeon & anaesthetist fees ₹60,000; Implant ₹80,000; Medicines ₹25,000; Investigations ₹22,000; **Consumables ₹18,000**; Total **₹2,40,000**. (Eligible items for proportionate calculation = room + nursing + surgeon fees = ₹95,000; rate ₹6,500 vs limit ₹5,000 → ≈ 23.08% → **≈ ₹21,923**.)

**Settlement/Rejection letter PDF (2 pages):** dated **2026-09-05**, reference `MH/CLM/2026/118742`. Billed ₹2,40,000. **Approved ₹1,40,000.** Deductions (itemised):
- **D1 ₹60,000** — "Claim partially repudiated: pre-existing condition (hypertension) not disclosed at proposal stage (Clause 4.2)."
- **D2 ₹22,000** — "Proportionate deduction as room rent opted exceeds the eligible limit (Clause 3.2)."
- **D3 ₹18,000** — "Non-payable consumables (Annexure I, Clause 6.1)."
Sum of deductions ₹1,00,000. Footer: "Ombudsman details are available on request." (Intentional — missing grievance-route information.)

**Expected verdicts (the demo must produce these; tests assert them):**
- **D1 → strong_case**, recoverable ₹60,000, confidence ≈ 0.87. Tools: `continuous_coverage` = **64 months** at admission (≥ 60). Evidence: policy clause 5.4 vs letter reason. Honest note: clause 4.2 (waiting period) is irrelevant because coverage exceeds 36 months and moratorium bars non-disclosure repudiation.
- **D2 → valid_deduction**, recoverable ₹0. Tool: `calc_proportionate_deduction` → ≈ ₹21,923 vs ₹22,000 (difference ≈ ₹77, within tolerance). Honest banner shown.
- **D3 → valid_deduction**, recoverable ₹0 (Annexure I, Clause 6.1, bill item "Consumables").
- **Overall:** disputed ₹1,00,000; likely recoverable **₹60,000**; stated plainly in the summary.

**Scripted insurer behaviour (default `partial_offer`):** see §5.7.
Also generate `samples/meta.json` listing page counts and the exact quotes used so tests can verify highlight rectangles are found.

---

## 8. Judge Demo Flow (60–75 seconds, built into the UI)

| Time | Action | What the judges see |
|---|---|---|
| 0:00 | Click **Start with Priya's case** on landing (or Judge dock → **Load Priya's case**) | Fast onboarding skip, dashboard fades in with an empty-state turning into a new case |
| 0:05 | Case created; pipeline starts | Agent Log streams: Rakshak consent logged → **Lekha** reads 3 docs, extracts clauses → Rakshak verifies quotes found ("12/12 quotes verified") |
| 0:15 | **Nyaya** calls tools live | Tool chips: `continuous_coverage → 64 months`, `calc_proportionate_deduction → ₹21,923`, `lookup_rule R_MORATORIUM` |
| 0:25 | Analysis tab shows verdicts | D1 **Strong case** (ring → 87%), D2 and D3 **Valid deduction** with honesty banner; click D1 → split evidence view with highlighted clause 5.4 and letter text |
| 0:35 | Approval card appears | Draft complaint to Meridian's Grievance Officer, with evidence chips; presenter clicks **Approve & send** |
| 0:40 | Time Machine **+15 days** | Date chip flips, insurer twin tab shows ack on day 3, then silence; Doot detects no resolution, opens **Regulator step** → new approval (auto-approved in Judge Mode) → regulator twin shows complaint ref |
| 0:50 | Time Machine **+9 days** | Insurer sends ₹30,000 partial offer; Nyaya compares (offer < ₹60,000) → recommends decline & ombudsman; approval auto-passes; ombudsman pack generated |
| 1:00 | Time Machine **+20 days** | Insurer agrees to pay ₹60,000; **Resolved** hero (shield draw, amount count-up); Rakshak purge shows `bytes_retained: 0` |
| 1:10 | Close | Dashboard shows *Recovered ₹60,000*, deadlines met 4/4 |

**Presenter script line:** "The insurer and regulator are simulated; the reading, reasoning, deadlines, letters and escalation are all real and autonomous. It even told Priya the two deductions that were fair."

---

## 9. Tech Stack & Free-Tier Infrastructure

| Layer | Choice | Free-tier note |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript, Tailwind CSS 3, framer-motion, lucide-react, recharts, react-router-dom 6, zustand, @tanstack/react-query, cmdk, sonner, react-dropzone, date-fns, clsx | open source |
| Fonts | `@fontsource-variable/inter`, `@fontsource/jetbrains-mono` (bundled, no CDN) | offline-safe |
| Backend | Python 3.11+, FastAPI, uvicorn, sse-starlette, pydantic v2, python-multipart, httpx, jinja2 | open source |
| AI | `google-genai` SDK, model `gemini-2.5-flash` (env-configurable) | Google AI Studio free tier, no card |
| Documents | PyMuPDF (text, page PNGs, `search_for` highlight rects), reportlab (letters, Evidence Pack, samples), Pillow | open source |
| Database | SQLite (`backend/claimkavach.db`) via `sqlite3` + small repository layer | zero setup |
| Email (optional) | Gmail SMTP (`smtplib`, app password) to a demo inbox | free, optional |
| Hosting | Run on a laptop with a free tunnel (Cloudflare Tunnel / ngrok free) **or** Render free web service via Dockerfile (python:3.11-slim; no Chromium needed) | no card |

Hosting notes: Render free services sleep after idle — open the URL 2 minutes before presenting, or run from the laptop. Vercel/Netlify are not used (the backend must run long-lived threads and SSE).
`.env.example`:
```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
GEMINI_RPM=8
DEFAULT_MODE=auto
DEMO_START_DATE=2026-09-08
DEMO_PACING=1.0
PORT=8000
```

---

## 10. Folder & File Structure

```
claimkavach/
├── PRD.md
├── README.md
├── .env.example
├── .gitignore
├── Dockerfile
├── run.sh
├── run.bat
├── backend/
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── app/
│   │   ├── main.py                 # FastAPI app; mounts /api, /twin, serves frontend/dist (SPA fallback)
│   │   ├── config.py
│   │   ├── db.py                   # schema, migrations, seed
│   │   ├── schemas.py              # Pydantic models (FactSheet, Verdict, EscalationStep, TraceEvent, ...)
│   │   ├── events.py               # event bus + SSE
│   │   ├── clock.py                # virtual clock + scheduler tick
│   │   ├── llm.py                  # Gemini client, limiter, repair, fallback, cache
│   │   ├── orchestrator.py         # pipeline state machine + gates
│   │   ├── ladder.py               # escalation ladder logic
│   │   ├── routes_api.py
│   │   ├── agents/ (lekha.py, nyaya.py, doot.py, rakshak.py)
│   │   ├── tools/ (months.py, coverage.py, proportionate.py, rules.py, deadline.py, interest.py, pdfs.py, highlight.py, make_samples.py)
│   │   ├── letters/ (gro.j2, regulator.j2, ombudsman.j2, counter.j2, evidence_pack.py)
│   │   ├── twin/ (engine.py, routes.py)
│   │   ├── demo/ (scripted.py)
│   │   ├── data/ (rules.json, glossary.json, i18n_seed.json)
│   │   ├── samples/                # generated PDFs, PNGs, meta.json
│   │   └── uploads/                # per-case temp files (gitignored)
│   └── tests/ (test_tools.py, test_highlight.py, test_guardian.py, test_pipeline_demo.py, test_ladder.py)
└── frontend/
    ├── package.json, vite.config.ts, tailwind.config.js, postcss.config.js, tsconfig.json, index.html
    ├── public/ (favicon.svg, manifest.webmanifest)
    └── src/
        ├── main.tsx, App.tsx, index.css (tokens from §2.1)
        ├── lib/ (api.ts, sse.ts, store.ts, i18n.ts, format.ts, types.ts, theme.ts, hotkeys.ts)
        ├── i18n/ (en.json, hi.json, ta.json)
        ├── components/
        │   ├── ui/ (all primitives from §2.6)
        │   ├── layout/ (AppShell.tsx, Sidebar.tsx, Topbar.tsx, BottomTabs.tsx, FooterStrip.tsx, PublicNav.tsx)
        │   ├── brand/ (Logo.tsx, AgentAvatar.tsx, ShieldSuccess.tsx)
        │   ├── cases/ (CaseCard.tsx, LadderBar.tsx, DeductionTable.tsx, EvidenceSplit.tsx, DocViewer.tsx, VerdictBadge.tsx, ConfidenceRing.tsx, MoneyDonut.tsx, LetterCard.tsx, ApprovalCard.tsx, Timeline.tsx, AgentLog.tsx, DeadlineChip.tsx)
        │   ├── dashboard/ (StatCard.tsx, RecoveryChart.tsx, DeadlineStrip.tsx, ActivityFeed.tsx)
        │   ├── landing/ (Hero.tsx, ProductMock.tsx, ProblemStats.tsx, HowSteps.tsx, AgentCards.tsx, LivePreview.tsx, HonestSection.tsx, FAQ.tsx)
        │   └── judge/ (JudgeDock.tsx, TimeMachine.tsx)
        └── pages/ (Landing, HowItWorks, Rights, Privacy, Onboarding, Dashboard, Cases, NewCase, CaseDetail, Approvals, Policies, Settings, TwinInsurer, TwinRegulator, NotFound)
```

---

## 11. API & Data Models

### 11.1 REST (`/api`)
| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | `{ok, db, mode}` |
| GET | `/config` | model, default mode, pacing, has_env_key, virtual_now |
| POST | `/settings/test-key` | header `X-Gemini-Key`; returns `{ok, latency_ms}` |
| GET/PUT | `/profile` | user profile (single demo user) |
| GET | `/samples` | demo documents list + metadata |
| POST | `/uploads` | multipart file → `{doc_id, filename, bytes, pages}` (converts to page PNGs) |
| POST | `/cases` | create case `{doc_ids:{policy,bill,letter}, language, consent:[...], mode, scenario}` → `{case_id}` and starts pipeline |
| GET | `/cases` | list (with filters) |
| GET | `/cases/{id}` | full case: facts, verdict, ladder, money, next_action |
| GET | `/cases/{id}/events` | SSE trace (supports `Last-Event-ID`) |
| GET | `/cases/{id}/timeline` | merged timeline items |
| GET | `/cases/{id}/documents/{doc_id}/pages/{n}.png` | page image |
| GET | `/cases/{id}/highlights?doc=&quote=` | rects for a quote `[ {page, x0,y0,x1,y1, pw, ph} ]` |
| GET | `/cases/{id}/messages` | letters thread |
| GET | `/cases/{id}/pack.pdf` | Evidence Pack |
| GET | `/cases/{id}/summary.pdf` | printable case summary |
| GET | `/approvals?status=pending|history` | approvals |
| POST | `/approvals/{id}/approve` | body `{edited_body?}` → sends (simulated + optional SMTP) |
| POST | `/approvals/{id}/undo` | within 8 s |
| POST | `/approvals/{id}/reject` | skip |
| GET | `/policies` | policy vault |
| GET | `/rules` / `/glossary` | library |
| GET | `/clock` / POST `/clock/advance` `{days}` / POST `/clock/set` `{date}` / POST `/clock/reset` | Time Machine |
| POST | `/judge/load-demo` | one-click: create the demo case |
| POST | `/judge/config` | `{insurer_behavior, auto_approve, pacing}` |
| GET | `/twin/insurer/messages`, `/twin/regulator/complaints` | twin data (also SSE `/twin/stream`) |
| POST | `/data/export`, `/data/delete` | export JSON, purge everything |
| POST | `/reset` | reset demo state |

### 11.2 SQLite schema
```sql
CREATE TABLE IF NOT EXISTS app_state (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS user_profiles (id INTEGER PRIMARY KEY, name TEXT, mobile TEXT, city TEXT, language TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS documents (doc_id TEXT PRIMARY KEY, case_id TEXT, kind TEXT, filename TEXT, bytes INTEGER, pages INTEGER, text_json TEXT, path TEXT, sha256 TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS cases (case_id TEXT PRIMARY KEY, title TEXT, insurer TEXT, policy_no TEXT, status TEXT, mode TEXT, language TEXT, scenario TEXT,
  facts_json TEXT, verdict_json TEXT, disputed_total INTEGER, recoverable_total INTEGER, recovered_total INTEGER DEFAULT 0,
  created_virtual TEXT, resolved_virtual TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS ladder_steps (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, step TEXT, status TEXT, opened_on TEXT, deadline_on TEXT, notes TEXT);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, direction TEXT, step TEXT, from_addr TEXT, to_addr TEXT, subject TEXT, body TEXT, status TEXT, simulated INTEGER DEFAULT 1, virtual_date TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS approvals (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, action TEXT, step TEXT, draft_subject TEXT, draft_body TEXT, evidence_json TEXT, status TEXT, created_virtual TEXT, decided_at TEXT);
CREATE TABLE IF NOT EXISTS scheduled_events (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, due_virtual TEXT, kind TEXT, payload_json TEXT, done INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS trace_events (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, ts TEXT, virtual_date TEXT, agent TEXT, type TEXT, title TEXT, detail TEXT, data_json TEXT, source TEXT, judge_note TEXT);
CREATE INDEX IF NOT EXISTS idx_trace_case ON trace_events(case_id, id);
CREATE TABLE IF NOT EXISTS consents (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, purpose TEXT, granted INTEGER, ts TEXT);
CREATE TABLE IF NOT EXISTS llm_cache (key TEXT PRIMARY KEY, response_json TEXT, created_at TEXT);
CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, case_id TEXT, title TEXT, body TEXT, link TEXT, read INTEGER DEFAULT 0, created_at TEXT);
CREATE TABLE IF NOT EXISTS metrics (case_id TEXT PRIMARY KEY, llm_calls INTEGER, tools_called INTEGER, quotes_verified INTEGER, quotes_failed INTEGER, pii_blocked INTEGER, deadlines_met INTEGER, deadlines_total INTEGER, bytes_retained INTEGER);
```

---

## 12. Agent Trace (Agent Log) — event spec
```json
{
  "id": 1, "ts": "iso", "virtual_date": "YYYY-MM-DD", "case_id": "uuid",
  "agent": "lekha|nyaya|doot|rakshak|system",
  "type": "agent_start|thinking|llm_call|tool_call|tool_result|evidence|artifact|draft|approval_needed|approved|sent|reply_received|clock|escalation|guardrail|warn|error|agent_done|case_done",
  "title": "short line", "detail": "optional", "data": {},
  "source": "gemini|local|tool|simulated|fallback",
  "judge_note": "one plain-English sentence for non-technical viewers"
}
```
UI rules: row = coloured agent avatar + title + source badge + virtual date + `judge_note` in muted italic; tool calls render as monospace chips with expandable JSON; `evidence` rows show the quoted line with a "View in document" link; `guardrail` rows are red-tinted with a shield icon; new rows slide in (40 ms stagger); autoscroll with a "Jump to latest" pill when the user scrolls up; `aria-live="polite"`.
Examples of `judge_note`: tool `continuous_coverage` → "A calculator, not the AI, counted 64 months of continuous cover." · guardrail → "The agent tried to quote a line that is not in your policy, so it was blocked." · clock → "Time jumped 15 days. The insurer did not reply, so the agent escalated on its own."

---

## 13. Modes, Fallbacks & Reliability
- **Auto:** Live if a key works (test call ≤ 4 s), else Demo Simulation with a visible reason chip.
- **Live:** real Gemini calls; per-call scripted fallback on any error.
- **Demo Simulation:** scripted AI outputs for the demo scenario (and a generic fallback verdict for uploaded docs: `need_info` with a clear message "Live AI needed for new documents"). Tools, validators, clock, ladder, twins, PDFs, SSE — all real.
- Document extraction failure → ErrorState with "Try the demo documents".
- Any unhandled backend error returns `{error:{code,message,hint}}`; the UI shows a toast and never a blank screen.
- Run a startup self-check (`/api/health`) that confirms DB, samples and PyMuPDF are available and shows a red banner with the exact fix if not.

---

## 14. Quality Bars
**Performance:** landing LCP < 2.5 s locally; route-level code splitting; images are SVG/PNG pages at ≤ 1000 px width; avoid layout shift (reserve space for skeletons).
**Responsive checks:** 360×740 phone, 768 tablet, 1280 laptop, 1920 desktop. No horizontal scroll at any width. Tables become cards on mobile. Evidence split view becomes stacked tabs ("Insurer says" / "Policy says") on mobile.
**Visual QA checklist:** consistent 8-pt spacing, no orphan text, equal card heights in rows, aligned icons, tabular numbers for money, both themes tested on every page, focus rings visible.

## 15. Acceptance Criteria (Definition of Done)
1. `python -m app.tools.make_samples` creates the 3 sample PDFs + page PNGs + `meta.json`; every clause/quote in §7 is searchable in the PDF text.
2. `pytest` passes: tools (months, coverage = 64 months, proportionate ≈ 21,923), highlight rects found for clause 5.4 and D1 quote, guardian blocks a fake quote and a fake rule id, ladder transitions, and the full **demo pipeline** (Demo Simulation) yields D1 strong_case ₹60,000, D2/D3 valid, a pending approval, and after clock jumps a resolved case with `recovered_total=60000`.
3. One command starts everything (`run.sh` / `run.bat`) at `http://localhost:8000`.
4. Every page in §3 exists, is responsive, works in light and dark, and has loading, empty and error states.
5. Evidence viewer highlights the real clause text on the real page image.
6. Time Machine processes scheduled events in order and the UI updates live via SSE without refresh.
7. Approvals gate every outbound message; Undo works within 8 s.
8. Languages EN/HI/TA switch the UI chrome instantly; AI summaries return in the selected language (scripted translations exist for the demo case).
9. Honesty labels (§1.4) are visible; no real PII anywhere; the Gemini key is never logged or written to disk.
10. No `TODO`, `FIXME`, `NotImplementedError`, or `pass` stubs anywhere. No paid service referenced.
11. Lighthouse-style sanity: no console errors on any page; keyboard-only user can complete the full demo.

## 16. Appendices

### 16.1 Microcopy (use as written)
- Empty cases: "No cases yet. Upload a rejection letter and we'll check if the insurer is right."
- Strong case: "The insurer's reason doesn't match your policy."
- Valid deduction: "This part looks fair under your policy. We won't fight it."
- Need info: "We're not sure yet. Here's what we need."
- Approval CTA: "Approve & send" · Secondary: "Edit first" · Tertiary: "Not now".
- Delay chip: "Reply due in 6 days".
- Resolved: "Recovered ₹60,000. Your claim is settled."
- Disclaimer line: "ClaimKavach explains and drafts. It is not legal advice."

### 16.2 Glossary (tap-to-explain tooltips; store in `glossary.json` EN/HI/TA)
Moratorium · Proportionate deduction · Pre-existing disease · Non-payable consumables · Repudiation · Grievance Redressal Officer (GRO) · Ombudsman · Bima Bharosa · Sum insured · Cashless vs reimbursement.

### 16.3 Source list for landing footer and `/privacy`
- Angel One (IRDAI annual report data): "IRDAI Data Reveals 41% Spike in Health Insurance Grievances Over Claim Settlements in FY25" — angelone.in
- Business Today: "88% of consumer complaints are due to insurance claims being rejected: Report" (LocalCircles survey: over 50% faced rejection or partial approval) — businesstoday.in
- Moneylife: "Health Insurance Customer Experience Worsens: 4 in 10 Claimants Report Issues, Finds Hansa Research" (21 Aug 2026) — moneylife.in
- Insurance Business: "IRDAI cannot explain why health insurance claims go unpaid" — insurancebusinessmag.com
- Business Standard / ETV Bharat: "Irdai fines Star Health ₹2 crore over unjustified health claim rejections" (Nov 2026)
- Moneylife (31 Jul 2026): insurers must respond within 7 days to ombudsman document requests or face ex-parte orders.

### 16.4 Non-goals (do not build)
Real insurer or regulator integrations, real payments, real authentication, life/motor insurance, WhatsApp, native apps, analytics trackers, any paid service.
