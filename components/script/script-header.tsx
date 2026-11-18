"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/primitives/card";
import { Icon, type IconName } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";
import { PLATFORMS, STATUSES, type Platform, type Status } from "@/lib/ideas";
import type { Script } from "@/lib/scripts";

type Props = {
  title: string;
  hook: string | null;
  platform: Platform;
  status: Status;
  nicheName: string;
  script: Script | null;
  remaining: number | null;
  generating: boolean;
  marking: boolean;
  onGenerate: () => void;
  onMarkFilming: () => void;
};

function Tile({ label, value, icon }: { label: string; value: string; icon: IconName }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-brand-bg p-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
          {label}
        </p>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
      <Icon name={icon} className="h-7 w-7 text-brand-muted" />
    </div>
  );
}

const PILL =
  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-bold max-sm:px-2 sm:h-10 sm:px-4 transition-all disabled:cursor-not-allowed disabled:opacity-50";

// Kartu header halaman script: navigasi, info ide, tombol aksi, dan ringkasan angka.
export function ScriptHeader(p: Props) {
  const [copied, setCopied] = useState(false);

  const platformName = PLATFORMS.find((x) => x.value === p.platform)?.fullLabel ?? p.platform;
  const statusName = STATUSES.find((x) => x.value === p.status)?.label ?? p.status;
  const outOfQuota = p.remaining === 0;

  async function copyScript() {
    if (!p.script) return;
    const text = p.script.scenes
      .map((s, i) => `[SCENE ${i + 1}: ${s.title.toUpperCase()}]\n${s.voiceover}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard tidak tersedia: abaikan saja.
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-4 sm:gap-4 sm:p-6">
      {/* Baris atas: kembali + chip info */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-bg px-4 py-1.5 text-sm font-bold transition-colors hover:bg-brand-border"
        >
          <Icon name="back" className="h-[18px] w-[18px]" />
          <span>
            Kembali<span className="hidden sm:inline"> ke Papan</span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <span className="hidden items-center gap-1.5 rounded-full bg-brand-bg px-3 py-1 text-xs font-semibold text-brand-muted sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-brand-purple" />
            Niche: {p.nicheName}
          </span>
          <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-semibold">
            {platformName}
          </span>
          <span className="rounded-full bg-brand-lime px-3 py-1 text-xs font-semibold">
            <span className="hidden sm:inline">Status: </span>
            {statusName}
          </span>
        </div>
      </div>

      {/* Judul + aksi */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl space-y-1.5">
          <p className="hidden flex-wrap items-center gap-2 sm:flex">
            <span className="rounded-full bg-brand-lime px-3.5 py-1 text-xs font-semibold">
              Shot List
            </span>
            <span className="text-sm font-medium text-brand-muted">
              terstruktur per scene, siap dibawa syuting.
            </span>
          </p>
          <h1 className="text-[22px] font-bold leading-[28px] tracking-[-0.015em] sm:text-4xl sm:leading-[42px] sm:tracking-[-0.02em]">
            Script: {p.title}
          </h1>
          {p.hook && (
            <p className="line-clamp-2 text-sm text-brand-muted sm:line-clamp-none sm:text-base">&ldquo;{p.hook}&rdquo;</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {p.script && (
            <button
              type="button"
              onClick={() => void copyScript()}
              className={`${PILL} bg-brand-bg hover:bg-brand-border max-sm:flex-1 max-sm:justify-center`}
            >
              <Icon name="copy" className="h-[18px] w-[18px]" />
              {copied ? "Tersalin" : "Salin Script"}
            </button>
          )}

          <button
            type="button"
            onClick={p.onGenerate}
            disabled={p.generating || outOfQuota}
            className={`${PILL} ${
              p.script
                ? "bg-brand-bg hover:bg-brand-border max-sm:flex-1 max-sm:justify-center"
                : "bg-brand-lime shadow-card hover:brightness-105 max-sm:w-full max-sm:justify-center"
            }`}
          >
            <Icon name="bolt" className="h-[18px] w-[18px]" />
            {p.generating
              ? "Lagi nulis script..."
              : outOfQuota
                ? "Jatah habis"
                : p.script
                  ? "Buat Ulang"
                  : "Generate Script"}
          </button>

          {p.script && p.status === "idea" && (
            <button
              type="button"
              onClick={p.onMarkFilming}
              disabled={p.marking}
              className={`${PILL} bg-brand-lime px-6 shadow-card hover:brightness-105 active:scale-95 max-sm:order-first max-sm:w-full max-sm:justify-center`}
            >
              <Icon name="film" className="h-[18px] w-[18px]" />
              {p.marking ? "Memindahkan..." : "Tandai Siap Syuting"}
            </button>
          )}
        </div>
      </div>

      {/* Ringkasan angka asli dari script */}
      <p className="text-xs font-semibold text-brand-muted sm:hidden">
        {p.script
          ? `${p.script.scenes.length} scene · ${p.script.shots.length} shot · ${p.script.thumbnail_ideas.length} thumbnail · `
          : ""}
        Jatah {typeof p.remaining === "number" ? `${p.remaining}/${DAILY_LIMIT}` : "–"}
      </p>
      <div className="hidden grid-cols-2 gap-2 pt-1 sm:grid md:grid-cols-4">
        <Tile label="Jumlah Scene" value={p.script ? String(p.script.scenes.length) : "–"} icon="notes" />
        <Tile label="Jumlah Shot" value={p.script ? String(p.script.shots.length) : "–"} icon="film" />
        <Tile label="Ide Thumbnail" value={p.script ? String(p.script.thumbnail_ideas.length) : "–"} icon="image" />
        <Tile
          label="Sisa Jatah AI"
          value={typeof p.remaining === "number" ? `${p.remaining}/${DAILY_LIMIT}` : "–"}
          icon="bolt"
        />
      </div>
    </Card>
  );
}