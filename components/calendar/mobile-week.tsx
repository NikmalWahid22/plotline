"use client";

import Link from "next/link";
import { useState } from "react";
import { PlatformChip } from "@/components/ideas/platform-chip";
import { Icon } from "@/components/primitives/icon";
import { dayInfo } from "@/lib/dates";
import type { CalendarIdea } from "@/lib/calendar";
import { STATUSES } from "@/lib/ideas";

// Tampilan kalender untuk HP: strip 7 hari, lalu daftar ide untuk hari yang dipilih.
// Di layar sentuh seret-lepas tidak bisa diandalkan, jadi menjadwalkan lewat ketuk.
export function MobileWeek({
  days,
  today,
  ideas,
  backlog,
  onSchedule,
}: {
  days: string[];
  today: string;
  ideas: CalendarIdea[]; // sudah terfilter platform
  backlog: CalendarIdea[]; // sudah terfilter platform
  onSchedule: (id: string, date: string | null) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Kalau minggu berganti, pilihan lama tidak berlaku: pakai hari ini atau hari pertama.
  const selected =
    picked && days.includes(picked) ? picked : days.includes(today) ? today : days[0];

  const info = dayInfo(selected);
  const dayIdeas = ideas.filter((i) => i.date === selected);

  return (
    <div className="flex flex-col gap-3">
      {/* Strip 7 hari */}
      <div
        role="tablist"
        aria-label="Pilih hari"
        className="grid grid-cols-7 gap-1 rounded-card bg-white p-2 shadow-card"
      >
        {days.map((key) => {
          const d = dayInfo(key);
          const count = ideas.filter((i) => i.date === key).length;
          const active = key === selected;
          const isToday = key === today;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`${d.dayName} ${d.day} ${d.month}, ${count} ide`}
              onClick={() => {
                setPicked(key);
                setAdding(false);
              }}
              className={`flex flex-col items-center gap-0.5 rounded-2xl py-2 transition-colors ${
                active
                  ? "bg-brand-ink text-white"
                  : isToday
                    ? "bg-brand-lime/40"
                    : "hover:bg-brand-bg"
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase ${
                  active ? "text-white/70" : "text-brand-muted"
                }`}
              >
                {d.dayName.slice(0, 3)}
              </span>
              <span className="text-base font-bold leading-none">{d.day}</span>
              <span
                className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                  count > 0 ? (active ? "bg-brand-lime" : "bg-brand-purple") : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Hari terpilih */}
      <section
        aria-label={`${info.dayName} ${info.day} ${info.month}`}
        className="rounded-card bg-white p-4 shadow-card"
      >
        <header className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold">
              {info.dayName}, {info.day} {info.month}
            </h2>
            <p className="text-xs font-semibold text-brand-muted">{dayIdeas.length} slot</p>
          </div>
          {selected === today && (
            <span className="shrink-0 rounded-full bg-brand-lime px-3 py-1 text-xs font-bold">
              Hari Ini
            </span>
          )}
        </header>

        <div className="flex flex-col gap-2">
          {dayIdeas.length === 0 && (
            <p className="rounded-2xl border-2 border-dashed border-brand-border px-4 py-6 text-center text-xs font-semibold text-brand-muted">
              Belum ada ide di hari ini
            </p>
          )}

          {dayIdeas.map((idea) => (
            <article key={idea.id} className="rounded-2xl bg-brand-bg p-3">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug">{idea.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <PlatformChip platform={idea.platform} />
                <span className="text-xs font-semibold text-brand-muted">
                  {STATUSES.find((s) => s.value === idea.status)?.label}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold">
                <Link href={`/ideas/${idea.id}`} className="py-1 hover:underline">
                  Buka
                </Link>
                <button
                  type="button"
                  onClick={() => onSchedule(idea.id, null)}
                  className="py-1 text-brand-muted"
                >
                  Lepas
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          aria-expanded={adding}
          className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-brand-bg text-sm font-bold transition hover:brightness-95"
        >
          <Icon name="plus" className="h-4 w-4" />
          Tambah dari backlog
          <span className="rounded-full bg-brand-lime px-2 py-0.5 text-xs">{backlog.length}</span>
        </button>

        {adding && (
          <div className="mt-2 rounded-2xl bg-brand-bg p-2">
            {backlog.length === 0 ? (
              <p className="px-3 py-3 text-sm text-brand-muted">
                Backlog kosong. Tambah ide dulu di Papan.
              </p>
            ) : (
              <ul className="max-h-64 overflow-y-auto">
                {backlog.map((idea) => (
                  <li key={idea.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSchedule(idea.id, selected);
                        setAdding(false);
                      }}
                      className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition hover:bg-white"
                    >
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-semibold leading-snug">
                          {idea.title}
                        </span>
                        {idea.hook && (
                          <span className="mt-0.5 line-clamp-1 text-xs italic text-brand-muted">
                            &ldquo;{idea.hook}&rdquo;
                          </span>
                        )}
                      </span>
                      <Icon name="plus" className="h-4 w-4 shrink-0 text-brand-muted" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <Link
        href="/dashboard#tulis-ide"
        className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-ink text-sm font-bold text-white"
      >
        <Icon name="plus" className="h-4 w-4" />
        Tambah Ide Cepat
      </Link>
    </div>
  );
}