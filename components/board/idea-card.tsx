"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteIdea, moveIdea } from "@/app/dashboard/actions";
import { PlatformChip } from "@/components/ideas/platform-chip";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import { formatShortDate } from "@/lib/format";
import { STATUSES, type BoardIdea, type Status } from "@/lib/ideas";

const ARROW_BTN =
  "flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg text-sm font-bold transition-colors hover:bg-brand-border disabled:cursor-not-allowed disabled:opacity-30";

export function IdeaCard({ idea }: { idea: BoardIdea }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Card
      className={`flex flex-col gap-4 p-6 transition-all duration-200 hover:-translate-y-1 ${
        pending ? "opacity-60" : ""
      }`}
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
        <h3 className="text-lg font-bold leading-snug tracking-tight">
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

      <div className="flex items-center gap-2 border-t border-brand-border/70 pt-3">
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
          className="ml-auto rounded-full bg-brand-bg px-3 py-1 text-xs font-bold transition-colors hover:bg-brand-border"
        >
          {idea.has_script ? "Buka script" : "Buat script"}
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={remove}
          className="text-xs font-semibold text-brand-muted transition-colors hover:text-red-700 disabled:opacity-40"
        >
          Hapus
        </button>
      </div>
    </Card>
  );
}