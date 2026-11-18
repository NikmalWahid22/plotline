"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { scheduleIdea } from "@/app/calendar/actions";
import { Alert } from "@/components/primitives/alert";
import { Icon } from "@/components/primitives/icon";
import { CalendarHero } from "@/components/calendar/calendar-hero";
import { CalendarControls } from "@/components/calendar/calendar-controls";
import { DayColumn } from "@/components/calendar/day-column";
import { BacklogPanel } from "@/components/calendar/backlog-panel";
import { MobileWeek } from "@/components/calendar/mobile-week";
import { addDays, weekDays } from "@/lib/dates";
import type { CalendarIdea } from "@/lib/calendar";
import type { Platform } from "@/lib/ideas";

export type PlatformFilter = "all" | Platform;

export function CalendarView({
  ideas,
  weekStart,
  today,
}: {
  ideas: CalendarIdea[];
  weekStart: string;
  today: string;
}) {
  const [filter, setFilter] = useState<PlatformFilter>("all");
  // Perubahan jadwal yang tampil langsung, sebelum server selesai menyimpan.
  const [overrides, setOverrides] = useState<Record<string, string | null>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [pickerDay, setPickerDay] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const scroller = useRef<HTMLDivElement>(null);

  const days = useMemo(() => weekDays(weekStart), [weekStart]);

  const all = useMemo(
    () =>
      ideas.map((i) => ({
        ...i,
        date: i.id in overrides ? overrides[i.id] : i.date,
      })),
    [ideas, overrides]
  );

  const visible = all.filter((i) => filter === "all" || i.platform === filter);
  const backlogAll = all.filter((i) => i.date === null && i.status !== "published");
  const backlog = visible.filter((i) => i.date === null && i.status !== "published");

  const counts: Record<string, number> = { all: all.length };
  for (const i of all) counts[i.platform] = (counts[i.platform] ?? 0) + 1;

  const scheduledThisWeek = all.filter(
    (i) => i.date !== null && i.date >= weekStart && i.date <= addDays(weekStart, 6)
  ).length;

  // Gulung ke hari ini (atau awal minggu) saat minggu berganti.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>("[data-today]");
    el.scrollTo({ left: target ? Math.max(0, target.offsetLeft - 24) : 0 });
  }, [weekStart]);

  function schedule(id: string, date: string | null) {
    setPickerDay(null);
    setDraggingId(null);
    const current = all.find((i) => i.id === id);
    if (!current || current.date === date) return;

    setError(null);
    setOverrides((o) => ({ ...o, [id]: date }));
    startTransition(async () => {
      const res = await scheduleIdea(id, date);
      if (res.error) {
        setError(res.error);
        setOverrides((o) => {
          const next = { ...o };
          delete next[id];
          return next;
        });
      }
    });
  }

  function scrollBy(dir: 1 | -1) {
    scroller.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <CalendarHero scheduledThisWeek={scheduledThisWeek} backlog={backlogAll.length} />

      <CalendarControls
        weekStart={weekStart}
        isCurrentWeek={days.includes(today)}
        filter={filter}
        counts={counts}
        onFilter={setFilter}
      />

      {error && <Alert>{error}</Alert>}

      {/* HP dan tablet: strip 7 hari + daftar hari terpilih */}
      <div className="lg:hidden">
        <MobileWeek
          days={days}
          today={today}
          ideas={visible}
          backlog={backlog}
          onSchedule={schedule}
        />
      </div>

      {/* Desktop: matriks 7 kolom + backlog di samping */}
      <div className="grid gap-6 max-lg:hidden lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section className="min-w-0 rounded-card bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-heading">Matriks Distribusi 7 Hari</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Geser ke kiri"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg transition hover:bg-brand-border"
              >
                <Icon name="chevronLeft" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Geser ke kanan"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg transition hover:bg-brand-border"
              >
                <Icon name="chevronRight" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={scroller}
            className="-mx-2 overflow-x-auto px-2 py-1 pb-4"
            style={{ scrollSnapType: "x proximity" }}
          >
            <div className="grid grid-flow-col auto-cols-[16rem] gap-5">
              {days.map((key) => (
                <DayColumn
                  key={key}
                  dateKey={key}
                  isToday={key === today}
                  ideas={visible.filter((i) => i.date === key)}
                  backlog={backlog}
                  dragging={draggingId !== null}
                  pickerOpen={pickerDay === key}
                  onTogglePicker={() => setPickerDay(pickerDay === key ? null : key)}
                  onPick={(id) => schedule(id, key)}
                  onDrop={(id) => schedule(id, key)}
                  onDragStart={setDraggingId}
                  onDragEnd={() => setDraggingId(null)}
                  onUnschedule={(id) => schedule(id, null)}
                />
              ))}
            </div>
          </div>
        </section>

        <BacklogPanel
          ideas={backlog}
          dragging={draggingId !== null}
          onDragStart={setDraggingId}
          onDragEnd={() => setDraggingId(null)}
          onDrop={(id) => schedule(id, null)}
        />
      </div>

      {pickerDay && (
        <button
          type="button"
          aria-label="Tutup"
          onClick={() => setPickerDay(null)}
          className="fixed inset-0 z-10 cursor-default"
        />
      )}
    </div>
  );
}