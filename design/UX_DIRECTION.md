# ClaimKavach — UI/UX Design Concept

## Product vision
**A premium digital advocate that happens to be powered by AI.** ClaimKavach helps families understand health-insurance claim rejections or partial settlements, review evidence, prepare grievances, and track the resolution process.

The experience should communicate: **“You don't have to fight this insurance claim alone.”**

## Design principles
- Calm confidence, human advocacy, and visible progress.
- Make complex insurance processes feel simple and guided.
- Prioritize evidence and explainability over opaque AI scores.
- Show the next action clearly; avoid overwhelming users with dashboards or technical logs.
- Editorial, premium financial/legal-service aesthetics.
- Spacious layouts, strong typography, warm neutral surfaces, restrained accents.
- Avoid excessive gradients, glassmorphism, nested cards, decorative 3D, and generic AI illustrations.

## Visual system

### Palette
| Token | Color | Usage |
|---|---|---|
| Evergreen | `#253B32` | Primary brand, navigation, primary actions |
| Clay | `#C46A45` | Accent, highlights, important actions |
| Paper | `#F6F4EF` | Main application background |
| White | `#FFFFFF` | Panels, document surfaces |
| Carbon | `#262824` | Primary text |
| Sage | `#768579` | Secondary text, supportive/positive states |
| Warm Grey | `#E5E2DC` | Borders and dividers |

### Typography
- Primary font: Inter (or a similar modern, highly readable sans-serif).
- Strong, editorial headings; readable body text; clear numeric hierarchy.
- Use plain-language labels instead of insurance jargon wherever possible.

### Components
- Card radius: 10–14 px.
- Button radius: approximately 10 px.
- Borders: warm grey, subtle.
- Shadows: minimal or none.
- Icons: consistent Lucide-style line icons.
- Animation: purposeful and subtle; progress must represent real operations.

## Information architecture
- Overview
- My Cases
- Approvals
- Policy Vault
- Know Your Rights
- Agent Activity (optional advanced view)
- Help & Support
- Settings

## Core screens

### 1. Landing page
**Hero:**
> Insurance said No?  
> Let's check if it was right.

Supporting copy: Upload your policy, hospital bill, and rejection letter. ClaimKavach checks the insurer's reason, explains the evidence, and helps you challenge unfair deductions.

Primary CTA: **Start My Claim Review**  
Secondary CTA: **Try Demo Case**

Show a real product preview instead of decorative floating illustrations. Highlight policy analysis, fairness checks, complaint and follow-up, and deadline protection.

### 2. Dashboard / Overview
The dashboard should answer within five seconds:
1. How much money is at stake?
2. What is the case status?
3. What has ClaimKavach done?
4. What do I need to do next?
5. Is a deadline approaching?

Top metrics:
- Amount in dispute
- Evidence-supported / potentially recoverable amount
- Deductions reviewed
- Next deadline

Main areas:
- **Your Case:** patient/claim title, insurer, hospital, amount, status, next action, grievance-stage progress.
- **Your Attention:** approvals, missing documents, replies, and approaching deadlines.
- **What ClaimKavach is Doing:** readable activity timeline. Keep technical agent logs hidden by default.

### 3. New Claim Review flow
Use a guided, step-by-step flow rather than a large form.

**Step 1 — What happened?**
- They rejected my claim.
- They paid only part of my claim.

**Step 2 — Upload documents**
- Policy document
- Hospital bill / discharge summary
- Rejection or settlement letter

Allow users to begin with whichever document they have. Each upload should support drag-and-drop, browse, PDF/image preview, progress, page count, replace/remove, and verification status.

**Step 3 — Privacy & consent**
Explain that documents contain sensitive information, how they are processed, and request explicit consent before analysis.

**Step 4 — Analysis progress**
Show real operation stages:
- Documents read
- Policy clauses identified
- Settlement deductions checked
- Evidence verification

Do not invent percentage progress; reflect actual backend operations.

### 4. Claim Analysis Results
Headline example:
> We found ₹60,000 worth of deductions worth challenging.

Show each deduction separately:
- Amount
- Insurer's reason
- Plain-language assessment
- Verdict
- Link to source evidence

Verdict labels:
- **Strong case:** The insurer's reason doesn't match your policy.
- **Possible:** There may be grounds to challenge this.
- **Valid deduction:** This deduction appears fair under your policy.
- **Need information:** We need more information to decide.

Avoid presenting unsupported certainty or a generic AI probability score.

### 5. Evidence Viewer
Desktop three-panel layout:
- **Left:** deduction list and amounts.
- **Center:** original document with the relevant passage highlighted.
- **Right:** plain-language explanation, source document, page number, exact quote, clause reference, rule used, confidence, and “How we reached this conclusion”.

The evidence should remain traceable to the user's actual uploaded documents.

### 6. Case Journey / Timeline
Make autonomous work visible and easy to understand:
1. Documents analyzed — completed
2. Policy and deductions checked — completed
3. Complaint drafted — completed
4. Your approval — action required
5. Insurer response — waiting
6. Escalation — if unresolved
7. Resolution — claim recovered or options exhausted

The timeline updates based on actual events. Clearly show deadlines and what happens next.

### 7. Approvals Inbox
Every outbound action should require explicit user approval.

Approval card should show:
- Recipient / grievance stage
- What the complaint requests
- Evidence references
- Relevant policy clause
- Deadline

Actions:
- **Approve & Send** (primary)
- Edit complaint
- View evidence
- Not now

Never hide the approval action in a menu.

### 8. Agent Activity
**Simple mode:**
- Documents reviewed
- Deductions identified
- Deductions verified as fair
- Deduction(s) worth challenging

**Advanced / Judge mode:** expandable trace of agents, tool calls, and event details. Use the product's actual agent names and architecture where available. Technical details should not clutter the consumer experience.

### 9. Mobile UX
Do not simply compress desktop. Prioritize one task per screen, large touch targets, readable type, clear upload controls, and a persistent bottom navigation:
- Home
- Cases
- Approvals
- Policies
- More

Plan for English, Tamil, and Hindi; large-text options; voice-friendly language; and contextual explanations of insurance terms.

### 10. Contextual “Explain this”
Make unfamiliar terms explainable inline. For example, tapping **Moratorium period** opens a short plain-language definition and, where relevant, links to the policy or applicable source.

## Recommended priority for implementation
1. Dashboard / Overview
2. Claim Analysis Results
3. Evidence Viewer
4. Case Timeline
5. New Claim Review flow
6. Approvals Inbox
7. Landing page
8. Mobile adaptation
9. Advanced Agent Activity view

## UX quality checklist
- [ ] Users can identify the next action immediately.
- [ ] Every finding links to its source document and page.
- [ ] AI conclusions are explained in plain language.
- [ ] Uncertain findings are clearly labeled.
- [ ] No fake progress indicators.
- [ ] Sensitive document processing has clear consent.
- [ ] Outbound complaints/messages require user approval.
- [ ] Deadlines are prominent and actionable.
- [ ] Empty, error, loading, and success states are designed.
- [ ] Mobile is task-first, not a squeezed desktop layout.
- [ ] Tamil/Hindi/English and accessibility are considered.

## Concept image
The visual concept is provided separately as `ClaimKavach_UI_UX_Concept.png`.
