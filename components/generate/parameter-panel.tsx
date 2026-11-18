"use client";

import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Icon, type IconName } from "@/components/primitives/icon";
import { PLATFORMS, type Platform } from "@/lib/ideas";
import { TONES, type Tone } from "@/lib/tones";
import { QuotaBars } from "./quota-bars";

const TOPIC_MAX = 200;
const SUGGESTIONS = ["Build in Public", "Review Tools", "Before/After Redesign", "Coding Tips"];
const PLATFORM_BADGE: Record<Platform, string> = {
  tiktok: "TT",
  reels: "IG",
  youtube_shorts: "YT",
  youtube_long: "LF",
};
const TONE_ICON: Record<Tone, IconName> = {
  santai: "bolt",
  storytelling: "book",
  kontroversial: "help",
};

type Props = {
  action: (formData: FormData) => void;
  nicheName: string;
  topic: string;
  onTopic: (v: string) => void;
  platform: Platform;
  onPlatform: (v: Platform) => void;
  tone: Tone;
  onTone: (v: Tone) => void;
  onReset: () => void;
  remaining: number | null;
  pending: boolean;
  outOfQuota: boolean;
};

// Panel kiri: semua pengaturan yang dikirim ke AI.
export function ParameterPanel(p: Props) {
  function addSuggestion(text: string) {
    const next = p.topic.trim() ? `${p.topic.trim()}, ${text}` : text;
    p.onTopic(next.slice(0, TOPIC_MAX));
  }

  return (
    <Card className="p-4 sm:p-6">
      <form action={p.action} className="flex flex-col gap-5 sm:gap-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg">
              <Icon name="tune" className="h-4 w-4" />
            </span>
            Parameter Kreatif
          </h2>
          <button
            type="button"
            onClick={p.onReset}
            className="text-xs font-semibold text-brand-muted transition-colors hover:text-brand-ink"
          >
            Reset
          </button>
        </div>

        {/* Topik */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="topic" className="text-sm font-bold">
              Topik / Niche Utama
            </label>
            <span className="text-xs font-semibold text-brand-muted">{p.nicheName}</span>
          </div>
          <textarea
            id="topic"
            name="topic"
            required
            minLength={3}
            maxLength={TOPIC_MAX}
            rows={2}
            value={p.topic}
            onChange={(e) => p.onTopic(e.target.value)}
            placeholder="Contoh: Frontend Dev & Tailwind CSS"
            className="w-full resize-none rounded-2xl bg-brand-bg px-4 py-3 text-sm font-medium outline-none placeholder:text-brand-muted focus:bg-white focus:ring-2 focus:ring-brand-ink/10"
          />
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSuggestion(s)}
                className="rounded-full bg-brand-bg px-3 py-1 text-xs font-semibold transition-colors hover:bg-brand-border"
              >
                + {s}
              </button>
            ))}
            <span className="ml-auto text-xs text-brand-muted">
              {p.topic.length}/{TOPIC_MAX}
            </span>
          </div>
        </div>

        {/* Platform (satu pilihan) */}
        <fieldset className="min-w-0">
          <div className="mb-2 flex items-center justify-between">
            <legend className="text-sm font-bold">Target Platform</legend>
            <span className="text-xs font-semibold text-brand-purple">Pilih satu</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((o) => {
              const selected = p.platform === o.value;
              return (
                <label key={o.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="platform"
                    value={o.value}
                    checked={selected}
                    onChange={() => p.onPlatform(o.value)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex h-10 items-center gap-2 rounded-full px-3 text-xs font-bold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-ink ${
                      selected
                        ? "bg-brand-ink text-white"
                        : "bg-brand-bg text-brand-muted hover:bg-brand-border"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] ${
                        selected ? "bg-white/20" : "bg-white"
                      }`}
                    >
                      {PLATFORM_BADGE[o.value]}
                    </span>
                    <span className="truncate">{o.fullLabel}</span>
                    {selected && (
                      <Icon name="check" className="ml-auto h-4 w-4 shrink-0 text-brand-lime" />
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Gaya bahasa */}
        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-bold">Tone of Voice</legend>
          <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
            {TONES.map((o) => {
              const selected = p.tone === o.value;
              return (
                <label key={o.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="tone"
                    value={o.value}
                    checked={selected}
                    onChange={() => p.onTone(o.value)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-ink max-lg:rounded-full max-lg:py-2 ${
                      selected
                        ? "bg-brand-bg ring-1 ring-brand-ink/10 max-lg:bg-brand-ink max-lg:text-white max-lg:ring-0"
                        : "hover:bg-brand-bg/60 max-lg:bg-brand-bg"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 max-lg:hidden ${
                        selected ? "border-brand-ink" : "border-brand-border"
                      }`}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-brand-lime" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold">{o.label}</span>
                      <span className="block truncate text-xs text-brand-muted max-lg:hidden">{o.desc}</span>
                    </span>
                    <Icon name={TONE_ICON[o.value]} className="h-4 w-4 shrink-0 text-brand-muted max-lg:hidden" />
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={p.pending || p.outOfQuota}
            className="flex h-14 w-full items-center justify-center gap-2 text-base"
          >
            <Icon name="bolt" className="h-5 w-5" />
            {p.pending
              ? "Lagi mikirin ide..."
              : p.outOfQuota
                ? "Jatah hari ini habis"
                : "Generate 5 Ide Konten"}
          </Button>
          <p className="mt-2 text-center text-xs text-brand-muted">
            Setiap generate memakai 1 jatah harian.
          </p>
        </div>

        <QuotaBars remaining={p.remaining} />
      </form>
    </Card>
  );
}