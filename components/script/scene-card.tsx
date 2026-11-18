import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import type { Scene } from "@/lib/scripts";

// Satu scene: judul, voiceover, arahan visual, dan shot yang terkait.
export function SceneCard({
  scene,
  index,
  shotNumbers,
}: {
  scene: Scene;
  index: number;
  shotNumbers: number[];
}) {
  return (
    <Card className="flex flex-col gap-3 p-4 transition-all hover:-translate-y-0.5 sm:gap-4 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-ink text-sm font-bold text-white">
          {index + 1}
        </span>
        <h3 className="text-base font-bold uppercase leading-tight tracking-tight sm:text-lg">
          Scene {index + 1}: {scene.title}
        </h3>
      </div>

      <div className="rounded-2xl bg-brand-bg p-3 sm:p-4">
        <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
          <Icon name="mic" className="h-4 w-4" />
          Dialog / Audio
        </p>
        <p className="text-base font-semibold leading-relaxed sm:text-lg">
          &ldquo;{scene.voiceover}&rdquo;
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="flex items-start gap-2 rounded-xl bg-brand-bg p-3">
          <Icon name="eye" className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
          <div>
            <p className="text-xs font-bold">Arahan Visual</p>
            <p className="text-sm font-medium text-brand-muted">
              {scene.visual || "–"}
            </p>
          </div>
        </div>
        <div className="hidden items-start gap-2 rounded-xl bg-brand-bg p-3 md:flex">
          <Icon name="link" className="mt-0.5 h-5 w-5 shrink-0 text-[#3f627a]" />
          <div>
            <p className="text-xs font-bold">Link Shot</p>
            <p className="text-sm font-medium">
              {shotNumbers.length > 0
                ? shotNumbers.map((n) => `Shot ${n}`).join(" • ")
                : "–"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}