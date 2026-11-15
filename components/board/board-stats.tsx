import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";

// Ringkasan angka asli dari papan dan kuota AI.
export function BoardStats({
  published,
  filming,
  remaining,
}: {
  published: number;
  filming: number;
  remaining: number | null;
}) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-6 lg:col-span-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Performa Ritme</h2>
        <Icon name="bolt" className="h-5 w-5 text-brand-purple" />
      </div>

      <div className="grid grid-cols-2 gap-4 py-2">
        <div className="flex flex-col justify-center rounded-2xl bg-brand-bg p-4">
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold leading-10">{published}</span>
            <span className="text-xs font-semibold text-brand-muted">video</span>
          </p>
          <p className="mt-1 text-sm font-medium text-brand-muted">Sudah Terbit</p>
        </div>
        <div className="flex flex-col justify-center rounded-2xl bg-brand-bg p-4">
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold leading-10 text-brand-purple">
              {filming}
            </span>
            <span className="text-xs font-semibold text-brand-muted">proyek</span>
          </p>
          <p className="mt-1 text-sm font-medium text-brand-muted">Dalam Syuting</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-[#f0ecf5] p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-lime">
            <Icon name="bolt" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight">
              <span>{typeof remaining === "number" ? remaining : "–"}</span>
              <span> dari {DAILY_LIMIT}</span>
            </p>
            <p className="text-xs font-semibold text-brand-muted">
              Sisa Generate AI Hari Ini
            </p>
          </div>
        </div>
        <Icon name="trending" className="h-[18px] w-[18px] text-brand-muted" />
      </div>
    </Card>
  );
}