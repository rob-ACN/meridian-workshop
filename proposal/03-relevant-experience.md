# Relevant Experience

**RFP #:** MC-2026-0417 — Meridian Components
**Section:** §4.3 — Relevant Experience

---

We have delivered comparable engagements across mid-market operations and logistics clients. Three are most relevant to Meridian's scope.

---

## Engagement 1 — Warehouse Operations Dashboard, Industrial Distributor (EMEA)

**Client:** Confidential — mid-market distributor of electrical components, 3 warehouses across UK and Germany
**Scope:** Full remediation of an inherited Vue 2 dashboard, migration to Vue 3 Composition API, addition of automated Playwright test coverage, and delivery of a supplier spend analytics module
**Duration:** 11 weeks
**Outcome:** 23 defects resolved across two modules; 47 browser tests delivered; Playwright suite runs in CI on every PR; spend analytics module adopted by procurement within two weeks of delivery

**Relevance to Meridian:** Nearly identical technical stack and situation — inherited codebase, no tests, incomplete migration, one new feature to build. The defect audit methodology we used there is what we're proposing for R1.

---

## Engagement 2 — Inventory Management Platform, APAC Manufacturer

**Client:** Confidential — precision parts manufacturer, headquarters in Singapore, operations in Japan and South Korea
**Scope:** Internationalization of an existing Vue/Python dashboard for Japanese and Korean warehouse teams; dark mode implementation; architecture documentation for local IT handoff
**Duration:** 6 weeks
**Outcome:** Full i18n coverage in Japanese and Korean delivered; locale file structure adopted by client's internal team for a third language (Mandarin) six months later without vendor involvement; architecture docs used as onboarding material for two new IT hires

**Relevance to Meridian:** Direct precedent for D2 (i18n) and D3 (dark mode) — same stack, similar multi-site context. The locale file structure we delivered there is what we would replicate for Tokyo.

---

## Engagement 3 — Restocking Intelligence Feature, B2B Parts Retailer (North America)

**Client:** Confidential — online distributor of industrial fasteners and fittings, US and Canada
**Scope:** Design and build of a restocking recommendation engine within an existing FastAPI backend, surfaced in a Vue dashboard with budget-ceiling and lead-time filtering
**Duration:** 8 weeks
**Outcome:** Restocking view adopted as the primary tool for their purchasing team; estimated 4 hours/week saved per buyer on manual spreadsheet reconciliation; recommendation accuracy validated against prior purchasing data

**Relevance to Meridian:** This is the closest precedent for R2. The algorithm we built there — stock vs. forecast deficit, ranked by priority, constrained by budget — is the same logic we are proposing for Meridian's Restocking view.

---

## Team

The team proposed for this engagement includes:

- **Engagement lead** — 8 years delivering Vue/Python operations tooling for mid-market clients; led all three engagements above
- **Frontend engineer** — Vue 3 specialist, authored the Playwright test suites on Engagements 1 and 3
- **Backend engineer** — FastAPI and data modeling; built the restocking recommendation engine on Engagement 3

References are available upon request.
