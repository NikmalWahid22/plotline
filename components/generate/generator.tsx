"use client";

import { useActionState, useState } from "react";
import { generateIdeasAction, type GenerateState } from "@/app/generate/actions";
import { Card } from "@/components/primitives/card";
import type { Platform } from "@/lib/ideas";
import { DEFAULT_TONE, type Tone } from "@/lib/tones";
import { GenerateCta } from "./generate-cta";
import { ParameterPanel } from "./parameter-panel";
import { QuotaExhausted } from "./quota-exhausted";
import { Results, ResultsSkeleton } from "./results";

export function Generator({
  nicheName,
  defaultPlatform,
  initialRemaining,
  initialTopic = "",
}: {
  nicheName: string;
  defaultPlatform: Platform;
  initialRemaining: number | null;
  initialTopic?: string;
}) {
  const [state, action, pending] = useActionState<GenerateState, FormData>(
    generateIdeasAction,
    null
  );
  // Dikontrol lewat state supaya isi form tidak ter-reset setelah generate.
  const [topic, setTopic] = useState(initialTopic);
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);
  const [tone, setTone] = useState<Tone>(DEFAULT_TONE);

  const remaining = state?.remaining ?? initialRemaining;
  const outOfQuota = remaining === 0;

  function reset() {
    setTopic("");
    setPlatform(defaultPlatform);
    setTone(DEFAULT_TONE);
  }

  return (
    <div className="flex flex-col gap-8">
    <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <ParameterPanel
          action={action}
          nicheName={nicheName}
          topic={topic}
          onTopic={setTopic}
          platform={platform}
          onPlatform={setPlatform}
          tone={tone}
          onTone={setTone}
          onReset={reset}
          remaining={remaining}
          pending={pending}
          outOfQuota={outOfQuota}
        />
      </div>

      <div className="min-w-0 lg:col-span-7">
        {pending ? (
          <ResultsSkeleton />
        ) : outOfQuota && !state?.ideas ? (
          <QuotaExhausted />
        ) : state?.error ? (
          <Card role="alert" className="p-6">
            <p className="font-bold">Belum berhasil</p>
            <p className="mt-1 text-sm text-brand-muted">{state.error}</p>
          </Card>
        ) : state?.ideas && state.platform ? (
          <Results key={state.batch} ideas={state.ideas} platform={state.platform} />
        ) : (
          <div className="rounded-card bg-white/60 px-6 py-14 text-center shadow-card">
            <p className="font-bold">Belum ada hasil</p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-brand-muted">
              Isi parameter, lalu klik Generate. Ide yang cocok bisa
              disimpan ke papan.
            </p>
          </div>
        )}
      </div>
    </div>
    <GenerateCta />
    </div>
  );
}