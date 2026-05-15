# Where the content lives

This document maps every body of knowledge in the app to a single file so you can edit principles, examples, and playbooks without touching application code.

## Career Program — Days 1–6 (verbatim principles)

File: **`data/concepts.ts`**

Search for the array `careerProgram`. Each `Concept` whose `careerProgramDay` is set to 1–6 contains the verbatim principles inside its `definition` field. Bullet points are encoded as `• `-prefixed lines (joined with `\n• ` in the source).

Day → concept ID:
- Day 1 — `cp-day-1` (Futures and Options)
- Day 2 — `cp-day-2` (Support and Resistance)
- Day 3 — `cp-day-3` (Chart Patterns)
- Day 4 — `cp-day-4` (Volume and Delta)
- Day 5 — `cp-day-5` (Entry and Exit)
- Day 6 — `cp-day-6` (Profile Principles)

To rewrite a principle, edit only the `definition` string. Do not change the `id` — many other concepts link to it via `related`.

## Dalton / Auction Market Theory

File: **`data/concepts.ts`**, array `dalton`. Concept IDs prefixed `dalton-` (e.g., `dalton-value-area`, `dalton-trend-day`, `dalton-open-drive`).

## Axia execution frameworks

File: **`data/concepts.ts`**, array `axia`. Concept IDs prefixed `axia-` (e.g., `axia-absorption`, `axia-cvd`, `axia-footprint`, `axia-risk`, `axia-process`).

## Visuals (SVGs)

File: **`data/svgs.ts`**. Hand-built inline SVG snippets keyed by export name (e.g., `svgAbsorption`, `svgTrendDay`). Edit the SVG markup directly. Each concept references one of these via `visualSvg`.

## Execution playbooks

File: **`data/playbooks.ts`**. Each `Playbook` carries: `requiredContext`, `trigger`, `confirmations[]`, `entry`, `stop`, `targets`, `management`, `traps[]`, `invalidations[]`, `relatedConcepts[]`. Add a new one by appending to the array.

## Context Locator interpretation logic

File: **`lib/context-engine.ts`**. The `synthesize` function reads `ContextSnapshot` and produces scenarios, look-for / avoid lists, and timeframe-control read. Add new rules here.

## Day Type Identifier rules

File: **`app/daytype/page.tsx`**, function `classify`. Add or refine classification heuristics directly there.

## Voice samples

The "Today's voice" block on Console (`app/page.tsx`) holds a sample quote that demonstrates the in-app voice. Edit there to swap.

---

No content lives inside React components beyond the routing/layout chrome. All editable knowledge sits in `data/` and `lib/context-engine.ts`.
