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
    <div className="flex flex-col gap-3 rounded-card bg-white p-3 shadow-card sm:p-4 sm:gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <Link href={`/calendar?week=${addDays(weekStart, -7)}`} aria-label="Minggu sebelumnya" className={NAV_BTN}>
            <Icon name="chevronLeft" className="h-5 w-5" />
          </Link>
          <p className="text-center text-base font-bold sm:min-w-[11.5rem]">
            {formatRange(weekStart)}
          </p>
          <Link href={`/calendar?week=${addDays(weekStart, 7)}`} aria-label="Minggu berikutnya" className={NAV_BTN}>
            <Icon name="chevronRight" className="h-5 w-5" />
          </Link>
        </div>

        <Link
          href="/calendar"
          aria-disabled={isCurrentWeek}
          className={`h-10 items-center rounded-full px-5 text-sm font-bold transition ${
            isCurrentWeek
              ? "hidden bg-brand-lime sm:flex"
              : "flex bg-brand-bg hover:bg-brand-border"
          }`}
        >
          Minggu Ini
        </Link>

        <div className="hidden rounded-full bg-[#f0ecf5] p-1 text-sm font-bold sm:flex">
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

      <div
        className="-mx-3 flex gap-2 overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        role="group"
        aria-label="Filter platform"
      >
        {options.map((o) => {
          const active = filter === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onFilter(o.value)}
              aria-pressed={active}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition sm:h-10 ${
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