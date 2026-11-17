"use client";

import { useActionState, useState } from "react";
import { updateProfile, type SettingsState } from "@/app/settings/actions";
import { Alert } from "@/components/primitives/alert";
import { Icon, type IconName } from "@/components/primitives/icon";
import { FREQUENCY_ICON, NICHE_ICON, PLATFORM_ICON } from "@/components/onboarding/icons";
import { PLATFORMS } from "@/lib/ideas";
import { FREQUENCIES, NICHES, type Option } from "@/lib/profile";

const PLATFORM_OPTIONS: Option[] = PLATFORMS.map((p) => ({
  value: p.value,
  label: p.fullLabel,
}));

// Satu pilihan berbentuk pil. tone = warna saat terpilih.
function Pill({
  label,
  icon,
  selected,
  tone,
  onSelect,
}: {
  label: string;
  icon: IconName;
  selected: boolean;
  tone: "lime" | "ink";
  onSelect: () => void;
}) {
  const on = tone === "lime" ? "bg-brand-lime text-brand-ink" : "bg-brand-ink text-white";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition active:scale-95 ${
        selected ? on : "bg-brand-bg text-brand-muted hover:bg-brand-border"
      }`}
    >
      <Icon name={selected ? "check" : icon} className="h-4 w-4" />
      {label}
    </button>
  );
}

function Group({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="text-xs text-brand-muted">{hint}</span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

export function SettingsForm({
  initial,
}: {
  initial: { niche: string; platforms: string[]; frequency: string };
}) {
  const [niche, setNiche] = useState(initial.niche);
  const [platforms, setPlatforms] = useState<string[]>(initial.platforms);
  const [frequency, setFrequency] = useState(initial.frequency);
  const [state, action, pending] = useActionState<SettingsState, FormData>(updateProfile, null);

  const dirty =
    niche !== initial.niche ||
    frequency !== initial.frequency ||
    [...platforms].sort().join() !== [...initial.platforms].sort().join();
  const valid = niche !== "" && platforms.length > 0 && frequency !== "";

  function togglePlatform(value: string) {
    setPlatforms((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="niche" value={niche} />
      <input type="hidden" name="frequency" value={frequency} />
      {platforms.map((p) => (
        <input key={p} type="hidden" name="platforms" value={p} />
      ))}

      <Group title="Niche Kreator" hint="Pilih satu">
        {NICHES.map((o) => (
          <Pill key={o.value} label={o.label} icon={NICHE_ICON[o.value]} tone="lime" selected={niche === o.value} onSelect={() => setNiche(o.value)} />
        ))}
      </Group>

      <Group title="Target Platform Utama" hint="Pilih satu atau lebih">
        {PLATFORM_OPTIONS.map((o) => (
          <Pill key={o.value} label={o.label} icon={PLATFORM_ICON[o.value]} tone="ink" selected={platforms.includes(o.value)} onSelect={() => togglePlatform(o.value)} />
        ))}
      </Group>

      <Group title="Frekuensi Unggah" hint="Target per minggu">
        {FREQUENCIES.map((o) => (
          <Pill key={o.value} label={`${o.value}x · ${o.desc}`} icon={FREQUENCY_ICON[o.value]} tone="lime" selected={frequency === o.value} onSelect={() => setFrequency(o.value)} />
        ))}
      </Group>

      {state?.error && <Alert>{state.error}</Alert>}
      {state?.ok && !dirty && <Alert tone="info">Perubahan tersimpan.</Alert>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-muted">Perubahan langsung dipakai di Papan, Generate, dan Script.</p>
        <button
          type="submit"
          disabled={!dirty || !valid || pending}
          className="h-11 shrink-0 rounded-full bg-brand-lime px-7 text-sm font-bold shadow-card transition hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan Preferensi"}
        </button>
      </div>
    </form>
  );
}