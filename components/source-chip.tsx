import type { Source } from "@/data/types";
import { cn } from "@/lib/cn";

const LABELS: Record<Source, string> = {
  "career-program": "Career Program",
  dalton: "Dalton",
  axia: "Axia",
};

export function SourceChip({ source, compact = false }: { source: Source; compact?: boolean }) {
  return (
    <span
      className={cn(
        "chip",
        source === "career-program" && "chip-career",
        source === "dalton" && "chip-dalton",
        source === "axia" && "chip-axia",
      )}
    >
      {compact ? LABELS[source].split(" ")[0] : LABELS[source]}
    </span>
  );
}
