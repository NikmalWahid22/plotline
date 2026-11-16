import Link from "next/link";
import { Icon } from "@/components/primitives/icon";
import { PlatformChip } from "@/components/ideas/platform-chip";
import { STATUSES } from "@/lib/ideas";
import type { CalendarIdea } from "@/lib/calendar";

// Kartu ide kecil di dalam kolom hari. Bisa diseret ke hari lain atau ke backlog.
export function IdeaSlot({
  idea,
  onDragStart,
  onDragEnd,
  onUnschedule,
}: {
  idea: CalendarIdea;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onUnschedule: (id: string) => void;
}) {
  const status = STATUSES.find((s) => s.value === idea.status)?.label;

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", idea.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(idea.id);
      }}
      onDragEnd={onDragEnd}
      className="cursor-grab rounded-2xl bg-white p-4 shadow-card active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <h3 className="line-clamp-3 flex-1 text-sm font-bold leading-snug">{idea.title}</h3>
        <Icon name="grip" className="mt-0.5 h-4 w-4 shrink-0 text-brand-muted" />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlatformChip platform={idea.platform} />
        <span className="text-xs font-semibold text-brand-muted">{status}</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-bold">
        <Link href={`/ideas/${idea.id}`} className="hover:underline">
          Buka
        </Link>
        <button
          type="button"
          onClick={() => onUnschedule(idea.id)}
          className="text-brand-muted transition hover:text-brand-ink"
        >
          Lepas
        </button>
      </div>
    </article>
  );
}