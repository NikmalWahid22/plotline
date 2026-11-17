"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";
import { timeUntilReset } from "@/lib/reset-time";

// Pemakaian jatah AI dan ringkasan isi papan. Semua angka dari data akun ini.
export function UsagePanel({
  remaining,
  ideaCount,
  scriptCount,
  scheduledCount,
}: {
  remaining: number | null;
  ideaCount: number;
  scriptCount: number;
  scheduledCount: number;
}) {
  const [wait, setWait] = useState<string | null>(null);
  useEffect(() => {
    setWait(timeUntilReset());
    const t = setInterval(() => setWait(timeUntilReset()), 30_000);
    return () => clearInterval(t);
  }, []);

  const left = typeof remaining === "number" ? remaining : null;
  const used = left === null ? 0 : DAILY_LIMIT - left;
  const pct = Math.round((used / DAILY_LIMIT) * 100);
  const scriptPct = ideaCount === 0 ? 0 : Math.round((scriptCount / ideaCount) * 100);

  return (
    <section className="rounded-card bg-white p-6 shadow-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-muted">
            <span className="h-2 w-2 rounded-full bg-brand-purple" />
            Siklus Penggunaan AI
          </p>
          <h2 className="mt-1 text-heading">Penggunaan Kuota AI Harian</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Direset setiap pukul 00:00 WIB. Dipakai bersama oleh Generate ide dan Generate script.
          </p>
        </div>
        <span className="flex w-fit items-center gap-2 rounded-full bg-brand-bg px-4 py-2 text-sm">
          <Icon name="timer" className="h-4 w-4" />
          Reset dalam: <b>{wait ?? "tengah malam WIB"}</b>
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {/* Jatah AI */}
        <div className="rounded-2xl bg-brand-bg p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="sparkles" className="h-4 w-4" />
              Jatah AI
            </span>
            <span className="rounded-full bg-brand-lime px-3 py-1 text-xs font-bold">
              {left ?? "–"} Sisa
            </span>
          </div>
          <p className="mt-3 text-sm text-brand-muted">
            <b className="text-xl text-brand-ink">{used}</b> / {DAILY_LIMIT} terpakai hari ini
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-brand-lime" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 flex justify-between text-xs text-brand-muted">
            <span>0</span>
            <span className="font-semibold">{pct}% terpakai</span>
            <span>{DAILY_LIMIT}</span>
          </p>
        </div>

        {/* Script */}
        <div className="rounded-2xl bg-brand-bg p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="notes" className="h-4 w-4" />
              Naskah Script
            </span>
            <span className="text-xs text-brand-muted">{scriptCount} siap</span>
          </div>
          <p className="mt-3 text-sm text-brand-muted">
            <b className="text-xl text-brand-ink">{scriptCount}</b> / {ideaCount} ide sudah punya script
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-brand-purple" style={{ width: `${scriptPct}%` }} />
          </div>
        </div>

        {/* Papan */}
        <div className="rounded-2xl bg-brand-bg p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="kanban" className="h-4 w-4" />
              Isi Papan
            </span>
            <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-bold">Ringkasan</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xl font-bold leading-none">{ideaCount}</p>
              <p className="mt-1 text-xs text-brand-muted">Ide tersimpan</p>
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{scheduledCount}</p>
              <p className="mt-1 text-xs text-brand-muted">Sudah dijadwalkan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}