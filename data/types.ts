export type Source = "career-program" | "dalton" | "axia";

export type Concept = {
  id: string;
  title: string;
  essence: string;
  definition: string;
  visualSvg?: string;
  whyItMatters: string;
  howToSeeItLive: string;
  whatToDo: string;
  commonMistakes: string[];
  related: string[];
  sources: Source[];
  careerProgramDay?: 1 | 2 | 3 | 4 | 5 | 6;
  tags: string[];
};

export type Playbook = {
  id: string;
  name: string;
  requiredContext: string;
  trigger: string;
  confirmations: string[];
  entry: string;
  stop: string;
  targets: string;
  management: string;
  traps: string[];
  invalidations: string[];
  relatedConcepts: string[];
};

export type Scenario = {
  bias: "long" | "short" | "two-sided";
  thesis: string;
  triggerLevel: string;
  orderFlowTriggers: string;
  targets: string;
  invalidation: string;
};

export type Level = {
  label: string;
  price: string;
  kind:
    | "prior-high"
    | "prior-low"
    | "settlement"
    | "onh"
    | "onl"
    | "ib-high"
    | "ib-low"
    | "poc"
    | "vah"
    | "val"
    | "naked-poc"
    | "weekly"
    | "monthly"
    | "custom";
};

export type DailyPlan = {
  date: string;
  levels: Level[];
  inventory: "long" | "short" | "balanced" | "";
  primaryScenario: Scenario;
  secondaryScenario: Scenario;
  hunts: string[];
  notes: string;
};

export type ContextSnapshot = {
  balanceLocation: "inside-3d" | "above-3d" | "below-3d" | "edge" | "";
  overnightInventory: "long" | "short" | "balanced" | "";
  excessOrPoor: "excess-high" | "excess-low" | "poor-high" | "poor-low" | "clean" | "mixed" | "";
  yesterdayDayType:
    | "normal"
    | "normal-variation"
    | "trend"
    | "double-distribution"
    | "neutral-center"
    | "neutral-extreme"
    | "";
  valueMigration: "higher" | "lower" | "overlap-higher" | "overlap-lower" | "unchanged" | "";
  openLocation:
    | "above-vah"
    | "inside-va"
    | "below-val"
    | "in-range"
    | "out-of-range-up"
    | "out-of-range-down"
    | "";
  openType: "drive" | "test-drive" | "rejection-reverse" | "auction-in" | "auction-out" | "";
  nakedPocsAbove: string;
  nakedPocsBelow: string;
  marketPosture: "risk-on" | "risk-off" | "mixed" | "";
  notes: string;
};

export type TradeIdea = {
  id: string;
  createdAt: number;
  contextSummary: string;
  bias: "long" | "short" | "two-sided";
  level: string;
  setupId: string;
  confirmations: string[];
  entry: string;
  stop: string;
  target: string;
  rMultiple: number;
  invalidations: string;
  sizeR: number;
  status: "draft" | "armed" | "filled" | "missed" | "stopped" | "win" | "scratch";
  notes: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  followedPlan: "yes" | "no" | "partial" | "";
  contextRead: "correct" | "wrong" | "partial" | "";
  dayTypeMatched: "yes" | "no" | "partial" | "";
  mostRelevantConceptId: string;
  lessons: { conceptId: string; lesson: string }[];
  freeText: string;
};
