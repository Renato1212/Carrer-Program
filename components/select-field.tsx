"use client";
import { cn } from "@/lib/cn";

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = "—",
  hint,
}: {
  label: string;
  value: T | "";
  onChange: (v: T | "") => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      {label && <div className="h-section mb-1.5">{label}</div>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T | "")}
          className={cn("select")}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle text-xs">▾</span>
      </div>
      {hint && <div className="text-[11px] text-ink-subtle mt-1">{hint}</div>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <div className="h-section mb-1.5">{label}</div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="input font-sans"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input"
        />
      )}
      {hint && <div className="text-[11px] text-ink-subtle mt-1">{hint}</div>}
    </label>
  );
}
