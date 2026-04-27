# Technical Approach

**RFP #:** MC-2026-0417 — Meridian Components
**Section:** §4.2 — Technical Approach

---

## Overview

Our approach follows a deliberate sequence: stabilize first, document second, build third. Every new capability we deliver will stand on a tested, documented foundation — not the fragile base the previous vendor left behind. We address required items before desired ones, and within required items we prioritize the work that unblocks everything else.

The existing stack (Vue 3 + FastAPI + JSON data files) is a sound foundation. The issues are concentrated in execution: incomplete filter wiring, absent test coverage, mixed component patterns, and thin documentation. None of this requires a rewrite. It requires systematic attention.

---

## R1 — Reports Module Remediation

**Our approach:** Audit-first, then fix.

We will not begin patching individual bugs in isolation. Instead, we will reproduce all reported defects systematically, trace each to its root cause in the codebase, and categorize them before writing a single line of fix code. This matters because defects in a Reports module frequently share underlying causes — a broken filter abstraction can manifest as eight separate symptoms.

Based on the handoff documentation and our initial review, we anticipate the defects will fall into three categories:

- **Filter wiring gaps** — query parameters not correctly passed from Vue components through `api.js` to the FastAPI layer, or not applied in the server-side filtering logic
- **i18n gaps** — hardcoded strings in the Reports view that were not extracted to locale files during the previous vendor's partial i18n implementation
- **Data pattern inconsistencies** — computed properties or API response shapes that behave differently in Reports than in other views, causing display anomalies

We will deliver a defect log before beginning remediation, so Meridian can confirm our findings match their observed issues. Fixes will be made in the Vue Composition API pattern (migrating any remaining Options API code in the Reports module as we go), and each fix will be covered by a browser test before we mark it closed.

**Assumption:** Meridian can provide reproduction steps or screenshots for the eight logged issues, or grant access to a staff member who can demonstrate them.

---

## R2 — Restocking Recommendations View

**Our approach:** New view built on the existing data model, with a budget-ceiling constraint.

The Restocking view will be a new page in the dashboard that surfaces purchase order recommendations based on three inputs:

1. **Current stock levels** — drawn from the existing `/api/inventory` endpoint
2. **Demand forecast** — drawn from the existing `/api/demand` endpoint
3. **Budget ceiling** — an operator-supplied value entered directly in the view

The recommendation logic will compute a restock priority score for each SKU/warehouse combination by comparing current stock against forecasted demand over a configurable horizon (default: 30 days). SKUs where stock covers less than the demand forecast will be flagged for restocking; the algorithm will then rank and filter recommendations to fit within the budget ceiling, prioritizing highest-deficit items first.

The view will include:
- A budget input field (currency, editable)
- A ranked recommendations table (SKU, warehouse, current stock, forecasted demand, recommended order quantity, estimated cost)
- A filter to scope recommendations by warehouse or category
- A summary bar showing total estimated spend vs. budget ceiling

A new FastAPI endpoint (`GET /api/restocking/recommendations`) will encapsulate the recommendation logic server-side, keeping the Vue component focused on presentation. This endpoint will accept the same warehouse/category filters as existing endpoints, plus a `budget` parameter.

**Assumption:** The existing demand forecast data in `/api/demand` is sufficient as the forecast input. If Meridian uses a separate forecasting system, an integration point can be scoped as an extension.

---

## R3 — Automated Browser Testing

**Our approach:** Playwright end-to-end tests covering all four critical flows, integrated into a repeatable run command.

We will use **Playwright** as the browser automation framework. Tests will be written against the running application (localhost in development, a staging URL in production) and will cover the four flows Meridian IT has identified as critical:

| Flow | Key scenarios covered |
|---|---|
| **Inventory view** | Load, filter by warehouse, filter by category, combined filters, empty state |
| **Orders view** | Load, filter by status, filter by month, filter combinations |
| **Reports module** | All filters functional post-remediation, data displays correctly, no console errors |
| **Restocking view** | Budget input, recommendations load, filter by warehouse, budget ceiling respected in output |

Tests will be deterministic — no flaky network dependencies, no hardcoded timeouts. We will use the application's existing mock data layer (JSON files) as the test data source, which means tests can run without a live database or external service.

A `npm run test:e2e` command will be added to the client, documented in a README update, so Meridian IT can run the full suite independently. We will also provide a brief written guide on how to add new test cases as the application evolves.

**Why this unblocks everything:** R3 is effectively a prerequisite for safe delivery of every other requirement. We are treating it as parallel work in Phase 1, not a follow-on.

---

## R4 — Architecture Documentation

**Our approach:** Explore the actual codebase, not the handoff notes, and document what's really there.

The previous vendor's handoff document is thin and may not reflect the current state of the code. We will perform our own architecture review as part of project onboarding and produce a current-state overview covering:

- **Component map** — Vue views, their data dependencies, and how they interact with `api.js`
- **API surface** — all FastAPI endpoints, their parameters, and the filtering logic applied server-side
- **Data model** — the shape of the JSON data files and how they map to API responses
- **Known debt** — a candid list of patterns left incomplete by the previous vendor (Options API remnants, unwired filters, etc.) with a recommended remediation order

The documentation will be delivered as an HTML diagram + written narrative (format we've found most useful for IT handoffs), written to the repository so it travels with the codebase. It will be reviewed with Meridian IT before Phase 2 closes.

---

## D1 — UI Modernization

**Our approach:** Incorporate Meridian's brand colors and font into a refreshed visual design.

Since Meridian has basic brand assets (colors and font) but no formal design system, we will propose a clean, modern direction that uses those assets as anchors. The current design uses a slate/gray palette with custom SVG charts — we will retain the structural approach but refresh spacing, typography, and component styling to align with current dashboard conventions.

UI work is scoped as Phase 4 and will not begin until R1–R4 are complete and accepted.

---

## D2 — Internationalization

**Our approach:** Extend i18n to all remaining modules, with Japanese as the primary target language.

The previous vendor began an i18n implementation but left it incomplete. We will audit the current locale coverage, extract all remaining hardcoded strings, and produce a Japanese translation. The implementation will use Vue I18n (the standard for Vue 3 applications), structured so that additional APAC languages can be added by providing a new locale file — no code changes required.

**Assumption:** Meridian will provide or arrange Japanese translation review. We will deliver the string extraction and locale file structure; native translation validation is a Meridian responsibility.

---

## D3 — Dark Mode

**Our approach:** Operator-selectable theme using CSS custom properties.

Dark mode will be implemented as a CSS variable–based theming system with a toggle stored in the user's browser (localStorage). Warehouse floor stations will default to dark; other contexts will default to light. The implementation is non-destructive — it does not require changes to component logic, only to the design token layer.

---

## General Assumptions

1. Meridian will provide access to the current hosting environment and a staging instance for browser test automation.
2. The existing JSON data files are the authoritative data source for this engagement. Database integration is out of scope.
3. Meridian IT will designate a point of contact for the architecture review session in Phase 2.
4. Material scope changes will be discussed and agreed in writing before any cost impact is incurred.
