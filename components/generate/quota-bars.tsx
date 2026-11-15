import { DAILY_LIMIT } from "@/lib/constants";

// Sisa jatah harian dalam bentuk batang: satu batang per jatah.
export function QuotaBars({ remaining }: { remaining: number | null }) {
  const left = typeof remaining === "number" ? remaining : 0;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-brand-bg p-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
          Sisa jatah hari ini
        </p>
        <p className="mt-0.5 text-xl font-extrabold tracking-tight">
          {typeof remaining === "number" ? remaining : "–"} dari {DAILY_LIMIT}
        </p>
      </div>

      <div className="flex items-end gap-1" aria-hidden="true">
        {Array.from({ length: DAILY_LIMIT }, (_, i) => {
          const filled = i < left;
          const color = !filled
            ? "bg-brand-border"
            : i < DAILY_LIMIT * 0.6
              ? "bg-brand-ink"
              : i < DAILY_LIMIT * 0.8
                ? "bg-brand-purple"
                : "bg-brand-lime";
          return (
            <span
              key={i}
              className={`w-1.5 rounded-full ${color}`}
              style={{ height: 14 + i * 3 }}
            />
          );
        })}
      </div>
    </div>
  );
}


