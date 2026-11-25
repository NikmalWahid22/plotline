import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireOnboardedUser } from "@/lib/auth";
import { getRemainingQuota } from "@/lib/quota";
import { nicheLabel } from "@/lib/profile";
import { AppShell } from "@/components/layout/app-shell";
import { Board } from "@/components/board/board";
import { isPlatform, type BoardIdea, type Platform } from "@/lib/ideas";

export const metadata: Metadata = { title: "Papan | Plotline" };

function DashboardSkeleton() {
  return (
    <AppShell current="board">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="h-72 animate-pulse rounded-card bg-white lg:col-span-8" />
        <div className="h-72 animate-pulse rounded-card bg-white lg:col-span-4" />
      </div>
    </AppShell>
  );
}

// Bagian yang butuh data per-request (sesi login, profil, ide)
async function DashboardContent() {
  await connection();
  const { supabase, email, profile } = await requireOnboardedUser();

  // RLS memastikan hanya data milik user ini yang keluar.
  const [{ data: ideas }, { data: scripts }, remaining] = await Promise.all([
    supabase
      .from("ideas")
      .select("id, title, hook, platform, status, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("scripts").select("idea_id, shots"),
    getRemainingQuota(supabase),
  ]);

  // Per ide: apakah punya script, berapa shot, dan berapa yang sudah dicentang.
  const scriptInfo = new Map<string, { total: number; done: number }>();
  for (const s of scripts ?? []) {
    const shots = Array.isArray(s.shots) ? (s.shots as { done?: unknown }[]) : [];
    scriptInfo.set(s.idea_id as string, {
      total: shots.length,
      done: shots.filter((x) => x?.done === true).length,
    });
  }
  const board: BoardIdea[] = (ideas ?? []).map((i) => {
    const info = scriptInfo.get(i.id as string);
    return {
      ...(i as Omit<BoardIdea, "has_script" | "shots_total" | "shots_done">),
      has_script: info !== undefined,
      shots_total: info?.total ?? 0,
      shots_done: info?.done ?? 0,
    };
  });

  const first = profile.platforms?.[0] ?? "";
  const defaultPlatform: Platform = isPlatform(first) ? first : "tiktok";

  return (
    <AppShell current="board" email={email}>
      <Board
        ideas={board}
        defaultPlatform={defaultPlatform}
        remaining={remaining}
        nicheName={nicheLabel(profile.niche)}
      />
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}