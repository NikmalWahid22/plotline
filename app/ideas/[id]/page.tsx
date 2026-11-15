import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { requireOnboardedUser } from "@/lib/auth";
import { getRemainingQuota } from "@/lib/quota";
import { nicheLabel } from "@/lib/profile";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/primitives/card";
import { ScriptPanel } from "@/components/script/script-panel";
import { isPlatform, isStatus } from "@/lib/ideas";
import { sanitizeScript } from "@/lib/scripts";

export const metadata: Metadata = { title: "Script | Plotline" };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Skeleton() {
  return (
    <AppShell current="script">
      <Card className="h-64 animate-pulse" />
    </AppShell>
  );
}

async function IdeaContent({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const { supabase, email, profile } = await requireOnboardedUser();

  // Tiga pertanyaan ke database dijalankan bersamaan, bukan berurutan.
  // RLS: ide milik user lain tidak akan ditemukan.
  const [{ data: idea }, { data: row }, remaining] = await Promise.all([
    supabase
      .from("ideas")
      .select("id, title, hook, platform, status")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("scripts")
      .select("scenes, shots, thumbnail_ideas")
      .eq("idea_id", id)
      .maybeSingle(),
    getRemainingQuota(supabase),
  ]);
  if (!idea || !isPlatform(idea.platform) || !isStatus(idea.status)) notFound();

  return (
    <AppShell current="script" email={email}>
      <ScriptPanel
        idea={{
          id: idea.id,
          title: idea.title,
          hook: idea.hook,
          platform: idea.platform,
          status: idea.status,
        }}
        nicheName={nicheLabel(profile.niche)}
        initialScript={row ? sanitizeScript(row) : null}
        initialRemaining={remaining}
      />
    </AppShell>
  );
}

export default function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <IdeaContent params={params} />
    </Suspense>
  );
}