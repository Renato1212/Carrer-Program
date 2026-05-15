"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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
  Menu,
  X,
  Search,
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

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV.map((n) => {
        const Icon = n.icon;
        const active = pathname === n.href;
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
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
    </>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hydrate = useStore((s) => s.hydrate);
  const hydrated = useStore((s) => s.hydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
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
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-bg-elevated/60 backdrop-blur-sm no-print sticky top-0 h-screen">
        <div className="px-4 py-5 border-b border-line">
          <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Operator</div>
          <div className="text-ink font-semibold mt-1">Auction · Order Flow</div>
          <div className="text-ink-muted text-xs mt-1">Career Program × Dalton × Axia</div>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="px-3 py-3 border-t border-line">
          <button
            className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-line bg-bg-surface px-2 py-1.5 text-[11px] font-mono text-ink-subtle hover:bg-bg-hover hover:border-line-strong transition-colors"
            onClick={() => setPaletteOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5" /> search
            </span>
            <span className="kbd">⌘K</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-3 h-14 px-4 border-b border-line bg-bg-elevated/95 backdrop-blur-md no-print">
        <button
          aria-label="Open menu"
          className="text-ink p-1.5 -ml-1.5"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-ink font-semibold text-sm truncate">Operator</div>
          <div className="font-mono text-[10px] tracking-widish text-ink-subtle uppercase truncate">
            Auction · Order Flow
          </div>
        </div>
        <button
          aria-label="Search"
          className="text-ink p-1.5 -mr-1.5"
          onClick={() => setPaletteOpen(true)}
        >
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm no-print"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[78%] max-w-[300px] flex flex-col border-r border-line bg-bg-elevated no-print"
            >
              <div className="px-4 py-4 border-b border-line flex items-center justify-between">
                <div>
                  <div className="text-ink font-semibold">Operator</div>
                  <div className="text-ink-muted text-xs mt-0.5">Career Program × Dalton × Axia</div>
                </div>
                <button aria-label="Close menu" className="text-ink-subtle p-1" onClick={() => setDrawerOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                <NavLinks onNavigate={() => setDrawerOpen(false)} />
              </nav>
              <div className="px-3 py-3 border-t border-line">
                <button
                  className="w-full inline-flex items-center justify-between gap-2 rounded-md border border-line bg-bg-surface px-2.5 py-2 text-sm text-ink-muted"
                  onClick={() => {
                    setDrawerOpen(false);
                    setPaletteOpen(true);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Command className="w-4 h-4" /> Search
                  </span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 min-w-0 terminal-grid">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 py-5 sm:py-6 pt-[4.75rem] md:pt-6">
          {hydrated ? children : <div className="text-ink-subtle text-sm">Booting…</div>}
        </div>
      </main>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
