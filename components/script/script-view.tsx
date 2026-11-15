"use client";

import { useState, useTransition } from "react";
import { toggleShotDone } from "@/app/ideas/[id]/actions";
import { Alert } from "@/components/primitives/alert";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import type { Script } from "@/lib/scripts";
import { SceneCard } from "./scene-card";
import { ShotCard } from "./shot-card";
import { ShotProgress } from "./shot-progress";

function SectionBar({
  icon,
  title,
  badge,
  lime,
}: {
  icon: "notes" | "film";
  title: string;
  badge: string;
  lime?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <Icon name={icon} className="h-[22px] w-[22px]" />
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {!lime && (
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-brand-muted shadow-card">
            {badge}
          </span>
        )}
      </div>
      {lime && (
        <span className="rounded-full bg-brand-lime px-2.5 py-0.5 text-xs font-bold">
          {badge}
        </span>
      )}
    </div>
  );
}

// Dua kolom: naskah per scene (kiri) dan shot list (kanan), plus ide thumbnail.
export function ScriptView({ script, ideaId }: { script: Script; ideaId: string }) {
  const [done, setDone] = useState<boolean[]>(() => script.shots.map((s) => s.done));
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(i: number) {
    const next = !done[i];
    setDone((prev) => prev.map((d, idx) => (idx === i ? next : d)));
    setError(null);
    startTransition(async () => {
      const res = await toggleShotDone(ideaId, i, next);
      if (res.error) {
        setError(res.error);
        // Gagal menyimpan: kembalikan centangnya.
        setDone((prev) => prev.map((d, idx) => (idx === i ? !next : d)));
      }
    });
  }

  const shotNumbersFor = (sceneNo: number) =>
    script.shots.flatMap((s, i) => (s.scene === sceneNo ? [i + 1] : []));

  const doneCount = done.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Kiri: naskah per scene */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <SectionBar
            icon="notes"
            title="Naskah Suara (Voiceover & Dialogue)"
            badge={`${script.scenes.length} Bagian`}
          />
          {script.scenes.map((scene, i) => (
            <SceneCard
              key={i}
              scene={scene}
              index={i}
              shotNumbers={shotNumbersFor(i + 1)}
            />
          ))}
        </div>

        {/* Kanan: shot list */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          <SectionBar
            icon="film"
            title="Shot List & Visual Notes"
            badge={`${script.shots.length} Terdaftar`}
            lime
          />

          {error && <Alert>{error}</Alert>}

          {script.shots.length === 0 ? (
            <Card className="p-6 text-sm text-brand-muted">
              AI belum membuat shot list untuk script ini. Coba Buat Ulang.
            </Card>
          ) : (
            <>
              {script.shots.map((shot, i) => (
                <ShotCard
                  key={i}
                  shot={shot}
                  number={i + 1}
                  done={done[i] ?? false}
                  onToggle={() => toggle(i)}
                />
              ))}
              <ShotProgress done={doneCount} total={script.shots.length} />
            </>
          )}
        </div>
      </div>

      {script.thumbnail_ideas.length > 0 && (
        <section>
          <h2 className="mb-3 px-1 text-lg font-bold tracking-tight">Ide thumbnail</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {script.thumbnail_ideas.map((t, i) => (
              <Card key={i} className="p-5 text-sm font-medium">
                {t}
              </Card>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-brand-muted">
        Script dibuat oleh AI. Cek dan sesuaikan dulu sebelum syuting.
      </p>
    </div>
  );
}