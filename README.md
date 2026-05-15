# Operator — Auction & Order-Flow Decision Tool

Institutional-grade interactive learning library and daily decision companion for futures traders. Weaves three knowledge sources into one operating loop:

1. **Career Program** — your first-principles foundation (Days 1–6).
2. **Jim Dalton / Auction Market Theory** (Mind Over Markets, Markets in Profile).
3. **Axia Futures execution frameworks** — tape, DOM, footprint, CVD, absorption, traps, risk, process.

No login, no backend, no analytics, no tracking. Single-user tool. All state persists locally.

---

## Run it

```
npm install
npm run dev
```

Open http://localhost:3000.

```
npm run build && npm start    # production
npm run typecheck             # TypeScript strict pass
```

## Modules

- **Console** — overview tiles for every module.
- **Foundation Library** (`/library`) — all concepts grouped by Career Program day, then Dalton, then Axia. Each card has the 9-section structure (essence, definition, visual SVG, why, how-to-see, what-to-do, mistakes, related, source badges). Filter by source, fuzzy search, deep-link via `?c=<id>`.
- **Context Locator** (`/context`) — structured inputs → synthesized read (controlling timeframe, 2–3 probable scenarios with weighting, look-for / avoid, links into builder & playbook).
- **Daily Planning Workbench** (`/plan`) — levels, inventory, primary & secondary scenarios, invalidations, hunt list. Printable plan card.
- **Trade Idea Builder** (`/builder`) — context → bias → level → setup → confirmations → R:R-gated trade card (rejected below 2R unless flagged).
- **Execution Playbook** (`/playbook`) — 12 named setups: first-touch absorption, failed-break sweep, Open-Drive, Open-Test-Drive, Open-Rejection-Reverse, VWAP reclaim, naked POC magnet, IB extension, range fade, gap-fill vs gap-go, excess fade, poor return.
- **Day Type Identifier** (`/daytype`) — live classifier. Update through the session.
- **Knowledge Graph** (`/graph`) — force-directed map; click any node to surface its connections across the three systems.
- **Debrief Journal** (`/journal`) — plan adherence, context read, day type match; lessons stored against the relevant concept and accumulated over time per-concept.

## Keyboard

- `⌘K` / `Ctrl+K` — command palette (search modules, concepts, playbooks).
- `g h` — Console
- `g l` — Foundation Library
- `g c` — Context Locator
- `g p` — Daily Planning
- `g b` — Trade Idea Builder
- `g x` — Execution Playbook
- `g d` — Day Type Identifier
- `g g` — Knowledge Graph
- `g j` — Debrief Journal

## Data model

See `data/types.ts`. Key types:

```ts
type Concept = {
  id, title, essence, definition, visualSvg,
  whyItMatters, howToSeeItLive, whatToDo,
  commonMistakes[], related[], sources[],
  careerProgramDay?, tags[]
};

type Playbook = {
  id, name, requiredContext, trigger, confirmations[],
  entry, stop, targets, management, traps[],
  invalidations[], relatedConcepts[]
};

type DailyPlan = { date, levels[], inventory, primaryScenario, secondaryScenario, hunts[], notes };
type ContextSnapshot = { balanceLocation, overnightInventory, …, marketPosture, notes };
type TradeIdea = { id, createdAt, contextSummary, bias, level, setupId, confirmations[], entry, stop, target, rMultiple, invalidations, sizeR, status, notes };
type JournalEntry = { id, date, followedPlan, contextRead, dayTypeMatched, mostRelevantConceptId, lessons[], freeText };
```

Persistence: `idb-keyval` (IndexedDB). State store: `lib/store.ts` (Zustand). Local-only.

## Add a new concept

Edit `data/concepts.ts`. Append to one of the three arrays (`careerProgram`, `dalton`, `axia`). Provide the full 9-section structure. To draw a custom SVG, add it to `data/svgs.ts` and import it. Source badges and the Knowledge Graph update automatically from `sources` and `related`.

## Add a new playbook

Edit `data/playbooks.ts`. Append a `Playbook` object. Provide `relatedConcepts` IDs; they automatically link to the Foundation Library and surface in Context Locator scenario recommendations.

## Extend Context Locator inputs

1. Add a field to `ContextSnapshot` in `data/types.ts`.
2. Render a `<SelectField>` in `app/context/page.tsx`.
3. Add interpretation logic in `lib/context-engine.ts` (`synthesize`).
4. Persistence happens automatically via Zustand store.

## Voice

> Absorption is the moment passive size eats aggressive flow without giving ground. At a tested level with rising aggressive volume and stalled price, you are watching size defend value. Trade in the direction of the absorption, not against it. If the level breaks anyway, the trapped aggressors fuel the move that follows.

Match this tone everywhere. Tight, declarative, operator-grade.

## Stack

Next.js 14 (App Router) · TypeScript strict · Tailwind CSS · Framer Motion · D3 · Lucide · Zustand · idb-keyval · cmdk.
