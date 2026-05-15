import type { ContextSnapshot } from "@/data/types";

export type Scenario = {
  label: string;
  weight: number;
  thesis: string;
  triggers: string[];
  invalidations: string[];
  conceptRefs: string[];
  playbookRefs: string[];
};

export type ContextRead = {
  controllingTimeframe: "OTF" | "Day-Timeframe" | "Mixed" | "Unclear";
  controlNote: string;
  scenarios: Scenario[];
  lookFor: string[];
  avoid: string[];
  conceptRefs: string[];
};

const norm = (n: number) => {
  if (n <= 0) return 0;
  return Math.min(0.95, Math.max(0.05, n));
};

export function synthesize(c: ContextSnapshot): ContextRead {
  const scenarios: Scenario[] = [];
  const lookFor: Set<string> = new Set();
  const avoid: Set<string> = new Set();
  const conceptRefs: Set<string> = new Set();

  let otfWeight = 0;
  let dtWeight = 0;

  // Overnight inventory interactions
  if (c.overnightInventory === "long" && c.openLocation === "above-vah") {
    scenarios.push({
      label: "Open-Rejection-Reverse from overhang",
      weight: 0.55,
      thesis: "Long overnight inventory and open above prior value invites mechanical correction back into value.",
      triggers: ["Failure to find acceptance above VAH", "CVD divergence at extension", "Reclaim of opening print"],
      invalidations: ["Acceptance prints above VAH for >30 min", "No CVD divergence at extreme"],
      conceptRefs: ["dalton-overnight-inventory", "dalton-open-rejection-reverse", "axia-trapped"],
      playbookRefs: ["playbook-open-rejection-reverse"],
    });
    avoid.add("Chasing longs at the open without acceptance signal.");
    dtWeight += 1;
  }
  if (c.overnightInventory === "short" && c.openLocation === "below-val") {
    scenarios.push({
      label: "Reversion long off short inventory",
      weight: 0.55,
      thesis: "Short overnight inventory and open below value sets up reversion if responsive buyers appear at the open.",
      triggers: ["Aggressive buying with absorption at the low", "Reclaim of opening print", "CVD divergence"],
      invalidations: ["Continued selling acceptance below VAL", "No absorption at the low"],
      conceptRefs: ["dalton-overnight-inventory", "axia-absorption", "axia-trapped"],
      playbookRefs: ["playbook-failed-break", "playbook-open-rejection-reverse"],
    });
    dtWeight += 1;
  }

  // Open Type effects
  if (c.openType === "drive") {
    scenarios.push({
      label: "Trend Day continuation",
      weight: 0.7,
      thesis: "Open-Drive characteristics raise base rates of a Trend Day. Ride pullbacks.",
      triggers: ["Shallow pullback that holds with absorption", "Sustained CVD slope", "IB extension"],
      invalidations: ["Deep pullback (>61.8% of drive)", "CVD slope flattens"],
      conceptRefs: ["dalton-open-drive", "dalton-trend-day", "cp-day-6"],
      playbookRefs: ["playbook-open-drive", "playbook-ib-extension"],
    });
    lookFor.add("First pullback that holds with absorption — primary entry.");
    avoid.add("Counter-trend fades.");
    otfWeight += 2;
  }
  if (c.openType === "test-drive") {
    scenarios.push({
      label: "Open-Test-Drive reversal",
      weight: 0.5,
      thesis: "Failed probe at the open traps the wrong side; the reversal becomes the day's primary leg.",
      triggers: ["Failed test at known reference", "CVD divergence at extreme", "Reclaim of opening print on volume"],
      invalidations: ["Probe holds for >30 min", "No reversal flow after failure"],
      conceptRefs: ["dalton-open-test-drive", "axia-trapped"],
      playbookRefs: ["playbook-open-test-drive"],
    });
    otfWeight += 1;
  }
  if (c.openType === "rejection-reverse") {
    scenarios.push({
      label: "Open-Rejection-Reverse leg",
      weight: 0.55,
      thesis: "Initial push rejected; reversal usually carries to opposite reference.",
      triggers: ["Reclaim of opening print", "CVD slope flips", "Aggressive opposite flow"],
      invalidations: ["Failed reclaim attempts", "No counter flow"],
      conceptRefs: ["dalton-open-rejection-reverse", "axia-trapped"],
      playbookRefs: ["playbook-open-rejection-reverse"],
    });
    otfWeight += 1;
  }
  if (c.openType === "auction-in" || c.openType === "auction-out") {
    scenarios.push({
      label: "Two-sided rotation",
      weight: 0.45,
      thesis: "Open-Auction signals no committed timeframe. Trade edges responsively or stand aside.",
      triggers: ["Test of IB extreme with absorption", "CVD divergence at edges"],
      invalidations: ["Acceptance outside IB with sustained flow"],
      conceptRefs: ["dalton-open-auction", "dalton-normal-day"],
      playbookRefs: ["playbook-range-fade"],
    });
    avoid.add("Trying to force directional bias in low-commitment open.");
    dtWeight += 2;
  }

  // Value migration
  if (c.valueMigration === "higher") {
    scenarios.push({
      label: "Continuation higher off value-higher migration",
      weight: 0.5,
      thesis: "Value-higher (no overlap) typically persists; expect buyer follow-through.",
      triggers: ["Hold of prior VAH on first pullback", "Aggressive buying at responsive levels"],
      invalidations: ["Break and acceptance below prior VAH"],
      conceptRefs: ["dalton-migrating-value", "dalton-value-area"],
      playbookRefs: ["playbook-first-touch-absorption"],
    });
    lookFor.add("Long entries on first defense of prior VAH.");
    otfWeight += 1;
  }
  if (c.valueMigration === "lower") {
    scenarios.push({
      label: "Continuation lower off value-lower migration",
      weight: 0.5,
      thesis: "Value-lower (no overlap) typically persists; expect seller follow-through.",
      triggers: ["Failed defense of prior VAL on retest", "CVD slope persistently negative"],
      invalidations: ["Reclaim and acceptance above prior VAL"],
      conceptRefs: ["dalton-migrating-value", "dalton-value-area"],
      playbookRefs: ["playbook-first-touch-absorption"],
    });
    lookFor.add("Short entries on failed retest of prior VAL.");
    otfWeight += 1;
  }
  if (c.valueMigration === "unchanged") {
    lookFor.add("Balance behavior — rotate edges, do not chase breakouts inside the range.");
    dtWeight += 1;
  }

  // Balance location
  if (c.balanceLocation === "inside-3d") {
    avoid.add("Initiating breakout positions inside 3-day balance.");
    lookFor.add("Edge fades with absorption when responsive flow appears.");
    dtWeight += 2;
  }
  if (c.balanceLocation === "above-3d" || c.balanceLocation === "below-3d") {
    scenarios.push({
      label: "Out-of-balance acceleration",
      weight: 0.5,
      thesis: "Price outside the 3-day balance — expect acceleration to the next reference, or rejection back inside.",
      triggers: ["Sustained acceptance outside balance", "Aggressive flow continuing in the break direction"],
      invalidations: ["Return inside balance with rejection flow"],
      conceptRefs: ["dalton-balance", "dalton-composite", "cp-day-6"],
      playbookRefs: ["playbook-first-touch-absorption", "playbook-naked-poc-magnet"],
    });
    otfWeight += 1;
  }

  // Excess / poor
  if (c.excessOrPoor === "poor-high") {
    lookFor.add("Magnet pull toward the poor high — bias long while context allows.");
    conceptRefs.add("dalton-excess-poor");
  }
  if (c.excessOrPoor === "poor-low") {
    lookFor.add("Magnet pull toward the poor low — bias short while context allows.");
    conceptRefs.add("dalton-excess-poor");
  }
  if (c.excessOrPoor === "excess-high") {
    lookFor.add("Excess high is a barrier — fade tests with absorption.");
    conceptRefs.add("dalton-excess-poor");
  }
  if (c.excessOrPoor === "excess-low") {
    lookFor.add("Excess low is a barrier — fade tests with absorption.");
    conceptRefs.add("dalton-excess-poor");
  }

  // Yesterday day type
  if (c.yesterdayDayType === "trend") {
    lookFor.add("Expect balance follow — likely Normal or Normal Variation today after a Trend Day.");
    dtWeight += 1;
  }
  if (c.yesterdayDayType === "neutral-extreme") {
    lookFor.add("Continuation in the closing-extreme direction is the prior session's signal.");
    otfWeight += 1;
  }

  // Naked POCs
  if (c.nakedPocsAbove.trim() || c.nakedPocsBelow.trim()) {
    scenarios.push({
      label: "Naked POC magnet",
      weight: 0.4,
      thesis: "Untested POCs act as magnets while no opposing wall intervenes.",
      triggers: ["Drift toward nearest naked POC with supportive flow", "No defense at intermediate references"],
      invalidations: ["Strong defense at an intermediate level", "Flow flips before reaching the POC"],
      conceptRefs: ["dalton-naked-poc"],
      playbookRefs: ["playbook-naked-poc-magnet"],
    });
  }

  // Market posture
  if (c.marketPosture === "risk-off") {
    avoid.add("Aggressive long bias in risk-off macro posture.");
  }
  if (c.marketPosture === "risk-on") {
    lookFor.add("Trend continuation receives a tailwind.");
  }

  // Always-on reminders
  lookFor.add("Absorption signature at any tested level before acting.");
  lookFor.add("CVD slope must agree with thesis before sizing.");
  avoid.add("Style drift — pre-classify scalp / intraday before entry.");

  // Normalize weights
  const total = scenarios.reduce((s, x) => s + x.weight, 0) || 1;
  scenarios.forEach((s) => (s.weight = norm(s.weight / total)));
  scenarios.sort((a, b) => b.weight - a.weight);

  let controllingTimeframe: ContextRead["controllingTimeframe"] = "Unclear";
  if (otfWeight > dtWeight + 1) controllingTimeframe = "OTF";
  else if (dtWeight > otfWeight + 1) controllingTimeframe = "Day-Timeframe";
  else if (otfWeight > 0 || dtWeight > 0) controllingTimeframe = "Mixed";

  const controlNote =
    controllingTimeframe === "OTF"
      ? "Other-Timeframe in control. Trend / directional context. Do not fade initiative."
      : controllingTimeframe === "Day-Timeframe"
      ? "Day-Timeframe in control. Rotation context. Trade edges responsively."
      : controllingTimeframe === "Mixed"
      ? "Mixed — wait for IB completion before committing size."
      : "Insufficient signal — fill more fields or stand aside.";

  scenarios.forEach((s) => s.conceptRefs.forEach((r) => conceptRefs.add(r)));

  return {
    controllingTimeframe,
    controlNote,
    scenarios: scenarios.slice(0, 3),
    lookFor: Array.from(lookFor),
    avoid: Array.from(avoid),
    conceptRefs: Array.from(conceptRefs),
  };
}
