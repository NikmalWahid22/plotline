"use client";

import { useActionState, useEffect, useState } from "react";
import { createIdea, type IdeaFormState } from "@/app/dashboard/actions";
import { Alert } from "@/components/primitives/alert";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import { PLATFORMS, type Platform } from "@/lib/ideas";

// Banner utama + tulis ide kilat (hanya judul; hook bisa ditambah lewat "Ide lengkap").
export function BoardHero({
  defaultPlatform,
  nicheName,
}: {
  defaultPlatform: Platform;
  nicheName: string;
}) {
  const [state, action, pending] = useActionState<IdeaFormState, FormData>(
    createIdea,
    null
  );
  // Dikontrol lewat state supaya isi tidak hilang kalau gagal simpan.
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);

  useEffect(() => {
    if (state?.ok) setTitle("");
  }, [state]);

  return (
    <Card className="flex flex-col justify-between p-6 lg:col-span-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-lime" />
            Studio Workspace
          </span>
          <span className="rounded-full bg-[#f0ecf5] px-4 py-1 text-xs font-semibold text-brand-muted">
            {nicheName}
          </span>
        </div>

        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-5xl xl:text-[64px] xl:leading-[68px]">
          Rencanakan konten{" "}
          <span className="inline-block -rotate-1 rounded-full bg-brand-lime px-3.5 py-1 leading-none">
            visual
          </span>{" "}
          mingguanmu tanpa pusing.
        </h1>

        <p className="max-w-2xl text-brand-muted">
          Arsitektur alur kerja kreator modern. Visualisasikan hook pembuka,
          shot list dinamis, hingga penjadwalan multi-kanal dalam kanvas
          modular.
        </p>
      </div>

      <form action={action} className="mt-6 pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex h-12 min-w-0 flex-1 items-center rounded-2xl bg-brand-bg shadow-inner focus-within:bg-white">
            <Icon
              name="lightbulb"
              className="pointer-events-none absolute left-4 h-5 w-5 text-brand-muted"
            />
            <input
              id="tulis-ide"
              name="title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tulis ide kilat... contoh: '3 Kesalahan UX Checkout Tokopedia'"
              aria-label="Judul ide"
              className="h-full min-w-0 flex-1 bg-transparent pl-12 pr-2 text-sm font-medium outline-none placeholder:text-brand-muted"
            />
            <div className="relative mr-2 shrink-0">
              <select
                name="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                aria-label="Platform"
                className="h-8 cursor-pointer appearance-none rounded-full bg-white pl-3.5 pr-8 text-xs font-bold outline-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-muted"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-brand-lime px-6 text-sm font-bold shadow-card transition hover:brightness-105 active:scale-95 disabled:opacity-60"
          >
            <Icon name="plus" className="h-5 w-5" />
            {pending ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
        {state?.error && <Alert className="mt-3">{state.error}</Alert>}
      </form>
    </Card>
  );
}