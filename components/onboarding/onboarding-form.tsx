"use client";

import { useActionState, useState } from "react";
import {
  saveOnboarding,
  skipOnboarding,
  type OnboardingState,
} from "@/app/onboarding/actions";
import { Alert } from "@/components/primitives/alert";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { PLATFORMS } from "@/lib/ideas";
import { FREQUENCIES, NICHES, type Option } from "@/lib/profile";
import { Choice } from "./choice";

const PLATFORM_OPTIONS: Option[] = PLATFORMS.map((p) => ({
  value: p.value,
  label: p.fullLabel,
}));

const TITLES = [
  { title: "Konten lo di bidang apa?", sub: "Ini bikin ide yang dihasilkan lebih relevan." },
  { title: "Lo posting di mana?", sub: "Pilih satu atau lebih platform." },
  { title: "Seberapa sering lo posting?", sub: "Bisa diubah kapan saja nanti." },
];

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");
  const [state, action, pending] = useActionState<OnboardingState, FormData>(
    saveOnboarding,
    null
  );

  const canContinue =
    (step === 1 && niche !== "") ||
    (step === 2 && platforms.length > 0) ||
    (step === 3 && frequency !== "");

  function togglePlatform(value: string) {
    setPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  return (
    <Card className="w-full max-w-xl p-6 sm:p-8">
      <div className="flex items-center gap-2" aria-label={`Langkah ${step} dari 3`}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              n <= step ? "bg-brand-ink" : "bg-brand-border"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold text-brand-muted">
        Langkah {step} dari 3
      </p>

      <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {TITLES[step - 1].title}
      </h1>
      <p className="mt-1.5 text-sm text-brand-muted">{TITLES[step - 1].sub}</p>

      <form action={action} className="mt-6">
        <input type="hidden" name="niche" value={niche} />
        <input type="hidden" name="frequency" value={frequency} />
        {platforms.map((p) => (
          <input key={p} type="hidden" name="platforms" value={p} />
        ))}

        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {NICHES.map((o) => (
              <Choice key={o.value} option={o} selected={niche === o.value} onSelect={() => setNiche(o.value)} />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {PLATFORM_OPTIONS.map((o) => (
              <Choice key={o.value} option={o} selected={platforms.includes(o.value)} onSelect={() => togglePlatform(o.value)} />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3">
            {FREQUENCIES.map((o) => (
              <Choice key={o.value} option={o} selected={frequency === o.value} onSelect={() => setFrequency(o.value)} />
            ))}
          </div>
        )}

        {state?.error && <Alert className="mt-4">{state.error}</Alert>}

        <div className="mt-6 flex items-center gap-3">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Kembali
            </Button>
          )}

          {step < 3 ? (
            <Button disabled={!canContinue} onClick={() => setStep((s) => s + 1)} className="flex-1">
              Lanjut
            </Button>
          ) : (
            <Button type="submit" disabled={!canContinue || pending} className="flex-1">
              {pending ? "Menyimpan..." : "Selesai"}
            </Button>
          )}
        </div>
      </form>

      {/* Form terpisah (form tidak boleh bersarang) */}
      <form action={skipOnboarding} className="mt-4 text-center">
        <button
          type="submit"
          className="text-sm font-semibold text-brand-muted underline-offset-4 hover:text-brand-ink hover:underline"
        >
          Lewati dulu
        </button>
      </form>
    </Card>
  );
}
