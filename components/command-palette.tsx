"use client";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { concepts } from "@/data/concepts";
import { playbooks } from "@/data/playbooks";

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onOpenChange]);

  if (!open) return null;

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/60 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <Command
        className="w-full max-w-xl rounded-lg border border-line bg-bg-elevated shadow-glow overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        label="Command palette"
      >
        <Command.Input
          placeholder="Search concepts, playbooks, modules…"
          className="w-full bg-transparent border-b border-line px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          autoFocus
        />
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="px-3 py-6 text-center text-sm text-ink-subtle">No results.</Command.Empty>

          <Command.Group heading="Modules" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-widish [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-ink-subtle">
            {[
              ["/", "Console"],
              ["/library", "Foundation Library"],
              ["/context", "Context Locator"],
              ["/plan", "Daily Planning"],
              ["/builder", "Trade Idea Builder"],
              ["/playbook", "Execution Playbook"],
              ["/daytype", "Day Type Identifier"],
              ["/graph", "Knowledge Graph"],
              ["/journal", "Debrief Journal"],
            ].map(([href, label]) => (
              <Command.Item
                key={href}
                value={`module ${label}`}
                onSelect={() => go(href)}
                className="px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent/10 aria-selected:text-accent"
              >
                {label}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Concepts" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-widish [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-ink-subtle">
            {concepts.map((c) => (
              <Command.Item
                key={c.id}
                value={`concept ${c.title} ${c.tags.join(" ")} ${c.sources.join(" ")}`}
                onSelect={() => go(`/library?c=${c.id}`)}
                className="px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent/10 aria-selected:text-accent flex items-center gap-2"
              >
                <span className="flex-1 truncate">{c.title}</span>
                <span className="flex gap-1">
                  {c.sources.includes("career-program") && <span className="chip chip-career">CP</span>}
                  {c.sources.includes("dalton") && <span className="chip chip-dalton">Dalton</span>}
                  {c.sources.includes("axia") && <span className="chip chip-axia">Axia</span>}
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Playbooks" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-widish [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-ink-subtle">
            {playbooks.map((p) => (
              <Command.Item
                key={p.id}
                value={`playbook ${p.name}`}
                onSelect={() => go(`/playbook?p=${p.id}`)}
                className="px-3 py-2 rounded-md text-sm cursor-pointer aria-selected:bg-accent/10 aria-selected:text-accent"
              >
                {p.name}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
