import Link from "next/link";
import { Icon } from "@/components/primitives/icon";
import { PlatformChip } from "@/components/ideas/platform-chip";
import type { CalendarIdea } from "@/lib/calendar";

// Ide yang belum punya tanggal. Kartunya bisa diseret ke hari; menjatuhkan kartu
// dari kalender ke sini melepas jadwalnya.
export function BacklogPanel({
  ideas,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  ideas: CalendarIdea[];
  dragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
}) {
  return (
    <aside
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        if (id) onDrop(id);
      }}
      className={`flex flex-col rounded-card bg-white p-6 shadow-card ${
        dragging ? "outline-dashed outline-2 -outline-offset-4 outline-brand-purple/40" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-heading">Ide Backlog</h2>
        <span className="rounded-full bg-brand-lime px-3 py-1 text-xs font-bold">
          {ideas.length} Siap
        </span>
      </div>
      <p className="mt-2 text-sm text-brand-muted">Seret ke hari tayang yang kamu mau.</p>

      <div className="mt-5 flex max-h-[34rem] flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {ideas.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-brand-border px-4 py-10 text-center text-sm font-semibold text-brand-muted">
            Semua ide sudah dijadwalkan.
          </div>
        ) : (
          ideas.map((idea) => (
            <article
              key={idea.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", idea.id);
                e.dataTransfer.effectAllowed = "move";
                onDragStart(idea.id);
              }}
              onDragEnd={onDragEnd}
              className="cursor-grab rounded-2xl bg-brand-bg p-4 active:cursor-grabbing"
            >
              <div className="flex items-start gap-2">
                <h3 className="line-clamp-2 flex-1 text-sm font-bold leading-snug">{idea.title}</h3>
                <Icon name="grip" className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted" />
              </div>
              {idea.hook && (
                <p className="mt-1.5 line-clamp-2 text-xs font-medium italic text-brand-muted">
                  &ldquo;{idea.hook}&rdquo;
                </p>
              )}
              <div className="mt-3">
                <PlatformChip platform={idea.platform} />
              </div>
            </article>
          ))
        )}
      </div>

      <Link
        href="/dashboard#tulis-ide"
        className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-ink text-sm font-bold text-white transition hover:brightness-125"
      >
        <Icon name="plus" className="h-4 w-4" />
        Tambah Ide Cepat
      </Link>
    </aside>
  );
}