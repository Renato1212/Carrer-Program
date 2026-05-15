"use client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Activity, BookOpen, Compass, Hammer, Notebook, ClipboardList, ListChecks, GitBranch, ArrowUpRight } from "lucide-react";
import { concepts } from "@/data/concepts";

export default function ConsolePage() {
  const plan = useStore((s) => s.plan);
  const context = useStore((s) => s.context);
  const trades = useStore((s) => s.trades);
  const journal = useStore((s) => s.journal);

  const contextFilled = Object.values(context).filter(Boolean).length;
  const planFilled =
    (plan.inventory ? 1 : 0) +
    plan.levels.length +
    (plan.primaryScenario.thesis ? 1 : 0) +
    (plan.secondaryScenario.thesis ? 1 : 0) +
    plan.hunts.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Console</div>
          <h1 className="text-2xl font-semibold tracking-tightish mt-1">Where are we, what's the plan, what do we do?</h1>
          <p className="text-ink-muted text-sm mt-1 max-w-2xl">
            Three knowledge systems, one operating loop. Build context, plan scenarios, execute setups, debrief — every concept tagged by source and cross-linked.
          </p>
        </div>
        <div className="flex gap-2 items-center font-mono text-xs text-ink-subtle">
          <span className="kbd">⌘K</span> to search · <span className="kbd">g c</span> jumps to Context Locator
        </div>
      </header>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        <Tile
          href="/context"
          icon={Compass}
          title="Context Locator"
          status={`${contextFilled} / 10 fields`}
          description="Synthesize where we are right now — balance, inventory, value migration, open type, naked POCs."
        />
        <Tile
          href="/plan"
          icon={ClipboardList}
          title="Daily Planning"
          status={`${planFilled} elements`}
          description="Levels, inventory, scenarios, invalidations, hunt list. Printable plan card."
        />
        <Tile
          href="/builder"
          icon={Hammer}
          title="Trade Idea Builder"
          status={`${trades.length} ideas saved`}
          description="Context → bias → level → setup → confirmations → R:R-gated trade card."
        />
        <Tile
          href="/playbook"
          icon={ListChecks}
          title="Execution Playbook"
          status="12 named setups"
          description="First-touch absorption, sweep reversals, Open-Drive, naked POC magnet, IB extension, range fade, gap fill/go…"
        />
        <Tile
          href="/daytype"
          icon={Activity}
          title="Day Type Identifier"
          status="live"
          description="Update through the session. Probabilistic read on developing day type and recommended playbook."
        />
        <Tile
          href="/library"
          icon={BookOpen}
          title="Foundation Library"
          status={`${concepts.length} concepts`}
          description="Career Program × Dalton × Axia. Theory → live signature → action on every card."
        />
        <Tile
          href="/graph"
          icon={GitBranch}
          title="Knowledge Graph"
          status="interactive"
          description="Force-directed map of all concepts and their cross-links. One system, not three."
        />
        <Tile
          href="/journal"
          icon={Notebook}
          title="Debrief Journal"
          status={`${journal.length} entries`}
          description="Plan adherence, context read, day type match. Lessons stored against the relevant concept."
        />
      </div>

      <section className="card p-5">
        <div className="h-section mb-2">Today's voice</div>
        <blockquote className="text-ink text-sm leading-relaxed italic max-w-3xl">
          Absorption is the moment passive size eats aggressive flow without giving ground. At a tested level with rising aggressive volume and stalled price, you are watching size defend value. Trade in the direction of the absorption, not against it. If the level breaks anyway, the trapped aggressors fuel the move that follows.
        </blockquote>
      </section>
    </div>
  );
}

function Tile({
  href,
  icon: Icon,
  title,
  status,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  status: string;
  description: string;
}) {
  return (
    <Link href={href} className="card card-hover p-4 flex flex-col gap-3 group">
      <div className="flex items-center justify-between">
        <Icon className="w-4 h-4 text-accent" />
        <ArrowUpRight className="w-4 h-4 text-ink-subtle group-hover:text-ink transition-colors" />
      </div>
      <div>
        <div className="font-semibold text-ink tracking-tightish">{title}</div>
        <div className="font-mono text-[11px] text-ink-subtle tracking-widish uppercase mt-0.5">{status}</div>
      </div>
      <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
    </Link>
  );
}
