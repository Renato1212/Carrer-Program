"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { playbooks } from "@/data/playbooks";
import { conceptById } from "@/data/concepts";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

export default function PlaybookPage() {
  return (
    <Suspense fallback={<div className="text-ink-subtle text-sm">Loading playbook…</div>}>
      <PlaybookInner />
    </Suspense>
  );
}

function PlaybookInner() {
  const sp = useSearchParams();
  const focus = sp.get("p");
  const [active, setActive] = useState<string>(focus ?? playbooks[0].id);

  useEffect(() => {
    if (focus) setActive(focus);
  }, [focus]);

  const p = playbooks.find((x) => x.id === active) ?? playbooks[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Execution Playbook</div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tightish mt-1">Named setups. Required context. Hard invalidations.</h1>
        <p className="text-ink-muted text-sm mt-1 max-w-2xl">
          No setup ships without explicit required context and what would kill the trade before the stop. Hunt only what fits today.
        </p>
      </header>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="card overflow-hidden">
            {playbooks.map((pb) => (
              <button
                key={pb.id}
                onClick={() => setActive(pb.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm border-b border-line last:border-b-0 transition-colors",
                  pb.id === active
                    ? "bg-accent/10 text-accent"
                    : "text-ink-muted hover:bg-bg-hover hover:text-ink",
                )}
              >
                {pb.name}
              </button>
            ))}
          </div>
        </aside>
        <motion.section
          key={p.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-3 space-y-4"
        >
          <div className="card p-6">
            <h2 className="text-xl font-semibold tracking-tightish">{p.name}</h2>
            <p className="text-ink-muted text-sm mt-1">{p.requiredContext}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field title="Trigger" body={p.trigger} />
            <Field title="Entry" body={p.entry} />
            <Field title="Stop" body={p.stop} />
            <Field title="Targets" body={p.targets} />
            <Field title="Management" body={p.management} />
            <List title="Confirmations" items={p.confirmations} positive />
            <List title="Pre-stop invalidations" items={p.invalidations} />
            <List title="Traps" items={p.traps} />
          </div>

          {p.relatedConcepts.length > 0 && (
            <div className="card p-5">
              <div className="h-section mb-2">Related concepts</div>
              <div className="flex flex-wrap gap-1.5">
                {p.relatedConcepts.map((rid) => {
                  const c = conceptById(rid);
                  if (!c) return null;
                  return (
                    <Link key={rid} href={`/library?c=${rid}`} className="chip hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors">
                      {c.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function Field({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-5">
      <div className="h-section mb-2">{title}</div>
      <p className="text-ink text-sm leading-relaxed">{body}</p>
    </div>
  );
}
function List({ title, items, positive }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className="card p-5">
      <div className="h-section mb-2">{title}</div>
      <ul className="text-ink text-sm space-y-1.5">
        {items.map((x, i) => (
          <li key={i} className="flex gap-2">
            <span className={positive ? "text-long" : "text-short"}>{positive ? "→" : "×"}</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
