"use client";

import { Card } from "@/components/primitives/card";
import type { Shot } from "@/lib/scripts";

// Satu shot dengan centang "Ambil Shot".
export function ShotCard({
  shot,
  number,
  done,
  onToggle,
}: {
  shot: Shot;
  number: number;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={`flex flex-col gap-2 p-4 transition-all hover:-translate-y-0.5 sm:gap-3 sm:p-6 ${
        done ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-purple text-xs font-semibold text-white">
          {number}
        </span>
        <h3 className="text-base font-bold tracking-tight sm:text-lg">
          Shot {number}
          {shot.type ? ` • ${shot.type}` : ""}
        </h3>
      </div>

      <p className={done ? "text-brand-muted line-through" : ""}>
        {shot.description}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-brand-muted">
          Terkait: Scene {shot.scene}
        </span>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
            className="h-5 w-5 cursor-pointer rounded-md accent-brand-ink"
          />
          <span className="text-xs font-semibold">Ambil Shot</span>
        </label>
      </div>
    </Card>
  );
}