"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { concepts } from "@/data/concepts";
import { ConceptCard } from "@/components/concept-card";
import type { Source } from "@/data/types";
import { cn } from "@/lib/cn";

type Filter = "all" | "career-program" | "dalton" | "axia";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "career-program", label: "Career Program" },
  { key: "dalton", label: "Dalton" },
  { key: "axia", label: "Axia" },
];

export default function LibraryPage() {
  const sp = useSearchParams();
  const focused = sp.get("c");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (focused) {
      const el = document.getElementById(`concept-${focused}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [focused]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return concepts.filter((c) => {
      if (filter !== "all" && !c.sources.includes(filter as Source)) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.essence.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q))
      );
    });
  }, [filter, query]);

  const careerDays = filtered.filter((c) => c.careerProgramDay);
  const daltonCards = filtered.filter((c) => !c.careerProgramDay && c.sources.includes("dalton"));
  const axiaCards = filtered.filter((c) => !c.careerProgramDay && c.sources.includes("axia") && !c.sources.includes("dalton"));

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Foundation Library</div>
          <h1 className="text-2xl font-semibold tracking-tightish mt-1">Concepts as operating instructions</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Career Program is the spine. Dalton and Axia thread through every card. Every concept answers four
            questions: what is it, why does it matter, how do I see it live, what do I do?
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter concepts…"
            className="input max-w-xs"
          />
          <div className="flex border border-line rounded-md overflow-hidden">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium border-r border-line last:border-r-0 transition-colors",
                  filter === f.key
                    ? "bg-accent/10 text-accent"
                    : "bg-bg-surface text-ink-muted hover:bg-bg-hover hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {careerDays.length > 0 && (
        <Section title="Career Program — Days 1–6" subtitle="Your first-principles foundation, verbatim.">
          <div className="space-y-3">
            {careerDays
              .sort((a, b) => (a.careerProgramDay ?? 0) - (b.careerProgramDay ?? 0))
              .map((c) => (
                <ConceptCard key={c.id} concept={c} highlightId={focused} defaultOpen={!!focused && focused === c.id} />
              ))}
          </div>
        </Section>
      )}

      {daltonCards.length > 0 && (
        <Section title="Dalton — Auction Market Theory" subtitle="From Mind Over Markets and Markets in Profile.">
          <div className="space-y-3">
            {daltonCards.map((c) => (
              <ConceptCard key={c.id} concept={c} highlightId={focused} defaultOpen={!!focused && focused === c.id} />
            ))}
          </div>
        </Section>
      )}

      {axiaCards.length > 0 && (
        <Section title="Axia — Execution Frameworks" subtitle="Tape, DOM, footprint, CVD, absorption, traps, risk, process.">
          <div className="space-y-3">
            {axiaCards.map((c) => (
              <ConceptCard key={c.id} concept={c} highlightId={focused} defaultOpen={!!focused && focused === c.id} />
            ))}
          </div>
        </Section>
      )}

      {filtered.length === 0 && (
        <div className="card p-8 text-center text-ink-subtle">No concepts match this filter.</div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tightish">{title}</h2>
        {subtitle && <p className="text-ink-muted text-sm">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
