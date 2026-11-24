"use client";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useCallback, useOptimistic, useState, useTransition } from "react";
import { moveIdea } from "@/app/dashboard/actions";
import { STATUSES, isStatus, type BoardIdea, type Platform, type Status } from "@/lib/ideas";
import { BoardColumn } from "./board-column";
import { BoardCta } from "./board-cta";
import { BoardFilters, matchesFilter, type PlatformFilter } from "./board-filters";
import { BoardHero } from "./board-hero";
import { BoardStats } from "./board-stats";
import { EmptyState } from "./empty-state";
import { EmptySteps } from "./empty-steps";
import { IdeaForm } from "./idea-form";

const SHORT: Record<Status, string> = {
  idea: "Ide",
  filming: "Syuting",
  editing: "Edit",
  published: "Terbit",
};

// Pointer dulu (kolom yang sedang ditunjuk kursor), baru cadangan ke irisan kotak.
const collision: CollisionDetection = (args) => {
  const hit = pointerWithin(args);
  return hit.length > 0 ? hit : rectIntersection(args);
};

export function Board({
  ideas: serverIdeas,
  defaultPlatform,
  remaining,
  nicheName,
}: {
  ideas: BoardIdea[];
  defaultPlatform: Platform;
  remaining: number | null;
  nicheName: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<PlatformFilter>("all");
  const [mobileStatus, setMobileStatus] = useState<Status>("idea");
  const closeForm = useCallback(() => setShowForm(false), []);

  // Kartu langsung pindah saat dilepas. Kalau server gagal, tampilan otomatis balik
  // ke data asli dan pesan error muncul.
  const [ideas, moveOptimistic] = useOptimistic(
    serverIdeas,
    (state, move: { id: string; to: Status }) =>
      state.map((i) => (i.id === move.id ? { ...i, status: move.to } : i))
  );
  const [, startTransition] = useTransition();
  const [dragError, setDragError] = useState<string | null>(null);

  // Mouse: geser 8px dulu supaya klik biasa tetap jalan. Sentuh: tahan sebentar
  // supaya geser untuk scroll tidak terbaca sebagai seret kartu.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const to = String(over.id);
    const id = String(active.id);
    if (!isStatus(to)) return;
    const current = ideas.find((i) => i.id === id);
    if (!current || current.status === to) return;

    setDragError(null);
    startTransition(async () => {
      moveOptimistic({ id, to });
      const res = await moveIdea(id, to);
      if (res.error) setDragError(res.error);
    });
  }

  const visible = ideas.filter((i) => matchesFilter(filter, i.platform));
  const count = (status: string) => ideas.filter((i) => i.status === status).length;

  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12">
        <BoardHero defaultPlatform={defaultPlatform} nicheName={nicheName} />
        <BoardStats
          published={count("published")}
          filming={count("filming")}
          remaining={remaining}
        />
      </div>

      <BoardFilters
        ideas={ideas}
        value={filter}
        onChange={setFilter}
        onAddFull={() => setShowForm(true)}
      />

      {showForm && (
        <div className="max-w-xl">
          <IdeaForm onDone={closeForm} onCancel={closeForm} />
        </div>
      )}

      {ideas.length > 0 && (
        <div
          role="tablist"
          aria-label="Tahap konten"
          className="grid grid-cols-4 gap-1 rounded-full bg-white p-1 shadow-card md:hidden"
        >
          {STATUSES.map((s) => {
            const active = mobileStatus === s.value;
            const n = visible.filter((i) => i.status === s.value).length;
            return (
              <button
                key={s.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMobileStatus(s.value)}
                className={`rounded-full px-1 py-2 text-xs font-bold transition-colors ${
                  active ? "bg-brand-ink text-white" : "text-brand-muted"
                }`}
              >
                {SHORT[s.value]} <span className={active ? "text-white/70" : ""}>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      {ideas.length === 0 && !showForm ? (
        <EmptyState onStart={() => setShowForm(true)} />
      ) : (
        <>
          {dragError && (
            <p role="alert" className="text-sm font-semibold text-red-700">
              {dragError}
            </p>
          )}
          <DndContext id="board-dnd" sensors={sensors} collisionDetection={collision} onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
              {STATUSES.map((s) => (
                <BoardColumn
                  key={s.value}
                  status={s.value}
                  label={s.label}
                  ideas={visible.filter((i) => i.status === s.value)}
                  defaultPlatform={defaultPlatform}
                  activeOnMobile={mobileStatus === s.value}
                />
              ))}
            </div>
          </DndContext>
        </>
      )}

      {ideas.length === 0 ? <EmptySteps /> : <BoardCta />}
    </div>
  );
}