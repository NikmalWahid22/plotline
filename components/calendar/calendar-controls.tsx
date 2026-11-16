import Link from "next/link";
import { Icon } from "@/components/primitives/icon";
import { addDays, formatRange } from "@/lib/dates";
import { PLATFORMS } from "@/lib/ideas";
import type { PlatformFilter } from "@/components/calendar/calendar-view";

const NAV_BTN =
  "flex h-10 w-10 items-center justify-center rounded-full bg-brand-bg text-brand-ink transition hover:bg-brand-border";

export function CalendarControls({
  weekStart,
  isCurrentWeek,
  filter,
  counts,
  onFilter,
}: {
  weekStart: string;
  isCurrentWeek: boolean;
  filter: PlatformFilter;
  counts: Record<string, number>;
  onFilter: (f: PlatformFilter) => void;
}) {
  const options: { value: PlatformFilter; label: string }[] = [
    { value: "all", label: "Semua" },
    ...PLATFORMS.map((p) => ({ value: p.value, label: p.label })),
  ];

  return (
    <div className="flex flex-col gap-4 rounded-card bg-white p-4 shadow-card xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Link href={`/calendar?week=${addDays(weekStart, -7)}`} aria-label="Minggu sebelumnya" className={NAV_BTN}>
            <Icon name="chevronLeft" className="h-5 w-5" />
          </Link>
          <p className="min-w-[11.5rem] text-center text-base font-extrabold">
            {formatRange(weekStart)}
          </p>
          <Link href={`/calendar?week=${addDays(weekStart, 7)}`} aria-label="Minggu berikutnya" className={NAV_BTN}>
            <Icon name="chevronRight" className="h-5 w-5" />
          </Link>
        </div>

        <Link
          href="/calendar"
          aria-disabled={isCurrentWeek}
          className={`flex h-10 items-center rounded-full px-5 text-sm font-bold transition ${
            isCurrentWeek
              ? "bg-brand-lime"
              : "bg-brand-bg hover:bg-brand-border"
          }`}
        >
          Minggu Ini
        </Link>

        <div className="flex rounded-full bg-[#f0ecf5] p-1 text-sm font-bold">
          <span className="rounded-full bg-white px-4 py-1.5 shadow-card">Mingguan</span>
          <span
            aria-disabled="true"
            title="Segera hadir"
            className="cursor-not-allowed px-4 py-1.5 text-[#444934]/50"
          >
            Bulanan
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter platform">
        {options.map((o) => {
          const active = filter === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onFilter(o.value)}
              aria-pressed={active}
              className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
                active ? "bg-brand-ink text-white" : "bg-brand-bg hover:bg-brand-border"
              }`}
            >
              {o.label}
              <span className={`text-xs ${active ? "text-white/70" : "text-brand-muted"}`}>
                {counts[o.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}