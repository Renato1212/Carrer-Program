"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Compass,
  ClipboardList,
  Hammer,
  ListChecks,
  GitBranch,
  Notebook,
  Activity,
  Command,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { CommandPalette } from "./command-palette";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Console", icon: Activity, shortcut: "g h" },
  { href: "/library", label: "Foundation Library", icon: BookOpen, shortcut: "g l" },
  { href: "/context", label: "Context Locator", icon: Compass, shortcut: "g c" },
  { href: "/plan", label: "Daily Planning", icon: ClipboardList, shortcut: "g p" },
  { href: "/builder", label: "Trade Idea Builder", icon: Hammer, shortcut: "g b" },
  { href: "/playbook", label: "Execution Playbook", icon: ListChecks, shortcut: "g x" },
  { href: "/daytype", label: "Day Type Identifier", icon: Activity, shortcut: "g d" },
  { href: "/graph", label: "Knowledge Graph", icon: GitBranch, shortcut: "g g" },
  { href: "/journal", label: "Debrief Journal", icon: Notebook, shortcut: "g j" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const hydrate = useStore((s) => s.hydrate);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    let chord = "";
    let chordTimer: ReturnType<typeof setTimeout> | null = null;

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        chord = "g";
        if (chordTimer) clearTimeout(chordTimer);
        chordTimer = setTimeout(() => (chord = ""), 900);
        return;
      }
      if (chord === "g") {
        const map: Record<string, string> = {
          h: "/",
          l: "/library",
          c: "/context",
          p: "/plan",
          b: "/builder",
          x: "/playbook",
          d: "/daytype",
          g: "/graph",
          j: "/journal",
        };
        const to = map[e.key.toLowerCase()];
        if (to) {
          e.preventDefault();
          router.push(to);
        }
        chord = "";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-bg-elevated/60 backdrop-blur-sm no-print">
        <div className="px-4 py-5 border-b border-line">
          <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Operator</div>
          <div className="text-ink font-semibold mt-1">Auction · Order Flow</div>
          <div className="text-ink-muted text-xs mt-1">Career Program × Dalton × Axia</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-ink-muted hover:text-ink hover:bg-bg-hover border border-transparent",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{n.label}</span>
                <span className="kbd hidden lg:inline-flex">{n.shortcut}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-line text-[11px] text-ink-subtle font-mono">
          <button
            className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-line bg-bg-surface px-2 py-1.5 hover:bg-bg-hover hover:border-line-strong transition-colors"
            onClick={() => setPaletteOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5" /> search
            </span>
            <span className="kbd">⌘K</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 terminal-grid">
        <div className="mx-auto max-w-[1480px] px-6 py-6">
          {hydrated ? children : <div className="text-ink-subtle text-sm">Booting…</div>}
        </div>
      </main>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
