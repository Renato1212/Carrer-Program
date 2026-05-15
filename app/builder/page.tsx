"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { synthesize } from "@/lib/context-engine";
import { playbooks } from "@/data/playbooks";
import { SelectField, TextField } from "@/components/select-field";
import type { TradeIdea } from "@/data/types";
import { Save, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

const CONFIRMATIONS = [
  "Absorption at level",
  "CVD slope agrees",
  "CVD divergence at extreme",
  "Footprint imbalance with size",
  "DOM refills in defense direction",
  "Stop run / sweep + reversal",
  "Tape acceleration in trade direction",
  "Trapped traders identified",
];

export default function BuilderPage() {
  const ctx = useStore((s) => s.context);
  const trades = useStore((s) => s.trades);
  const addTrade = useStore((s) => s.addTrade);
  const removeTrade = useStore((s) => s.removeTrade);

  const read = useMemo(() => synthesize(ctx), [ctx]);
  const dominant = read.scenarios[0];

  const [bias, setBias] = useState<TradeIdea["bias"]>("long");
  const [level, setLevel] = useState("");
  const [setupId, setSetupId] = useState(playbooks[0].id);
  const setupTouched = useRef(false);

  // Auto-select the context-suggested setup once context hydrates,
  // until the user makes an explicit choice.
  useEffect(() => {
    if (setupTouched.current) return;
    const suggested = dominant?.playbookRefs?.[0];
    if (suggested && suggested !== setupId) setSetupId(suggested);
  }, [dominant, setupId]);
  const [conf, setConf] = useState<string[]>([]);
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");
  const [sizeR, setSizeR] = useState(0.5);
  const [invalidations, setInvalidations] = useState("");
  const [notes, setNotes] = useState("");

  const r = useMemo(() => {
    const e = Number(entry);
    const s = Number(stop);
    const t = Number(target);
    if (!e || !s || !t || e === s) return 0;
    const risk = Math.abs(e - s);
    const reward = Math.abs(t - e);
    return Math.round((reward / risk) * 10) / 10;
  }, [entry, stop, target]);

  const accepted = r >= 2 && conf.length >= 2 && entry && stop && target;
  const setup = playbooks.find((p) => p.id === setupId);

  function save() {
    if (!accepted) return;
    const idea: TradeIdea = {
      id: `t_${Date.now()}`,
      createdAt: Date.now(),
      contextSummary: dominant ? `${dominant.label} — ${dominant.thesis}` : read.controlNote,
      bias,
      level,
      setupId,
      confirmations: conf,
      entry,
      stop,
      target,
      rMultiple: r,
      invalidations,
      sizeR,
      status: "armed",
      notes,
    };
    addTrade(idea);
    setLevel("");
    setEntry("");
    setStop("");
    setTarget("");
    setConf([]);
    setInvalidations("");
    setNotes("");
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Trade Idea Builder</div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tightish mt-1">Asymmetry is the only condition that matters.</h1>
        <p className="text-ink-muted text-sm mt-1 max-w-2xl">
          Funnel from context → bias → level → setup → confirmations → R:R. Trades below 2R are rejected unless flagged exception.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="h-section mb-2">1 · Context (auto)</div>
            <p className="text-ink text-sm leading-relaxed">{read.controlNote}</p>
            {dominant && (
              <div className="mt-2 text-sm">
                <span className="chip mr-2">primary</span>
                <span className="text-ink">{dominant.label}</span>
                <span className="text-ink-muted"> — {dominant.thesis}</span>
              </div>
            )}
          </div>

          <div className="card p-5 grid sm:grid-cols-2 gap-3">
            <SelectField
              label="2 · Directional bias"
              value={bias}
              onChange={(v) => setBias((v || "long") as TradeIdea["bias"])}
              options={[
                { value: "long", label: "Long" },
                { value: "short", label: "Short" },
                { value: "two-sided", label: "Two-sided" },
              ]}
            />
            <TextField
              label="3 · Specific level"
              value={level}
              onChange={setLevel}
              placeholder="e.g., prior VAH 5310.50 / naked POC 5275.75"
            />
            <SelectField
              label="4 · Setup"
              value={setupId}
              onChange={(v) => {
                setupTouched.current = true;
                setSetupId(v || playbooks[0].id);
              }}
              options={playbooks.map((p) => ({ value: p.id, label: p.name }))}
            />
            <div>
              <div className="h-section mb-1.5">Required by setup</div>
              <div className="text-ink-muted text-xs leading-relaxed">{setup?.requiredContext}</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="h-section mb-2">5 · Required confirmations</div>
            <p className="text-ink-muted text-sm mb-3">Select at least two before arming.</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {CONFIRMATIONS.map((c) => {
                const on = conf.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => setConf(on ? conf.filter((x) => x !== c) : [...conf, c])}
                    className={cn(
                      "text-left rounded-md border px-3 py-2 text-sm transition-colors",
                      on
                        ? "border-long/40 bg-long/5 text-long"
                        : "border-line bg-bg-surface text-ink-muted hover:bg-bg-hover hover:text-ink",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-5 grid sm:grid-cols-3 gap-3">
            <TextField label="Entry" value={entry} onChange={setEntry} placeholder="5310.50" />
            <TextField label="Stop" value={stop} onChange={setStop} placeholder="5313.75" />
            <TextField label="Target" value={target} onChange={setTarget} placeholder="5302.00" />
            <div className="sm:col-span-3 flex items-center gap-4 pt-1">
              <div>
                <div className="h-section mb-1">R:R</div>
                <div className={cn("font-mono text-xl tabular-nums", r >= 2 ? "text-long" : "text-short")}>
                  {r ? `${r}R` : "—"}
                </div>
              </div>
              <div className="flex-1">
                <label className="block">
                  <div className="h-section mb-1">Size (R per trade)</div>
                  <input
                    type="range"
                    min={0.25}
                    max={2}
                    step={0.25}
                    value={sizeR}
                    onChange={(e) => setSizeR(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="font-mono text-sm text-ink mt-1">{sizeR}R risked</div>
                </label>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <TextField
              label="6 · Pre-stop invalidations"
              value={invalidations}
              onChange={setInvalidations}
              placeholder="Time stop, behavior stop, scenario killer."
              multiline
            />
          </div>

          <div className="card p-5 flex items-center justify-between gap-3">
            {accepted ? (
              <div className="flex items-center gap-2 text-long text-sm">
                <CheckCircle2 className="w-4 h-4" /> Asymmetry confirmed — trade card armed.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-short text-sm">
                <AlertTriangle className="w-4 h-4" /> Not armed: needs ≥ 2R, ≥ 2 confirmations, and entry/stop/target.
              </div>
            )}
            <button onClick={save} disabled={!accepted} className={cn("btn btn-primary", !accepted && "opacity-40 pointer-events-none")}>
              <Save className="w-3.5 h-3.5" /> Save trade card
            </button>
          </div>
        </section>

        <aside className="space-y-3">
          <div className="h-section">Saved ideas</div>
          {trades.length === 0 && <div className="card p-5 text-ink-subtle text-sm">None yet.</div>}
          {trades.map((t) => (
            <div key={t.id} className="card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn("chip", t.bias === "long" ? "border-long/40 text-long" : "border-short/40 text-short")}>
                  {t.bias.toUpperCase()}
                </span>
                <button onClick={() => removeTrade(t.id)} className="text-ink-subtle hover:text-short">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-ink font-medium text-sm">{playbooks.find((p) => p.id === t.setupId)?.name}</div>
              <div className="text-ink-muted text-xs">{t.level}</div>
              <div className="font-mono text-xs tabular-nums text-ink-muted">
                E {t.entry} · S {t.stop} · T {t.target} · <span className="text-long">{t.rMultiple}R</span> · {t.sizeR}R risked
              </div>
              <div className="flex flex-wrap gap-1">
                {t.confirmations.map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
