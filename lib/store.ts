"use client";
import { create } from "zustand";
import { loadPersisted, savePersisted } from "./persistence";
import type {
  ContextSnapshot,
  DailyPlan,
  JournalEntry,
  Level,
  Scenario,
  TradeIdea,
} from "@/data/types";

const today = () => new Date().toISOString().slice(0, 10);

const emptyScenario = (): Scenario => ({
  bias: "long",
  thesis: "",
  triggerLevel: "",
  orderFlowTriggers: "",
  targets: "",
  invalidation: "",
});

const emptyPlan = (): DailyPlan => ({
  date: today(),
  levels: [],
  inventory: "",
  primaryScenario: emptyScenario(),
  secondaryScenario: emptyScenario(),
  hunts: [],
  notes: "",
});

const emptyContext = (): ContextSnapshot => ({
  balanceLocation: "",
  overnightInventory: "",
  excessOrPoor: "",
  yesterdayDayType: "",
  valueMigration: "",
  openLocation: "",
  openType: "",
  nakedPocsAbove: "",
  nakedPocsBelow: "",
  marketPosture: "",
  notes: "",
});

type State = {
  hydrated: boolean;
  plan: DailyPlan;
  context: ContextSnapshot;
  trades: TradeIdea[];
  journal: JournalEntry[];

  setPlan: (p: DailyPlan) => void;
  patchPlan: (p: Partial<DailyPlan>) => void;
  setScenario: (which: "primaryScenario" | "secondaryScenario", s: Scenario) => void;
  addLevel: (l: Level) => void;
  removeLevel: (idx: number) => void;
  toggleHunt: (id: string) => void;

  setContext: (c: ContextSnapshot) => void;
  patchContext: (c: Partial<ContextSnapshot>) => void;

  addTrade: (t: TradeIdea) => void;
  updateTrade: (id: string, patch: Partial<TradeIdea>) => void;
  removeTrade: (id: string) => void;

  addJournal: (j: JournalEntry) => void;
  updateJournal: (id: string, patch: Partial<JournalEntry>) => void;
  removeJournal: (id: string) => void;

  hydrate: () => Promise<void>;
};

const PERSIST_KEYS = {
  plan: "tlt.plan",
  context: "tlt.context",
  trades: "tlt.trades",
  journal: "tlt.journal",
} as const;

export const useStore = create<State>((set, get) => ({
  hydrated: false,
  plan: emptyPlan(),
  context: emptyContext(),
  trades: [],
  journal: [],

  setPlan: (p) => {
    set({ plan: p });
    savePersisted(PERSIST_KEYS.plan, p);
  },
  patchPlan: (p) => {
    const next = { ...get().plan, ...p };
    set({ plan: next });
    savePersisted(PERSIST_KEYS.plan, next);
  },
  setScenario: (which, s) => {
    const next = { ...get().plan, [which]: s };
    set({ plan: next });
    savePersisted(PERSIST_KEYS.plan, next);
  },
  addLevel: (l) => {
    const next = { ...get().plan, levels: [...get().plan.levels, l] };
    set({ plan: next });
    savePersisted(PERSIST_KEYS.plan, next);
  },
  removeLevel: (idx) => {
    const levels = get().plan.levels.filter((_, i) => i !== idx);
    const next = { ...get().plan, levels };
    set({ plan: next });
    savePersisted(PERSIST_KEYS.plan, next);
  },
  toggleHunt: (id) => {
    const cur = get().plan.hunts;
    const hunts = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    const next = { ...get().plan, hunts };
    set({ plan: next });
    savePersisted(PERSIST_KEYS.plan, next);
  },

  setContext: (c) => {
    set({ context: c });
    savePersisted(PERSIST_KEYS.context, c);
  },
  patchContext: (c) => {
    const next = { ...get().context, ...c };
    set({ context: next });
    savePersisted(PERSIST_KEYS.context, next);
  },

  addTrade: (t) => {
    const next = [t, ...get().trades];
    set({ trades: next });
    savePersisted(PERSIST_KEYS.trades, next);
  },
  updateTrade: (id, patch) => {
    const next = get().trades.map((t) => (t.id === id ? { ...t, ...patch } : t));
    set({ trades: next });
    savePersisted(PERSIST_KEYS.trades, next);
  },
  removeTrade: (id) => {
    const next = get().trades.filter((t) => t.id !== id);
    set({ trades: next });
    savePersisted(PERSIST_KEYS.trades, next);
  },

  addJournal: (j) => {
    const next = [j, ...get().journal];
    set({ journal: next });
    savePersisted(PERSIST_KEYS.journal, next);
  },
  updateJournal: (id, patch) => {
    const next = get().journal.map((j) => (j.id === id ? { ...j, ...patch } : j));
    set({ journal: next });
    savePersisted(PERSIST_KEYS.journal, next);
  },
  removeJournal: (id) => {
    const next = get().journal.filter((j) => j.id !== id);
    set({ journal: next });
    savePersisted(PERSIST_KEYS.journal, next);
  },

  hydrate: async () => {
    const [plan, context, trades, journal] = await Promise.all([
      loadPersisted<DailyPlan>(PERSIST_KEYS.plan, emptyPlan()),
      loadPersisted<ContextSnapshot>(PERSIST_KEYS.context, emptyContext()),
      loadPersisted<TradeIdea[]>(PERSIST_KEYS.trades, []),
      loadPersisted<JournalEntry[]>(PERSIST_KEYS.journal, []),
    ]);
    set({ plan, context, trades, journal, hydrated: true });
  },
}));
