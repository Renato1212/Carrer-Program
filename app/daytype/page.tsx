"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { SelectField } from "@/components/select-field";
import { conceptById } from "@/data/concepts";
import { playbookById } from "@/data/playbooks";

type Inputs = {
  openType: "drive" | "test-drive" | "rejection-reverse" | "auction-in" | "auction-out" | "";
  ibWidth: "narrow" | "average" | "wide" | "";
  midMorning: "extension-up" | "extension-down" | "rotation" | "both-sides" | "";
  rangeRel: "tight" | "average" | "expanded" | "";
  valueRel: "higher" | "lower" | "overlap" | "unchanged" | "";
};

const empty: Inputs = {
  openType: "",
  ibWidth: "",
  midMorning: "",
  rangeRel: "",
  valueRel: "",
};

type Read = {
  label: string;
  weight: number;
  concept: string;
  playbook?: string;
  tells: string[];
  killers: string[];
};

function classify(i: Inputs): Read[] {
  const reads: Read[] = [];

  if (i.openType === "drive" && i.ibWidth === "narrow") {
    reads.push({
      label: "Trend Day",
      weight: 0.7,
      concept: "dalton-trend-day",
      playbook: "playbook-open-drive",
      tells: ["Shallow pullbacks absorbed", "CVD slope sustains", "IB extends and never returns inside"],
      killers: ["Deep pullback > 61.8%", "CVD flattens", "Reclaim of opening print against"],
    });
  }
  if (i.openType === "drive" && i.ibWidth !== "narrow") {
    reads.push({
      label: "Normal Variation Day",
      weight: 0.55,
      concept: "dalton-normal-variation",
      playbook: "playbook-ib-extension",
      tells: ["One-sided IB extension that holds", "Value migrates in extension direction"],
      killers: ["IB extension reverses back into IB", "Two-sided rotation post-IB"],
    });
  }
  if (i.openType === "auction-in" || (i.ibWidth === "wide" && i.midMorning === "rotation")) {
    reads.push({
      label: "Normal Day",
      weight: 0.55,
      concept: "dalton-normal-day",
      playbook: "playbook-range-fade",
      tells: ["Range largely set in IB", "Extensions fail quickly", "Rotation around POC"],
      killers: ["IB extension that holds and trends"],
    });
  }
  if (i.midMorning === "both-sides") {
    reads.push({
      label: "Neutral Day",
      weight: 0.6,
      concept: "dalton-neutral-center",
      tells: ["Both extremes tested", "Indecision throughout"],
      killers: ["Strong commitment one direction post-extension"],
    });
  }
  if (i.openType === "test-drive") {
    reads.push({
      label: "Open-Test-Drive reversal day",
      weight: 0.5,
      concept: "dalton-open-test-drive",
      playbook: "playbook-open-test-drive",
      tells: ["Initial test fails", "Reversal breaks opening print with size"],
      killers: ["Test holds and trends", "No reversal flow"],
    });
  }
  if (i.openType === "rejection-reverse") {
    reads.push({
      label: "Open-Rejection-Reverse day",
      weight: 0.5,
      concept: "dalton-open-rejection-reverse",
      playbook: "playbook-open-rejection-reverse",
      tells: ["Reclaim of opening print", "CVD divergence at extension extreme"],
      killers: ["Failed reclaim attempts"],
    });
  }
  if (i.rangeRel === "expanded" && i.midMorning && i.midMorning !== "rotation" && i.midMorning !== "both-sides") {
    reads.push({
      label: "Double Distribution Trend Day",
      weight: 0.45,
      concept: "dalton-double-distribution",
      tells: ["Single prints between two distributions", "New distribution building in extension direction"],
      killers: ["Range collapses back into first distribution"],
    });
  }

  if (reads.length === 0) {
    reads.push({
      label: "Unclear",
      weight: 0.2,
      concept: "dalton-day-types",
      tells: ["Fill more fields"],
      killers: [],
    });
  }

  const total = reads.reduce((s, r) => s + r.weight, 0) || 1;
  reads.forEach((r) => (r.weight = r.weight / total));
  return reads.sort((a, b) => b.weight - a.weight).slice(0, 3);
}

