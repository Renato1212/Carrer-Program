"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { SelectField, TextField } from "@/components/select-field";
import { playbooks } from "@/data/playbooks";
import type { Level, Scenario } from "@/data/types";
import { Plus, Trash2, Printer } from "lucide-react";
import { cn } from "@/lib/cn";

const LEVEL_KINDS: { value: Level["kind"]; label: string }[] = [
  { value: "prior-high", label: "Prior day H" },
  { value: "prior-low", label: "Prior day L" },
  { value: "settlement", label: "Settlement" },
  { value: "onh", label: "ONH" },
  { value: "onl", label: "ONL" },
  { value: "ib-high", label: "IB high" },
  { value: "ib-low", label: "IB low" },
  { value: "poc", label: "POC" },
  { value: "vah", label: "VAH" },
  { value: "val", label: "VAL" },
  { value: "naked-poc", label: "Naked POC" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

export default function PlanPage() {
  const plan = useStore((s) => s.plan);
  const patch = useStore((s) => s.patchPlan);
  const addLevel = useStore((s) => s.addLevel);
  const removeLevel = useStore((s) => s.removeLevel);
  const setScenario = useStore((s) => s.setScenario);
  const toggleHunt = useStore((s) => s.toggleHunt);

  const [newLevel, setNewLevel] = useState<Level>({ kind: "prior-high", label: "Prior day H", price: "" });

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-end justify-between flex-wrap gap-3 no-print">
        <div>
          <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Daily Planning</div>
          <h1 className="text-2xl font-semibold tracking-tightish mt-1">Plan first, trade second.</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Levels, inventory, scenarios, invalidations, hunt list. Saved locally. Printable.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={() => window.print()}>
            <Printer className="w-3.5 h-3.5" /> Print plan
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-section">Step 1 — Levels</div>
              <div className="font-mono text-[11px] text-ink-subtle">{plan.levels.length} mapped</div>
            </div>
            <div className="space-y-2 mb-4">
              {plan.levels.map((l, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-line bg-bg-surface px-3 py-2">
                  <span className="font-mono text-[11px] text-ink-subtle w-24 uppercase">{labelForKind(l.kind)}</span>
                  <span className="font-mono text-ink-muted flex-1 truncate">{l.label}</span>
                  <span className="font-mono text-ink tabular-nums">{l.price}</span>
                  <button onClick={() => removeLevel(i)} className="text-ink-subtle hover:text-short">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {plan.levels.length === 0 && <div className="text-sm text-ink-subtle">No levels yet.</div>}
            </div>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-4">
                <select
                  className="select"
                  value={newLevel.kind}
                  onChange={(e) => {
                    const kind = e.target.value as Level["kind"];
                    const def = LEVEL_KINDS.find((k) => k.value === kind);
                    setNewLevel({ ...newLevel, kind, label: def?.label ?? "" });
                  }}
                >
                  {LEVEL_KINDS.map((k) => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
              </div>
              <input
                className="input col-span-5"
                placeholder="label / context"
                value={newLevel.label}
                onChange={(e) => setNewLevel({ ...newLevel, label: e.target.value })}
              />
              <input
                className="input col-span-2 font-mono tabular-nums"
                placeholder="price"
                value={newLevel.price}
                onChange={(e) => setNewLevel({ ...newLevel, price: e.target.value })}
              />
              <button
                className="btn btn-primary col-span-1 justify-center"
                onClick={() => {
                  if (newLevel.price.trim()) {
                    addLevel(newLevel);
                    setNewLevel({ ...newLevel, price: "" });
                  }
                }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="card p-5">
            <div className="h-section mb-3">Step 2 — Overnight Inventory</div>
            <SelectField
              label="Inventory state"
              value={plan.inventory}
              onChange={(v) => patch({ inventory: v })}
              options={[
                { value: "long", label: "Long" },
                { value: "short", label: "Short" },
                { value: "balanced", label: "Balanced" },
              ]}
            />
          </div>

          <div className="card p-5">
            <div className="h-section mb-3">Step 5 — Hunt list</div>
            <p className="text-ink-muted text-sm mb-3">Setups you are hunting today. The rest are background.</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {playbooks.map((p) => {
                const on = plan.hunts.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleHunt(p.id)}
                    className={cn(
                      "text-left rounded-md border px-3 py-2 text-sm transition-colors",
                      on
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-line bg-bg-surface text-ink-muted hover:bg-bg-hover hover:text-ink",
                    )}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <ScenarioCard
            title="Step 3 — Primary scenario"
            value={plan.primaryScenario}
            onChange={(s) => setScenario("primaryScenario", s)}
          />
          <ScenarioCard
            title="Step 3 — Secondary scenario"
            value={plan.secondaryScenario}
            onChange={(s) => setScenario("secondaryScenario", s)}
          />
          <div className="card p-5">
            <div className="h-section mb-3">Step 4 — Pre-stop invalidations</div>
            <TextField
              label="Notes — time-based, behavior-based"
              value={plan.notes}
              onChange={(v) => patch({ notes: v })}
              multiline
              placeholder="e.g., If no IB extension by 11:00 ET, scenario A is dead. If first pullback fails with absorption, abort continuation."
            />
          </div>
        </section>
      </div>

      <section className="card p-6 print:p-0">
        <div className="h-section mb-3">Plan card — {plan.date}</div>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="h-section mb-1">Inventory</div>
            <div className="text-ink font-mono uppercase">{plan.inventory || "—"}</div>
            <div className="h-section mt-4 mb-1">Levels</div>
            <ul className="space-y-1 font-mono text-xs">
              {plan.levels.map((l, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-ink-muted uppercase w-20">{labelForKind(l.kind)}</span>
                  <span className="text-ink-muted truncate flex-1">{l.label}</span>
                  <span className="text-ink tabular-nums">{l.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="h-section mb-1">Primary scenario</div>
            <ScenarioReadout s={plan.primaryScenario} />
          </div>
          <div>
            <div className="h-section mb-1">Secondary scenario</div>
            <ScenarioReadout s={plan.secondaryScenario} />
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="h-section mb-1">Hunts</div>
            <div className="flex flex-wrap gap-1.5">
              {plan.hunts.length === 0 && <span className="text-ink-subtle">No setups marked.</span>}
              {plan.hunts.map((id) => {
                const p = playbooks.find((x) => x.id === id);
                return p ? <span key={id} className="chip">{p.name}</span> : null;
              })}
            </div>
          </div>
          <div>
            <div className="h-section mb-1">Invalidations</div>
            <p className="text-ink whitespace-pre-line">{plan.notes || "—"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScenarioCard({
  title,
  value,
  onChange,
}: {
  title: string;
  value: Scenario;
  onChange: (s: Scenario) => void;
}) {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-section">{title}</div>
        <SelectField
          label=""
          value={value.bias}
          onChange={(v) => onChange({ ...value, bias: (v || "long") as Scenario["bias"] })}
          options={[
            { value: "long", label: "Long" },
            { value: "short", label: "Short" },
            { value: "two-sided", label: "Two-sided" },
          ]}
        />
      </div>
      <TextField
        label="Thesis"
        value={value.thesis}
        onChange={(v) => onChange({ ...value, thesis: v })}
        placeholder="One-sentence read."
        multiline
      />
      <div className="grid sm:grid-cols-2 gap-3">
        <TextField
          label="Trigger level"
          value={value.triggerLevel}
          onChange={(v) => onChange({ ...value, triggerLevel: v })}
          placeholder="e.g., prior VAH 5310.50"
        />
        <TextField
          label="Targets"
          value={value.targets}
          onChange={(v) => onChange({ ...value, targets: v })}
          placeholder="POC, opposite VA, naked POC…"
        />
      </div>
      <TextField
        label="Order-flow triggers"
        value={value.orderFlowTriggers}
        onChange={(v) => onChange({ ...value, orderFlowTriggers: v })}
        placeholder="Absorption + CVD slope + footprint imbalance"
      />
      <TextField
        label="Invalidation"
        value={value.invalidation}
        onChange={(v) => onChange({ ...value, invalidation: v })}
        placeholder="What would kill this before the stop hits?"
      />
    </div>
  );
}

function ScenarioReadout({ s }: { s: Scenario }) {
  if (!s.thesis) return <span className="text-ink-subtle">—</span>;
  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 items-center">
        <span className={cn("chip", s.bias === "long" ? "border-long/40 text-long bg-long/5" : s.bias === "short" ? "border-short/40 text-short bg-short/5" : "")}>
          {s.bias.toUpperCase()}
        </span>
        <span className="text-ink-muted font-mono text-xs">{s.triggerLevel}</span>
      </div>
      <p className="text-ink">{s.thesis}</p>
      <div className="text-ink-muted text-xs">→ targets: {s.targets || "—"}</div>
      <div className="text-ink-muted text-xs">⚑ flow: {s.orderFlowTriggers || "—"}</div>
      <div className="text-ink-muted text-xs">× invalidation: {s.invalidation || "—"}</div>
    </div>
  );
}

function labelForKind(kind: Level["kind"]): string {
  return LEVEL_KINDS.find((k) => k.value === kind)?.label ?? kind;
}
