import { Icon } from "@/components/primitives/icon";
import type { BoardIdea, Platform } from "@/lib/ideas";

export type PlatformFilter =
  | "all"
  | "short_vertical"
  | "youtube_shorts"
  | "youtube_long";

const FILTERS: {
  value: PlatformFilter;
  label: string;
  match: (p: Platform) => boolean;
}[] = [
  { value: "all", label: "Semua Kanal", match: () => true },
  { value: "short_vertical", label: "TikTok / Reels", match: (p) => p === "tiktok" || p === "reels" },
  { value: "youtube_shorts", label: "YouTube Shorts", match: (p) => p === "youtube_shorts" },
  { value: "youtube_long", label: "Long-form YouTube", match: (p) => p === "youtube_long" },
];

export function matchesFilter(filter: PlatformFilter, platform: Platform) {
  return FILTERS.find((f) => f.value === filter)?.match(platform) ?? true;
}

// Baris filter: pill platform di kiri, tampilan dan tombol ide lengkap di kanan.
export function BoardFilters({
  ideas,
  value,
  onChange,
  onAddFull,
}: {
  ideas: BoardIdea[];
  value: PlatformFilter;
  onChange: (v: PlatformFilter) => void;
  onAddFull: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div
        className="-mx-1 -my-2 flex min-w-0 items-center gap-1.5 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible"
        role="group"
        aria-label="Filter platform"
      >
        {FILTERS.map((f) => {
          const count = ideas.filter((i) => f.match(i.platform)).length;
          const active = value === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange(f.value)}
              aria-pressed={active}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold shadow-card transition-all ${
                active ? "bg-brand-ink text-white" : "bg-white hover:bg-brand-bg"
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <div className="hidden items-center rounded-full bg-white p-1 shadow-card sm:flex">
          <span className="flex items-center gap-1 rounded-full bg-brand-bg px-3 py-1 text-xs font-semibold">
            <Icon name="kanban" className="h-4 w-4" />
            Kanban
          </span>
          <span
            title="Segera hadir"
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-brand-muted/60"
          >
            <Icon name="calendar" className="h-4 w-4" />
            Agenda
          </span>
        </div>
        <button
          type="button"
          onClick={onAddFull}
          aria-label="Tambah ide lengkap (dengan hook)"
          title="Ide lengkap (dengan hook)"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-card transition-colors hover:bg-brand-bg"
        >
          <Icon name="plus" className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}