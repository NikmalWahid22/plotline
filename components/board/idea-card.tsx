"use client";

import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { deleteIdea, moveIdea } from "@/app/dashboard/actions";
import { IdeaEditForm } from "@/components/board/idea-edit-form";
import { PlatformChip } from "@/components/ideas/platform-chip";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import { formatShortDate } from "@/lib/format";
import { STATUSES, type BoardIdea, type Status } from "@/lib/ideas";

const ARROW_BTN =
  "flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg text-sm font-bold xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 transition-colors hover:bg-brand-border disabled:cursor-not-allowed disabled:opacity-30";

// Progress "Ambil Shot" di kartu Syuting. Angkanya dari centang di halaman script.
function ShotProgress({ done, total }: { done: number; total: number }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-brand-muted">Shot diambil</span>
        <span>
          {done} / {total}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Shot diambil"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-brand-bg"
      >
        <div
          className={`h-full rounded-full ${done === total ? "bg-brand-lime" : "bg-brand-purple"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function IdeaCard({ idea }: { idea: BoardIdea }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const closeEdit = useCallback(() => setEditing(false), []);

  // Tidak bisa diseret saat form edit terbuka, supaya memilih teks di kolom isian aman.
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: idea.id,
    disabled: editing,
  });

  const index = STATUSES.findIndex((s) => s.value === idea.status);
  const prev = index > 0 ? STATUSES[index - 1] : null;
  const next = index < STATUSES.length - 1 ? STATUSES[index + 1] : null;

  function run(task: () => Promise<{ error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await task();
      if (res.error) setError(res.error);
    });
  }

  function move(to: Status) {
    run(() => moveIdea(idea.id, to));
  }

  function remove() {
    if (!window.confirm(`Hapus ide "${idea.title}"?`)) return;
    run(() => deleteIdea(idea.id));
  }

  if (editing) {
    return (
      <Card ref={setNodeRef} className="p-4 md:p-6">
        <IdeaEditForm idea={idea} onDone={closeEdit} onCancel={closeEdit} />
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={
        transform
          ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(1.5deg)` }
          : undefined
      }
      // Seluruh kartu bisa diseret di layar md ke atas. Di HP hanya satu kolom tampil,
      // jadi pindah lewat tombol panah.
      {...listeners}
      {...{ ...attributes, role: undefined, tabIndex: undefined }}
      className={`flex flex-col gap-3 p-4 md:cursor-grab md:gap-4 md:p-6 xl:p-5 2xl:p-6 ${
        isDragging
          ? "relative z-50 cursor-grabbing shadow-2xl"
          : "transition-all duration-200 md:hover:-translate-y-1"
      } ${pending ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <PlatformChip platform={idea.platform} />
        {idea.has_script ? (
          <span className="rounded-full bg-brand-lime px-2.5 py-0.5 text-[10px] font-bold">
            Script siap
          </span>
        ) : (
          <span className="text-xs font-semibold text-brand-muted">Draft</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold leading-snug tracking-tight md:text-lg">
          <Link href={`/ideas/${idea.id}`} className="hover:underline">
            {idea.title}
          </Link>
        </h3>
        {idea.hook && (
          <p className="line-clamp-2 text-sm font-medium italic text-brand-muted">
            &ldquo;{idea.hook}&rdquo;
          </p>
        )}
      </div>

      {idea.status === "filming" && (idea.shots_total ?? 0) > 0 && (
        <ShotProgress done={idea.shots_done ?? 0} total={idea.shots_total ?? 0} />
      )}

      <div className="flex items-center justify-between pt-1 text-xs font-semibold text-brand-muted">
        <span className="flex items-center gap-1">
          <Icon name="notes" className="h-4 w-4" />
          {idea.has_script ? "Script dan shot list" : "Belum ada script"}
        </span>
        <span className="flex items-center gap-1 text-brand-ink">
          <Icon name="calendar" className="h-4 w-4 text-brand-purple" />
          {formatShortDate(idea.created_at)}
        </span>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2 border-t border-brand-border/70 pt-3">
        <button
          type="button"
          disabled={!prev || pending}
          onClick={() => prev && move(prev.value)}
          aria-label={prev ? `Pindah ke ${prev.label}` : "Sudah di kolom pertama"}
          className={ARROW_BTN}
        >
          ←
        </button>
        <button
          type="button"
          disabled={!next || pending}
          onClick={() => next && move(next.value)}
          aria-label={next ? `Pindah ke ${next.label}` : "Sudah di kolom terakhir"}
          className={ARROW_BTN}
        >
          →
        </button>
        <Link
          href={`/ideas/${idea.id}`}
          className="ml-auto whitespace-nowrap rounded-full bg-brand-bg px-2.5 py-1 text-xs font-bold transition-colors hover:bg-brand-border"
        >
          {idea.has_script ? "Buka script" : "Buat script"}
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => setEditing(true)}
          className="whitespace-nowrap px-1 text-xs font-semibold text-brand-muted transition-colors hover:text-brand-ink disabled:opacity-40"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={remove}
          className="whitespace-nowrap px-1 text-xs font-semibold text-brand-muted transition-colors hover:text-red-700 disabled:opacity-40"
        >
          Hapus
        </button>
      </div>
    </Card>
  );
}