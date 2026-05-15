"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { SelectField, TextField } from "@/components/select-field";
import { concepts } from "@/data/concepts";
import { Plus, Trash2 } from "lucide-react";
import type { JournalEntry } from "@/data/types";
import Link from "next/link";

const today = () => new Date().toISOString().slice(0, 10);

export default function JournalPage() {
  const entries = useStore((s) => s.journal);
  const add = useStore((s) => s.addJournal);
  const remove = useStore((s) => s.removeJournal);

  const [draft, setDraft] = useState<JournalEntry>({
    id: "",
    date: today(),
    followedPlan: "",
    contextRead: "",
    dayTypeMatched: "",
    mostRelevantConceptId: "",
    lessons: [],
    freeText: "",
  });

  function commit() {
    const id = `j_${Date.now()}`;
    add({ ...draft, id });
    setDraft({
      id: "",
      date: today(),
      followedPlan: "",
      contextRead: "",
      dayTypeMatched: "",
      mostRelevantConceptId: "",
      lessons: [],
      freeText: "",
    });
  }

  const lessonsByConcept = new Map<string, { entryDate: string; lesson: string }[]>();
  entries.forEach((e) => {
    e.lessons.forEach((l) => {
      if (!l.conceptId || !l.lesson) return;
      if (!lessonsByConcept.has(l.conceptId)) lessonsByConcept.set(l.conceptId, []);
      lessonsByConcept.get(l.conceptId)!.push({ entryDate: e.date, lesson: l.lesson });
    });
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="font-mono text-[11px] tracking-widish text-ink-subtle uppercase">Debrief Journal</div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tightish mt-1">Review against the plan. Store lessons against the concept.</h1>
        <p className="text-ink-muted text-sm mt-1 max-w-2xl">
          Lessons stored against the relevant concept accumulate over time — each foundation card builds its own private experience archive.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card p-5 space-y-4">
          <div className="h-section">New debrief — {draft.date}</div>
          <div className="grid sm:grid-cols-3 gap-3">
            <SelectField
              label="Followed the plan?"
              value={draft.followedPlan}
              onChange={(v) => setDraft({ ...draft, followedPlan: v as JournalEntry["followedPlan"] })}
              options={[
                { value: "yes", label: "Yes" },
                { value: "partial", label: "Partial" },
                { value: "no", label: "No" },
              ]}
            />
            <SelectField
              label="Context read"
              value={draft.contextRead}
              onChange={(v) => setDraft({ ...draft, contextRead: v as JournalEntry["contextRead"] })}
              options={[
                { value: "correct", label: "Correct" },
                { value: "partial", label: "Partial" },
                { value: "wrong", label: "Wrong" },
              ]}
            />
            <SelectField
              label="Day type matched?"
              value={draft.dayTypeMatched}
              onChange={(v) => setDraft({ ...draft, dayTypeMatched: v as JournalEntry["dayTypeMatched"] })}
              options={[
                { value: "yes", label: "Yes" },
                { value: "partial", label: "Partial" },
                { value: "no", label: "No" },
              ]}
            />
          </div>
          <SelectField
            label="Most relevant concept today"
            value={draft.mostRelevantConceptId}
            onChange={(v) => setDraft({ ...draft, mostRelevantConceptId: v ?? "" })}
            options={concepts.map((c) => ({ value: c.id, label: c.title }))}
          />

          <div>
            <div className="h-section mb-2">Lessons (linked to a concept)</div>
            <div className="space-y-2">
              {draft.lessons.map((l, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                  <select
                    className="select sm:col-span-5"
                    value={l.conceptId}
                    onChange={(e) => {
                      const next = [...draft.lessons];
                      next[i] = { ...next[i], conceptId: e.target.value };
                      setDraft({ ...draft, lessons: next });
                    }}
                  >
                    <option value="">— concept —</option>
                    {concepts.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <input
                    className="input sm:col-span-6"
                    placeholder="lesson…"
                    value={l.lesson}
                    onChange={(e) => {
                      const next = [...draft.lessons];
                      next[i] = { ...next[i], lesson: e.target.value };
                      setDraft({ ...draft, lessons: next });
                    }}
                  />
                  <button
                    aria-label="Remove lesson"
                    onClick={() => setDraft({ ...draft, lessons: draft.lessons.filter((_, j) => j !== i) })}
                    className="text-ink-subtle hover:text-short sm:col-span-1 justify-self-start sm:justify-self-center sm:mt-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDraft({ ...draft, lessons: [...draft.lessons, { conceptId: "", lesson: "" }] })}
              className="btn mt-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add lesson
            </button>
          </div>

          <TextField
            label="Free text"
            value={draft.freeText}
            onChange={(v) => setDraft({ ...draft, freeText: v })}
            multiline
            placeholder="What happened. What you'd do differently. What you nailed."
          />

          <button className="btn btn-primary" onClick={commit}>
            Save debrief
          </button>
        </section>

        <section className="space-y-3">
          <div className="h-section">Recent entries</div>
          {entries.length === 0 && <div className="card p-5 text-ink-subtle text-sm">No entries yet.</div>}
          {entries.slice(0, 8).map((e) => (
            <div key={e.id} className="card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-mono text-sm text-ink">{e.date}</div>
                <button onClick={() => remove(e.id)} className="text-ink-subtle hover:text-short">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {e.followedPlan && <span className="chip">plan: {e.followedPlan}</span>}
                {e.contextRead && <span className="chip">context: {e.contextRead}</span>}
                {e.dayTypeMatched && <span className="chip">day type: {e.dayTypeMatched}</span>}
              </div>
              {e.lessons.filter((l) => l.lesson).length > 0 && (
                <ul className="text-sm text-ink space-y-1">
                  {e.lessons
                    .filter((l) => l.lesson)
                    .map((l, i) => {
                      const c = concepts.find((x) => x.id === l.conceptId);
                      return (
                        <li key={i} className="flex gap-2">
                          <span className="text-accent">·</span>
                          <span>
                            {l.lesson}
                            {c && (
                              <Link href={`/library?c=${c.id}`} className="ml-2 chip">
                                {c.title}
                              </Link>
                            )}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              )}
              {e.freeText && <p className="text-ink-muted text-sm whitespace-pre-line">{e.freeText}</p>}
            </div>
          ))}
        </section>
      </div>

      {lessonsByConcept.size > 0 && (
        <section className="space-y-3">
          <div className="h-section">Lessons accumulated by concept</div>
          <div className="grid md:grid-cols-2 gap-3">
            {Array.from(lessonsByConcept.entries()).map(([cid, lessons]) => {
              const c = concepts.find((x) => x.id === cid);
              if (!c) return null;
              return (
                <div key={cid} className="card p-4">
                  <Link href={`/library?c=${c.id}`} className="text-ink font-semibold hover:text-accent">{c.title}</Link>
                  <ul className="mt-2 space-y-1 text-sm">
                    {lessons.map((l, i) => (
                      <li key={i} className="text-ink">
                        <span className="font-mono text-[11px] text-ink-subtle mr-2">{l.entryDate}</span>
                        {l.lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
