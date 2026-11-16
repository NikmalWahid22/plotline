"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";

// Jatah reset tengah malam WIB (UTC+7, tanpa DST).
function timeUntilReset(): string {
  const DAY = 86_400_000;
  const WIB = 7 * 3_600_000;
  const left = DAY - ((Date.now() + WIB) % DAY);
  const hours = Math.floor(left / 3_600_000);
  const minutes = Math.max(1, Math.ceil((left % 3_600_000) / 60_000));
  if (minutes === 60) return `${hours + 1} jam`;
  return hours > 0 ? `${hours} jam ${minutes} menit` : `${minutes} menit`;
}

const NEXT_STEPS: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: "/dashboard#tulis-ide", icon: "notes", title: "Tulis ide manual", text: "Catat ide kilat tanpa AI" },
  { href: "/dashboard", icon: "board", title: "Rapikan Papan", text: "Geser ide ke tahap berikutnya" },
  { href: "/calendar", icon: "calendar", title: "Atur jadwal tayang", text: "Tempatkan ide di hari yang pas" },
];

// Tampil di panel hasil saat jatah generate harian habis.
export function QuotaExhausted() {
  // Dihitung setelah tampil di browser supaya tidak beda dengan hasil render server.
  const [wait, setWait] = useState<string | null>(null);

  useEffect(() => {
    setWait(timeUntilReset());
    const t = setInterval(() => setWait(timeUntilReset()), 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div role="status" className="rounded-card bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          Batas Generate Tercapai
        </span>
        <span className="text-xs font-semibold text-brand-muted">Paket Gratis • Limit Harian</span>
      </div>

      <p className="mt-5 font-bold">
        Batas harian kamu sudah tercapai{" "}
        <span className="text-red-600">(0/{DAILY_LIMIT} tersisa)</span>
      </p>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-muted">
        Jatah AI dibatasi {DAILY_LIMIT} generate per hari supaya layanan gratis ini tetap jalan.
        Jatah direset otomatis setiap tengah malam WIB. Sambil menunggu, idemu yang sudah ada
        tetap bisa dirapikan.
      </p>

      {/* Pemakaian jatah */}
      <div className="mt-5 rounded-2xl bg-brand-bg p-4">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 font-bold">
            <Icon name="tune" className="h-4 w-4" />
            Konsumsi Kuota Hari Ini
          </span>
          <span className="font-extrabold">
            {DAILY_LIMIT} / {DAILY_LIMIT} Terpakai (100%)
          </span>
        </div>
        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-brand-border"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={DAILY_LIMIT}
          aria-valuenow={DAILY_LIMIT}
          aria-label="Kuota harian terpakai"
        >
          <div className="h-full w-full rounded-full bg-red-500" />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-muted">
          <Icon name="timer" className="h-3.5 w-3.5" />
          {wait ? `Reset otomatis dalam ${wait}` : "Reset otomatis tengah malam WIB"}
        </p>
      </div>

      {/* Hal yang masih bisa dikerjakan */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {NEXT_STEPS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-3 rounded-2xl bg-brand-bg p-3 transition hover:bg-brand-border/60"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-lime">
              <Icon name={s.icon} className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight">{s.title}</span>
              <span className="mt-0.5 block text-xs text-brand-muted">{s.text}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href="/dashboard#tulis-ide"
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-lime px-6 text-sm font-bold shadow-card transition hover:brightness-105 active:scale-95"
        >
          <Icon name="plus" className="h-4 w-4" />
          Tulis Ide Manual
        </Link>
        <Link
          href="/dashboard"
          className="flex h-12 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition hover:bg-brand-bg"
        >
          Kelola Ide yang Sudah Ada di Papan
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}