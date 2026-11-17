"use client";

import { useState } from "react";
import { PlatformChip } from "@/components/ideas/platform-chip";
import { Icon } from "@/components/primitives/icon";
import { STATUSES, type Platform, type Status } from "@/lib/ideas";

// Contoh isi papan untuk landing page. Ini data contoh, bukan data pengguna.
type Sample = {
  platform: Platform;
  status: Status;
  title: string;
  hook?: string;
  script: boolean;
};

const SAMPLES: Sample[] = [
  {
    platform: "tiktok",
    status: "idea",
    title: "Review setup meja minimalis",
    hook: "Meja kerja developer ini cuma punya satu kabel.",
    script: false,
  },
  {
    platform: "youtube_shorts",
    status: "idea",
    title: "Kenapa senior dev masih pakai Vim?",
    hook: "Bukan karena sok keren. Ini alasannya.",
    script: false,
  },
  {
    platform: "reels",
    status: "filming",
    title: "Build in public: micro-SaaS pertamaku",
    hook: "Minggu ini aku rilis produk dengan modal nol.",
    script: true,
  },
  {
    platform: "tiktok",
    status: "editing",
    title: "5 ekstensi VS Code yang wajib dicoba",
    script: true,
  },
  {
    platform: "youtube_shorts",
    status: "published",
    title: "Tips Tailwind yang jarang diketahui",
    script: true,
  },
];

const FILTERS: { label: string; match: (p: Platform) => boolean }[] = [
  { label: "Semua", match: () => true },
  { label: "TikTok", match: (p) => p === "tiktok" },
  { label: "Shorts", match: (p) => p === "youtube_shorts" },
  { label: "Reels", match: (p) => p === "reels" },
];

export function HeroBoard() {
  const [filter, setFilter] = useState(0);
  const active = FILTERS[filter];

  return (
    <div
      id="papan"
      className="mx-auto mt-10 max-w-5xl scroll-mt-24 rounded-[24px] bg-white p-3 shadow-[0_20px_40px_rgba(20,20,26,0.08)] sm:p-5 md:mt-14"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter platform contoh"
          className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-brand-bg p-1"
        >
          {FILTERS.map((f, i) => (
            <button
              key={f.label}
              type="button"
              role="tab"
              aria-selected={filter === i}
              onClick={() => setFilter(i)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                filter === i
                  ? "bg-white text-brand-ink shadow-sm"
                  : "text-brand-muted hover:text-brand-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="hidden shrink-0 text-xs font-semibold text-brand-muted sm:block">
          Contoh isi papan
        </span>
      </div>

      <div className="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 sm:-mx-5 sm:px-5 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {STATUSES.map((s) => {
          const cards = SAMPLES.filter(
            (c) => c.status === s.value && active.match(c.platform)
          );
          return (
            <div
              key={s.value}
              className="flex min-h-40 w-60 shrink-0 snap-start flex-col gap-2 rounded-[20px] bg-brand-bg/70 p-3 lg:w-auto"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-bold">{s.label}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-brand-muted">
                  {cards.length}
                </span>
              </div>

              {cards.length === 0 && (
                <p className="px-1 py-6 text-center text-xs font-medium text-brand-muted">
                  Tidak ada kartu untuk filter ini.
                </p>
              )}

              {cards.map((c) => (
                <div
                  key={c.title}
                  className="flex flex-col gap-2 rounded-[16px] bg-white p-3 shadow-card transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="[&>span]:whitespace-nowrap">
                      <PlatformChip platform={c.platform} />
                    </span>
                    {c.script ? (
                      <span className="whitespace-nowrap rounded-full bg-brand-lime px-2 py-0.5 text-[10px] font-bold">
                        Script siap
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-brand-muted">
                        Draft
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold leading-snug tracking-tight">
                    {c.title}
                  </h3>
                  {c.hook && (
                    <p className="line-clamp-2 text-xs font-medium italic text-brand-muted">
                      &ldquo;{c.hook}&rdquo;
                    </p>
                  )}
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-brand-muted">
                    <Icon name="notes" className="h-3.5 w-3.5" />
                    {c.script ? "Script dan shot list" : "Belum ada script"}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}