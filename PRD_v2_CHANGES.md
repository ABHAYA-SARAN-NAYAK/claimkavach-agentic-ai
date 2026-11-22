# ClaimKavach v2: Redesign and Simplification Changelog

This document specifies the exact modifications made to transition ClaimKavach from an administrative multi-page dashboard prototype to a focused, single-claim digital advocate matching `design/ClaimKavach_UI_Reference.png` and `design/UX_DIRECTION.md`.

---

## 1. Removed Pages & Components
The following redundant or multi-case administrative pages, components, and dead routes are permanently deleted:
- **Pages Deleted**:
  - `pages/Dashboard.tsx` (replaced by unified single-claim workspace at `/claim/:id`)
  - `pages/Cases.tsx` (cases list page removed; families handle one claim at a time)
  - `pages/Approvals.tsx` (standalone approvals inbox removed; embedded directly as a focused review sheet inside `/claim/:id`)
  - `pages/Policies.tsx` (policy vault page removed; embedded in documents tab)
  - `pages/HowItWorks.tsx` (standalone page removed; folded into landing page sections)
  - `pages/Rights.tsx` (standalone rights library removed; folded into searchable slide-over Help Drawer and inline tooltips)
  - `pages/Privacy.tsx` (standalone privacy page removed; folded into landing privacy & honesty section)
  - `pages/Settings.tsx` (standalone page removed; folded into slide-over Settings Drawer)
- **UI Components & Features Removed**:
  - `components/layout/Sidebar.tsx` and desktop multi-page sidebar navigation
  - `components/layout/BottomTabs.tsx` multi-page mobile tabs
  - `components/ui/CommandPalette.tsx` (Cmd+K global search removed)
  - Standalone notifications bell and notifications overlay
  - Floating Judge Mode Dock from normal screens (dock removed from regular views)
  - All public "Try Demo Case", "Start with Priya's case", "Load demo case", and "Use demo documents" buttons and badges from normal user views

---

## 2. New Route Architecture
A lean, guided 4-route application model:
1. **`/` (Landing Page)**: One comprehensive scrolling page containing Hero with live React mockup, 4 feature row, 5-step How It Works, Impact statistics, Meet Your Agent Team, Honest by Design, FAQ accordion, and footer with privacy summary and data purge.
2. **`/start` (New Claim Review Wizard)**: 4-step focused wizard:
   - Step 1: *What happened?* (Rejected vs Part-paid)
   - Step 2: *Upload Documents* (Policy, Bill, Letter with progress rings and page detection)
   - Step 3: *Confirm & Consent* (Extracted details check, 3 explicit consent toggles)
   - Step 4: *Real Analysis* (Operation stages reflecting actual backend events) -> Redirects to `/claim/:id`
3. **`/claim/:id` (My Claim Workspace)**: The unified single-claim hub:
   - Header with greeting and 4 core stat cards (Amount in dispute, Likely recoverable, Deductions reviewed, Next deadline)
   - Case summary card with 5-stage progress stepper
   - Clay-tinted **Next Action** card with prominent review button
   - Full-screen **Review & Approve Sheet** with complaint draft, evidence citations, and 8-second undo grace window
   - 5 URL-synced tabs: `Result`, `Evidence` (split PDF viewer with yellow bbox highlights), `Journey` (SSE timeline), `Letters` (drafts & sent replies), `Documents` (uploaded & generated files)
   - **What ClaimKavach Did** panel: Simple 4-line consumer summary with an expandable **Expert View** toggle for raw agent logs
   - **Resolved State**: Calm celebratory shield animation, ₹60,000 recovered banner, and printable case summary
   - **Help Drawer**: Searchable IRDAI rules and glossary with confirm badges
   - **Settings Drawer**: API key configuration, AI mode selection, export/delete data
4. **`/judge` (Hidden Presenter Suite)**: Unlinked presenter screen accessible directly or via `Ctrl+Shift+J` with the Time Machine controls, sample claim loader, insurer behavior overrides, and twin links.
5. **`/twin/insurer` & `/twin/regulator`**: Simulated twin portals (linked exclusively from `/judge`).

---

## 3. Design System & Visual Identity
- **Color Palette Overhaul**: Completely replaced neon/teal/purple tokens with warm, editorial tokens:
  - Backgrounds: Warm Paper (`#F7F3EC`), Hero Cream (`#FBF1E6`), Surface (`#FFFFFF`), Surface Warm (`#FBF6EF`), Border (`#E7E1D6`)
  - Primary: Deep Evergreen (`#1F4D3A`, `#183528`, `#276148`)
  - Accent: Warm Clay (`#B8472A`, `#C96A45`, `#FBF0E7`)
  - Text: Carbon (`#1F2420`), Muted (`#4D554F`), Light (`#7B827C`)
  - Verdict Chips: Strong Case (soft green `#2F8F5B`), Possible (soft amber `#D9822B`), Valid Deduction (soft grey-green `#768579`)
  - Dark Theme: Warm organic dark palette (bg `#121814`, surface `#1A221D`, primary `#3E8F6C`, clay `#E08A63`)
- **Brand Identity**:
  - Transparent shield icon extracted from `design/ClaimKavach_Logo.png` using Pillow for favicon, manifest, and Open Graph.
  - Pixel-crisp inline SVG Logo Lockup (`Shield` + `Claim` in carbon + `Kavach` in clay) matching the design reference navbar.
- **Typography & Layout**:
  - Inter Variable with tight tracking on headings.
  - Tabular numerals for monetary amounts with Indian grouping (`₹1,00,000`).
  - Subtle micro-interactions respecting `prefers-reduced-motion`.

---

## 4. Backend & API Adjustments
- Added `GET /api/claims/current` to seamlessly route returning users to their active claim or return null for first-time onboarding.
- Added `GET /api/claims/{id}/summary` combining case facts, verdict, ladder, next pending approval, and monetary totals in one optimized payload.
- Maintained all existing agent pipelines, IRDAI rule tables, PyMuPDF highlights, synthetic test PDFs, and virtual clock endpoints.
