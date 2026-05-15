"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { SelectField, TextField } from "@/components/select-field";
import { synthesize } from "@/lib/context-engine";
import { conceptById } from "@/data/concepts";
import { playbookById } from "@/data/playbooks";
import { ArrowRight, AlertTriangle, Eye, Target } from "lucide-react";

export default function ContextPage() {
  const context = useStore((s) => s.context);
  const patch = useStore((s) => s.patchContext);

  const read = useMemo(() => synthesize(context), [context]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Context Locator</div>
          <h1 className="text-2xl font-semibold tracking-tightish mt-1">Where are we right now?</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Structured inputs only. The synthesized read tells you which timeframe is in control, the 2–3 most probable scenarios, what to look for and what to avoid.
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="card p-5 space-y-4">
            <div className="h-section">Inputs</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <SelectField
                label="3-day balance"
                value={context.balanceLocation}
                onChange={(v) => patch({ balanceLocation: v })}
                options={[
                  { value: "inside-3d", label: "Inside" },
                  { value: "edge", label: "At edge" },
                  { value: "above-3d", label: "Above balance" },
                  { value: "below-3d", label: "Below balance" },
                ]}
              />
              <SelectField
                label="Overnight inventory"
                value={context.overnightInventory}
                onChange={(v) => patch({ overnightInventory: v })}
                options={[
                  { value: "long", label: "Long" },
                  { value: "short", label: "Short" },
                  { value: "balanced", label: "Balanced" },
                ]}
              />
              <SelectField
                label="Yesterday — excess / poor"
                value={context.excessOrPoor}
                onChange={(v) => patch({ excessOrPoor: v })}
                options={[
                  { value: "excess-high", label: "Excess high" },
                  { value: "excess-low", label: "Excess low" },
                  { value: "poor-high", label: "Poor high" },
                  { value: "poor-low", label: "Poor low" },
                  { value: "clean", label: "Clean both sides" },
                  { value: "mixed", label: "Mixed" },
                ]}
              />
              <SelectField
                label="Yesterday — day type"
                value={context.yesterdayDayType}
                onChange={(v) => patch({ yesterdayDayType: v })}
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "normal-variation", label: "Normal Variation" },
                  { value: "trend", label: "Trend" },
                  { value: "double-distribution", label: "Double Distribution Trend" },
                  { value: "neutral-center", label: "Neutral — Center" },
                  { value: "neutral-extreme", label: "Neutral — Extreme" },
                ]}
              />
              <SelectField
                label="Value migration"
                value={context.valueMigration}
                onChange={(v) => patch({ valueMigration: v })}
                options={[
                  { value: "higher", label: "Higher" },
                  { value: "lower", label: "Lower" },
                  { value: "overlap-higher", label: "Overlap higher" },
                  { value: "overlap-lower", label: "Overlap lower" },
                  { value: "unchanged", label: "Unchanged" },
                ]}
              />
              <SelectField
                label="Open location"
                value={context.openLocation}
                onChange={(v) => patch({ openLocation: v })}
                options={[
                  { value: "above-vah", label: "Above VAH" },
                  { value: "inside-va", label: "Inside VA" },
                  { value: "below-val", label: "Below VAL" },
                  { value: "in-range", label: "In prior range" },
                  { value: "out-of-range-up", label: "Out of range — up" },
                  { value: "out-of-range-down", label: "Out of range — down" },
                ]}
              />
              <SelectField
                label="Open type"
                value={context.openType}
                onChange={(v) => patch({ openType: v })}
                options={[
                  { value: "drive", label: "Open-Drive" },
                  { value: "test-drive", label: "Open-Test-Drive" },
                  { value: "rejection-reverse", label: "Open-Rejection-Reverse" },
                  { value: "auction-in", label: "Open-Auction (in range)" },
                  { value: "auction-out", label: "Open-Auction (out of range)" },
                ]}
              />
              <SelectField
                label="Market posture"
                value={context.marketPosture}
                onChange={(v) => patch({ marketPosture: v })}
                options={[
                  { value: "risk-on", label: "Risk on" },
                  { value: "risk-off", label: "Risk off" },
                  { value: "mixed", label: "Mixed" },
                ]}
              />
              <TextField
                label="Naked POCs above"
                value={context.nakedPocsAbove}
                onChange={(v) => patch({ nakedPocsAbove: v })}
                placeholder="e.g., 5310.50, 5328.25"
              />
              <TextField
                label="Naked POCs below"
                value={context.nakedPocsBelow}
                onChange={(v) => patch({ nakedPocsBelow: v })}
                placeholder="e.g., 5275.75"
              />
            </div>
            <TextField
              label="Notes"
              value={context.notes}
              onChange={(v) => patch({ notes: v })}
              placeholder="Anything else worth recording…"
              multiline
            />
          </div>
        </section>

        <section className="lg:col-span-3 space-y-4">
          <div className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-section">Controlling timeframe</div>
                <div className="text-ink font-semibold text-lg tracking-tightish mt-1">
                  {read.controllingTimeframe}
                </div>
              </div>
              <Link href="/builder" className="btn btn-primary">
                Build a trade idea <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-ink-muted text-sm">{read.controlNote}</p>
          </div>

          <div className="space-y-3">
            <div className="h-section flex items-center gap-2">
              <Target className="w-3 h-3" /> Probable scenarios
            </div>
            {read.scenarios.length === 0 && (
              <div className="card p-5 text-ink-subtle text-sm">Fill more fields to generate scenarios.</div>
            )}
            {read.scenarios.map((s, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-ink-subtle tracking-widish">
                      #{i + 1}
                    </span>
                    <h3 className="text-ink font-semibold tracking-tightish">{s.label}</h3>
                  </div>
                  <Weight v={s.weight} />
                </div>
                <p className="text-ink text-sm">{s.thesis}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <div className="h-section mb-1">Triggers</div>
                    <ul className="text-sm text-ink-muted space-y-0.5">
                      {s.triggers.map((t, j) => (
                        <li key={j} className="flex gap-2"><span className="text-accent">·</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="h-section mb-1">Invalidations</div>
                    <ul className="text-sm text-ink-muted space-y-0.5">
                      {s.invalidations.map((t, j) => (
                        <li key={j} className="flex gap-2"><span className="text-short">·</span>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.conceptRefs.map((rid) => {
                    const c = conceptById(rid);
                    if (!c) return null;
                    return (
                      <Link key={rid} href={`/library?c=${rid}`} className="chip hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors">
                        {c.title}
                      </Link>
                    );
                  })}
                  {s.playbookRefs.map((pid) => {
                    const p = playbookById(pid);
                    if (!p) return null;
                    return (
                      <Link key={pid} href={`/playbook?p=${pid}`} className="chip border-accent/30 text-accent bg-accent/5 hover:bg-accent/10">
                        ▸ {p.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="card p-5">
              <div className="h-section flex items-center gap-2 mb-2">
                <Eye className="w-3 h-3" /> Look for
              </div>
              <ul className="text-sm text-ink space-y-1.5">
                {read.lookFor.map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-long">→</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <div className="h-section flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3 h-3" /> Avoid
              </div>
              <ul className="text-sm text-ink space-y-1.5">
                {read.avoid.map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="text-short">×</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Weight({ v }: { v: number }) {
  const pct = Math.round(v * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-bg-surface rounded overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[11px] text-ink-muted tabular-nums">{pct}%</span>
    </div>
  );
}