export default function DayTypePage() {
  const [i, set] = useState<Inputs>(empty);
  const reads = useMemo(() => classify(i), [i]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Day Type Identifier</div>
        <h1 className="text-2xl font-semibold tracking-tightish mt-1">Update as the day unfolds.</h1>
        <p className="text-ink-muted text-sm mt-1 max-w-2xl">
          Probabilistic read on developing day type. Misclassifying the day is the most expensive strategic mistake — re-check at every structural event.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-5 grid sm:grid-cols-2 gap-3">
          <SelectField
            label="Open type observed"
            value={i.openType}
            onChange={(v) => set({ ...i, openType: v as Inputs["openType"] })}
            options={[
              { value: "drive", label: "Open-Drive" },
              { value: "test-drive", label: "Open-Test-Drive" },
              { value: "rejection-reverse", label: "Open-Rejection-Reverse" },
              { value: "auction-in", label: "Open-Auction (in range)" },
              { value: "auction-out", label: "Open-Auction (out of range)" },
            ]}
          />
          <SelectField
            label="IB width vs recent ADR"
            value={i.ibWidth}
            onChange={(v) => set({ ...i, ibWidth: v as Inputs["ibWidth"] })}
            options={[
              { value: "narrow", label: "Narrow" },
              { value: "average", label: "Average" },
              { value: "wide", label: "Wide" },
            ]}
          />
          <SelectField
            label="Mid-morning behavior"
            value={i.midMorning}
            onChange={(v) => set({ ...i, midMorning: v as Inputs["midMorning"] })}
            options={[
              { value: "extension-up", label: "Extension up only" },
              { value: "extension-down", label: "Extension down only" },
              { value: "rotation", label: "Rotation inside IB" },
              { value: "both-sides", label: "Both sides extended" },
            ]}
          />
          <SelectField
            label="Range vs ADR (live)"
            value={i.rangeRel}
            onChange={(v) => set({ ...i, rangeRel: v as Inputs["rangeRel"] })}
            options={[
              { value: "tight", label: "Tight" },
              { value: "average", label: "Average" },
              { value: "expanded", label: "Expanded" },
            ]}
          />
          <SelectField
            label="Developing value vs prior"
            value={i.valueRel}
            onChange={(v) => set({ ...i, valueRel: v as Inputs["valueRel"] })}
            options={[
              { value: "higher", label: "Higher" },
              { value: "lower", label: "Lower" },
              { value: "overlap", label: "Overlap" },
              { value: "unchanged", label: "Unchanged" },
            ]}
          />
        </section>

        <section className="space-y-3">
          <div className="h-section">Developing day type</div>
          {reads.map((r, idx) => {
            const c = conceptById(r.concept);
            const p = r.playbook ? playbookById(r.playbook) : null;
            return (
              <div key={idx} className="card p-5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-ink-subtle">#{idx + 1}</span>
                    <h3 className="text-ink font-semibold tracking-tightish">{r.label}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-bg-surface rounded overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${Math.round(r.weight * 100)}%` }} />
                    </div>
                    <span className="font-mono text-[11px] text-ink-muted tabular-nums">{Math.round(r.weight * 100)}%</span>
                  </div>
                </div>
                {r.tells.length > 0 && (
                  <div>
                    <div className="h-section mb-1">Confirmation tells</div>
                    <ul className="text-sm text-ink space-y-0.5">
                      {r.tells.map((t, j) => (
                        <li key={j} className="flex gap-2"><span className="text-long">→</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {r.killers.length > 0 && (
                  <div>
                    <div className="h-section mb-1">Rejection tells</div>
                    <ul className="text-sm text-ink space-y-0.5">
                      {r.killers.map((t, j) => (
                        <li key={j} className="flex gap-2"><span className="text-short">×</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c && <Link href={`/library?c=${c.id}`} className="chip hover:border-accent/40 hover:text-accent">{c.title}</Link>}
                  {p && <Link href={`/playbook?p=${p.id}`} className="chip border-accent/30 text-accent bg-accent/5 hover:bg-accent/10">▸ {p.name}</Link>}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
