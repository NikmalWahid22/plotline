"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveGeneratedIdea } from "@/app/generate/actions";
import { Card } from "@/components/primitives/card";
import type { IdeaDraft, Platform } from "@/lib/ideas";
import { CompactDraft, FeaturedDraft, type ItemState } from "./draft-card";

export function Results({
  ideas,
  platform,
}: {
  ideas: IdeaDraft[];
  platform: Platform;
}) {
  const router = useRouter();
  const [items, setItems] = useState<ItemState[]>(() =>
    ideas.map(() => ({ status: "idle" }))
  );

  function update(i: number, patch: ItemState) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? patch : it)));
  }

  // Simpan satu ide ke papan. Mengembalikan id-nya, atau null kalau gagal.
  async function save(i: number): Promise<string | null> {
    const cur = items[i];
    if (cur.status === "saved" && cur.id) return cur.id;
    if (cur.status === "saving") return null;

    update(i, { status: "saving" });
    const res = await saveGeneratedIdea({ ...ideas[i], platform });
    if (res.id) {
      update(i, { status: "saved", id: res.id });
      return res.id;
    }
    update(i, { status: "idle", error: res.error ?? "Gagal menyimpan." });
    return null;
  }

  // Simpan (kalau belum), lalu buka halaman detail untuk membuat script.
  async function develop(i: number) {
    const id = await save(i);
    if (id) router.push(`/ideas/${id}`);
  }

  async function saveAll() {
    await Promise.all(
      ideas.map((_, i) => (items[i].status === "idle" ? save(i) : null))
    );
  }

  const allSaved = items.every((it) => it.status === "saved");
  const anySaving = items.some((it) => it.status === "saving");

  const cardProps = (i: number) => ({
    draft: ideas[i],
    platform,
    item: items[i],
    onSave: () => void save(i),
    onDevelop: () => void develop(i),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-full bg-white px-5 py-2.5 shadow-card">
        <div className="flex items-center gap-2">
          <h2 className="font-bold tracking-tight">Hasil Kurasi</h2>
          <span className="rounded-full bg-brand-bg px-2.5 py-0.5 text-xs font-semibold text-brand-muted">
            {ideas.length} ide
          </span>
        </div>
        <button
          type="button"
          onClick={() => void saveAll()}
          disabled={allSaved || anySaving}
          className="flex items-center gap-1.5 rounded-full bg-brand-bg px-3.5 py-1.5 text-xs font-bold transition-colors hover:bg-brand-border disabled:cursor-not-allowed disabled:opacity-50"
        >
          {allSaved ? "Semua tersimpan ✓" : anySaving ? "Menyimpan..." : "Simpan Semua"}
        </button>
      </div>

      <FeaturedDraft {...cardProps(0)} index={1} total={ideas.length} />

      {ideas.length > 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {ideas.slice(1).map((_, k) => (
            <CompactDraft key={k + 1} {...cardProps(k + 1)} />
          ))}
        </div>
      )}

      <p className="text-xs text-brand-muted">
        Ide dibuat oleh AI. Cek dan sesuaikan dulu sebelum dipakai.
      </p>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="h-12 animate-pulse rounded-full bg-white shadow-card" />
      <Card className="h-72 animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((n) => (
          <Card key={n} className="h-48 animate-pulse" />
        ))}
      </div>
    </div>
  );
}