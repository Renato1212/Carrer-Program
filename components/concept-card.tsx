"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Concept } from "@/data/types";
import { conceptById } from "@/data/concepts";
import { playbookById } from "@/data/playbooks";
import { SourceChip } from "./source-chip";
import { cn } from "@/lib/cn";

function parseDefinition(def: string): { kind: "list" | "para"; items: string[] } {
  if (def.includes("\n• ")) {
    const items = def
      .split("\n• ")
      .map((s) => s.replace(/^•\s*/, "").trim())
      .filter(Boolean);
    return { kind: "list", items };
  }
  return { kind: "para", items: [def] };
}

export function ConceptCard({
  concept,
  defaultOpen = false,
  expandable = true,
  highlightId,
}: {
  concept: Concept;
  defaultOpen?: boolean;
  expandable?: boolean;
  highlightId?: string | null;
}) {
  const [open, setOpen] = useState(defaultOpen || !expandable || highlightId === concept.id);
  const def = parseDefinition(concept.definition);

  return (
    <motion.article
      layout
      id={`concept-${concept.id}`}
      className={cn(
        "card overflow-hidden scroll-mt-24",
        highlightId === concept.id && "shadow-glow border-accent/40",
      )}
    >
      <header
        className={cn(
          "px-4 sm:px-5 py-4 flex items-start gap-3",
          expandable && "cursor-pointer select-none",
        )}
        onClick={() => expandable && setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {concept.careerProgramDay && (
              <span className="font-mono text-[10px] text-ink-subtle tracking-widish">
                CP · DAY {concept.careerProgramDay}
              </span>
            )}
            <div className="flex flex-wrap gap-1">
              {concept.sources.map((s) => (
                <SourceChip key={s} source={s} compact />
              ))}
            </div>
          </div>
          <h3 className="text-ink font-semibold text-[15px] sm:text-base tracking-tightish">
            {concept.title}
          </h3>
          <p className="text-ink-muted text-sm mt-1 leading-relaxed">{concept.essence}</p>
        </div>
        {expandable && (
          <button
            aria-label={open ? "Collapse" : "Expand"}
            className="text-ink-subtle hover:text-ink shrink-0 mt-0.5"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
          >
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </header>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="px-4 sm:px-5 pb-5 space-y-5"
        >
          <Section title="Definition">
            {def.kind === "list" ? (
              <ul className="space-y-1.5">
                {def.items.map((it, i) => (
                  <li key={i} className="flex gap-2.5 text-ink text-sm leading-relaxed">
                    <span className="text-accent shrink-0 mt-0.5">—</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink text-sm leading-relaxed">{def.items[0]}</p>
            )}
          </Section>

          {concept.visualSvg && (
            <Section title="Visual">
              <figure className="rounded-lg border border-line bg-bg overflow-hidden">
                <div
                  className="mx-auto max-w-[560px] [&_svg]:block"
                  dangerouslySetInnerHTML={{ __html: concept.visualSvg }}
                />
              </figure>
            </Section>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            <Section title="Why it matters">
              <p className="text-ink text-sm leading-relaxed">{concept.whyItMatters}</p>
            </Section>
            <Section title="How to see it live">
              <p className="text-ink text-sm leading-relaxed">{concept.howToSeeItLive}</p>
            </Section>
            <Section title="What to do">
              <p className="text-ink text-sm leading-relaxed">{concept.whatToDo}</p>
            </Section>
            <Section title="Common mistakes">
              <ul className="text-ink text-sm leading-relaxed space-y-1">
                {concept.commonMistakes.map((m, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-short shrink-0">·</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>

          {(concept.related.length > 0 || (concept.relatedPlaybooks?.length ?? 0) > 0) && (
            <Section title="Related">
              <div className="flex flex-wrap gap-1.5">
                {concept.related.map((rid) => {
                  const r = conceptById(rid);
                  if (!r) return null;
                  return (
                    <Link
                      key={rid}
                      href={`/library?c=${rid}`}
                      className="chip hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-colors"
                    >
                      {r.title}
                    </Link>
                  );
                })}
                {concept.relatedPlaybooks?.map((pid) => {
                  const p = playbookById(pid);
                  if (!p) return null;
                  return (
                    <Link
                      key={pid}
                      href={`/playbook?p=${pid}`}
                      className="chip border-accent/30 text-accent bg-accent/5 hover:bg-accent/10 transition-colors"
                    >
                      ▸ {p.name}
                    </Link>
                  );
                })}
              </div>
            </Section>
          )}
        </motion.div>
      )}
    </motion.article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="h-section mb-1.5">{title}</div>
      {children}
    </div>
  );
}
