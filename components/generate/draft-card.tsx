"use client";

import Link from "next/link";
import { useState } from "react";
import { PlatformChip } from "@/components/ideas/platform-chip";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";
import type { IdeaDraft, Platform } from "@/lib/ideas";

export type ItemState = {
  status: "idle" | "saving" | "saved";
  id?: string;
  error?: string;
};

type CardProps = {
  draft: IdeaDraft;
  platform: Platform;
  item: ItemState;
  onSave: () => void;
  onDevelop: () => void;
};

function SavedLink() {
  return (
    <Link
      href="/dashboard"
      className="text-xs font-semibold text-brand-muted underline-offset-4 hover:text-brand-ink hover:underline"
    >
      Lihat papan
    </Link>
  );
}

// Kartu utama (ide pertama): besar, dengan kotak hook dan dua tombol aksi.
export function FeaturedDraft({
  draft,
  platform,
  item,
  onSave,
  onDevelop,
  index,
  total,
}: CardProps & { index: number; total: number }) {
  const [copied, setCopied] = useState(false);
  const busy = item.status === "saving";
  const saved = item.status === "saved";

  async function copyHook() {
    try {
      await navigator.clipboard.writeText(draft.hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard tidak tersedia: abaikan saja.
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between gap-2">
        <PlatformChip platform={platform} />
        <span className="text-xs font-semibold text-brand-muted">
          Ide {index} dari {total}
        </span>
      </div>

      <h3 className="text-2xl font-extrabold leading-tight tracking-tight">
        {draft.title}
      </h3>

      {draft.hook && (
        <div className="rounded-2xl bg-brand-bg p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              <Icon name="timer" className="h-3.5 w-3.5" />
              Hook 3 detik pembuka:
            </p>
            <button
              type="button"
              onClick={copyHook}
              aria-label="Salin hook"
              className="flex items-center gap-1 text-xs font-semibold text-brand-muted transition-colors hover:text-brand-ink"
            >
              {copied ? "Tersalin" : <Icon name="copy" className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-lg font-bold italic leading-snug">
            &ldquo;{draft.hook}&rdquo;
          </p>
        </div>
      )}

      {item.error && (
        <p role="alert" className="text-xs text-red-700">
          {item.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onDevelop}
          disabled={busy}
          className="flex h-10 items-center gap-2 rounded-full bg-brand-lime px-5 text-sm font-bold transition hover:brightness-105 disabled:opacity-60"
        >
          <Icon name="notes" className="h-4 w-4" />
          {busy ? "Menyimpan..." : "Buat Script & Shot List"}
        </button>

        {saved ? (
          <span className="flex items-center gap-3 px-2 text-sm font-bold">
            Tersimpan ✓ <SavedLink />
          </span>
        ) : (
          <button
            type="button"
            onClick={onSave}
            disabled={busy}
            className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-bold shadow-card transition-colors hover:bg-brand-bg disabled:opacity-60"
          >
            <Icon name="bookmark" className="h-4 w-4" />
            Simpan ke Papan
          </button>
        )}
      </div>
    </Card>
  );
}

// Kartu kecil untuk ide kedua dan seterusnya.
export function CompactDraft({ draft, platform, item, onSave, onDevelop }: CardProps) {
  const busy = item.status === "saving";
  const saved = item.status === "saved";

  return (
    <Card className="flex flex-col gap-3 p-5 transition-all duration-200 hover:-translate-y-0.5">
      <PlatformChip platform={platform} />

      <h3 className="text-lg font-bold leading-snug tracking-tight">{draft.title}</h3>

      {draft.hook && (
        <div className="rounded-2xl bg-brand-bg p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
            Hook 3 detik:
          </p>
          <p className="mt-1 text-sm font-bold italic leading-snug">
            &ldquo;{draft.hook}&rdquo;
          </p>
        </div>
      )}

      {item.error && (
        <p role="alert" className="text-xs text-red-700">
          {item.error}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onDevelop}
          disabled={busy}
          className="flex items-center gap-1 text-xs font-bold hover:underline disabled:opacity-60"
        >
          Kembangkan Ide
          <Icon name="arrow" className="h-3.5 w-3.5" />
        </button>

        {saved ? (
          <span className="flex items-center gap-2 text-xs font-bold">
            Tersimpan ✓ <SavedLink />
          </span>
        ) : (
          <button
            type="button"
            onClick={onSave}
            disabled={busy}
            aria-label="Simpan ke papan"
            title="Simpan ke papan"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-bg transition-colors hover:bg-brand-border disabled:opacity-60"
          >
            <Icon name="bookmark" className="h-4 w-4" />
          </button>
        )}
      </div>
    </Card>
  );
}