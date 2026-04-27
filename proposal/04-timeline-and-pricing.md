# Timeline and Pricing

**RFP #:** MC-2026-0417 — Meridian Components
**Section:** §4.4–4.5 — Timeline & Pricing

---

## Timeline

We propose a four-phase engagement. Phases 1–3 cover all required items (R1–R4). Phase 4 covers desired items (D1–D3) and can be deferred, descoped, or cancelled without affecting the required deliverables.

### Phase 1 — Stabilize (Weeks 1–2)

**Objective:** Resolve the Reports module defects and establish test infrastructure.

| Activity | Detail |
|---|---|
| Codebase onboarding | Review actual code against handoff notes; identify gaps and risks |
| Defect audit (R1) | Reproduce all 8+ logged Reports defects; produce defect log for Meridian review |
| Reports remediation (R1) | Fix all confirmed defects; migrate Reports module to Composition API |
| Browser test setup (R3) | Install and configure Playwright; write initial test suite for Inventory and Orders flows |
| Reports test coverage (R3) | Add browser tests for all remediated Reports behaviors |

**Exit criteria:** All confirmed defects resolved and verified by Meridian; Playwright suite passing for Inventory, Orders, and Reports flows.

---

### Phase 2 — Document (Week 3)

**Objective:** Produce architecture documentation before new code is added.

| Activity | Detail |
|---|---|
| Architecture review (R4) | Map Vue components, API endpoints, data model, and known debt |
| Documentation delivery (R4) | HTML diagram + written narrative delivered to repository |
| IT review session (R4) | Walkthrough with Meridian IT to confirm accuracy and answer questions |

**Exit criteria:** Architecture document accepted by Meridian IT; IT sign-off to proceed with Phase 3.

---

### Phase 3 — Build (Weeks 4–6)

**Objective:** Deliver the Restocking view with full test coverage.

| Activity | Detail |
|---|---|
| API design | Define `/api/restocking/recommendations` endpoint contract with Meridian ops team |
| Backend implementation (R2) | Build recommendation logic in FastAPI; unit tests for algorithm |
| Frontend implementation (R2) | Build Restocking view in Vue; budget input, ranked table, warehouse/category filters |
| Restocking test coverage (R3) | Add Playwright tests for Restocking flow |
| Final test suite review (R3) | Full suite run; documentation for IT on how to run and extend |

**Exit criteria:** Restocking view accepted by R. Tanaka (VP Operations); full Playwright suite passing across all four flows; `npm run test:e2e` documented and verified by IT.

---

### Phase 4 — Enhance (Weeks 7–9) — Optional

**Objective:** UI modernization, i18n, and dark mode.

| Activity | Detail |
|---|---|
| UI refresh (D1) | Refresh visual design using Meridian brand colors and font |
| i18n — Japanese (D2) | Extract all remaining hardcoded strings; deliver Japanese locale file |
| i18n — additional languages (D2) | Locale file structure ready for extension; scope per language TBD |
| Dark mode (D3) | CSS variable–based theming with localStorage toggle |

**Exit criteria:** UI accepted by Meridian ops team; Japanese locale reviewed by Tokyo staff; dark mode verified on warehouse floor stations.

---

### Summary Gantt

```
         Week 1   Week 2   Week 3   Week 4   Week 5   Week 6   Week 7   Week 8   Week 9
Phase 1  ████████████████
Phase 2                   ████████
Phase 3                            ████████████████████████
Phase 4                                                              ████████████████████
```

---

## Pricing

We propose a **time-and-materials engagement with a not-to-exceed (NTE) ceiling per phase.** You are invoiced for actual hours at the blended rate below; the NTE is a hard cap — overruns require written approval before being incurred.

**Blended rate:** $200/hour
**Invoicing:** Monthly, against actuals, with time logs attached

### Fee Schedule

| Phase | Scope | Estimated Hours | NTE |
|---|---|---|---|
| Phase 1 | Reports remediation + browser test foundation (R1, R3) | 40–60 hrs | **$12,000** |
| Phase 2 | Architecture documentation (R4) | 16–24 hrs | **$5,000** |
| Phase 3 | Restocking view + full test coverage (R2, R3) | 60–80 hrs | **$18,000** |
| **Required total (Ph. 1–3)** | | **116–164 hrs** | **$35,000** |
| Phase 4 *(optional)* | UI refresh, i18n, dark mode (D1, D2, D3) | 40–60 hrs | **$14,000** |
| **Total with Phase 4** | | **156–224 hrs** | **$49,000** |

### Payment Terms

- 20% of Phase NTE invoiced at phase kickoff (mobilization)
- Remaining balance invoiced monthly against actuals
- Net 30 from invoice date
- Phase 4 requires a separate written authorization before work begins

### What's Included

- All code delivered to Meridian's repository
- Architecture documentation (R4) in the repository
- Playwright test suite with written runbook for IT
- One round of revisions per deliverable based on Meridian feedback
- 30-day warranty period post-Phase 3 close: bugs in delivered work fixed at no charge

### What's Not Included

- Hosting, infrastructure, or DevOps changes
- Japanese translation review (Meridian responsibility)
- Database integration or migration from JSON data files
- Changes to scope after phase kickoff (quoted separately)

---

*This pricing is valid for 60 days from the date of submission. We are prepared to begin within two weeks of contract execution.*
