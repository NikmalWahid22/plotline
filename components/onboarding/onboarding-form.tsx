"use client";

import { useActionState, useState } from "react";
import {
  saveOnboarding,
  skipOnboarding,
  type OnboardingState,
} from "@/app/onboarding/actions";
import { Alert } from "@/components/primitives/alert";
import { Icon, type IconName } from "@/components/primitives/icon";
import { PLATFORMS } from "@/lib/ideas";
import { FREQUENCIES, NICHES, type Option } from "@/lib/profile";
import { Choice } from "./choice";

const PLATFORM_OPTIONS: Option[] = PLATFORMS.map((p) => ({
  value: p.value,
  label: p.fullLabel,
}));

const NICHE_ICON: Record<string, IconName> = {
  coding: "screen",
  ui_design: "tune",
  motion: "film",
  gadgets: "phone",
  other: "sparkles",
};
const PLATFORM_ICON: Record<string, IconName> = {
  tiktok: "phone",
  reels: "phone",
  youtube_shorts: "play",
  youtube_long: "screen",
};
const FREQUENCY_ICON: Record<string, IconName> = {
  "1-2": "calendar",
  "3-4": "calendar",
  "5+": "bolt",
};

const STEPS = [
  {
    name: "Niche Konten",
    sub: "Personalisasi ide AI untukmu",
    title: "Apa niche konten utamamu?",
    text: "Plotline menyesuaikan ide dan script dengan bidang yang kamu pilih.",
    next: "Lanjut ke Platform",
  },
  {
    name: "Platform Utama",
    sub: "Tempat kamu biasa posting",
    title: "Kamu posting di mana?",
    text: "Pilih satu atau lebih platform. Ide akan disesuaikan dengan formatnya.",
    next: "Lanjut ke Frekuensi",
  },
  {
    name: "Frekuensi Unggah",
    sub: "Ritme yang ingin kamu jaga",
    title: "Seberapa sering kamu posting?",
    text: "Ini membantu menata ritme di Kalender. Bisa diubah kapan saja.",
    next: "Selesai",
  },
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

  // Ringkasan pilihan yang tampil di penanda langkah.
  const platformLabels = platforms.map(
    (v) => PLATFORMS.find((p) => p.value === v)?.label ?? v
  );
  const summary = [
    NICHES.find((n) => n.value === niche)?.label,
    platformLabels.length
      ? platformLabels.length > 2
        ? `${platformLabels.slice(0, 2).join(", ")} +${platformLabels.length - 2}`
        : platformLabels.join(", ")
      : undefined,
    frequency ? `${frequency}x / minggu` : undefined,
  ];

  const current = STEPS[step - 1];

  return (
    <form action={action} className="flex w-full max-w-5xl flex-col gap-3">
      <input type="hidden" name="niche" value={niche} />
      <input type="hidden" name="frequency" value={frequency} />
      {platforms.map((p) => (
        <input key={p} type="hidden" name="platforms" value={p} />
      ))}

      {/* Penanda langkah */}
      <header className="rounded-card bg-white px-5 py-4 shadow-card">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-lime font-extrabold">
              {step}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Langkah {step} dari 3</p>
              <p className="text-sm text-brand-muted">{current.sub}</p>
            </div>
          </div>

          <ol className="hidden items-center gap-2 lg:flex">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const done = n < step && summary[i];
              const active = n === step;
              return (
                <li key={s.name} className="flex items-center gap-2">
                  {i > 0 && <span className="text-xs text-brand-muted">/</span>}
                  <span
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      active ? "bg-brand-bg text-brand-ink" : done ? "text-brand-ink" : "text-brand-muted opacity-60"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        active || done ? "bg-brand-lime" : "bg-brand-muted"
                      }`}
                    />
                    {n}. {done ? <b className="font-bold">{summary[i]}</b> : s.name}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brand-bg"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step}
          aria-label={`Langkah ${step} dari 3`}
        >
          <div
            className="h-full rounded-full bg-brand-lime transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* Judul */}
      <div className="px-1">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
          {current.title}
        </h1>
        <p className="mt-0.5 text-sm text-brand-muted">{current.text}</p>
      </div>

      {/* Pilihan */}
      {step === 1 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {NICHES.map((o, i) => (
            <Choice
              key={o.value}
              option={o}
              icon={NICHE_ICON[o.value]}
              selected={niche === o.value}
              onSelect={() => setNiche(o.value)}
              className={i < 3 ? "lg:col-span-2" : "lg:col-span-3"}
            />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_OPTIONS.map((o) => (
            <Choice
              key={o.value}
              option={o}
              icon={PLATFORM_ICON[o.value]}
              selected={platforms.includes(o.value)}
              onSelect={() => togglePlatform(o.value)}
            />
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {FREQUENCIES.map((o) => (
            <Choice
              key={o.value}
              option={o}
              icon={FREQUENCY_ICON[o.value]}
              selected={frequency === o.value}
              onSelect={() => setFrequency(o.value)}
            />
          ))}
        </div>
      )}

      {state?.error && <Alert>{state.error}</Alert>}

      {/* Aksi */}
      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          formAction={skipOnboarding}
          formNoValidate
          className="h-11 rounded-full bg-white px-6 text-sm font-bold text-brand-muted shadow-card transition-colors hover:text-brand-ink"
        >
          Lewati untuk sekarang
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-brand-muted lg:inline">
            Pilihan bisa diganti nanti.
          </span>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="h-11 rounded-full bg-white px-6 text-sm font-bold shadow-card transition hover:bg-brand-bg"
            >
              Kembali
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => setStep((s) => s + 1)}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-lime px-7 text-sm font-bold shadow-card transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {current.next}
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canContinue || pending}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-lime px-7 text-sm font-bold shadow-card transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {pending ? "Menyimpan..." : current.next}
              {!pending && <Icon name="check" className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}