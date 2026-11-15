import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";

export function ShotProgress({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-lime">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold">Progress Pengambilan Gambar</p>
          <p className="text-sm font-medium text-brand-muted">
            {done} dari {total} Shot selesai
          </p>
        </div>
      </div>
      <div
        className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-brand-bg"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand-lime transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}