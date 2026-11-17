import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireOnboardedUser } from "@/lib/auth";
import { getRemainingQuota } from "@/lib/quota";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsView } from "@/components/settings/settings-view";
import { isPlatform } from "@/lib/ideas";

export const metadata: Metadata = { title: "Pengaturan | Plotline" };

function SettingsSkeleton() {
  return (
    <AppShell current="settings">
      <div className="h-40 animate-pulse rounded-card bg-white" />
      <div className="mt-6 h-96 animate-pulse rounded-card bg-white" />
    </AppShell>
  );
}

async function SettingsContent() {
  await connection();
  const { supabase, email, profile } = await requireOnboardedUser();

  const [remaining, ideas, scripts, scheduled] = await Promise.all([
    getRemainingQuota(supabase),
    supabase.from("ideas").select("id", { count: "exact", head: true }),
    supabase.from("scripts").select("id", { count: "exact", head: true }),
    supabase
      .from("ideas")
      .select("id", { count: "exact", head: true })
      .not("scheduled_at", "is", null),
  ]);

  return (
    <AppShell current="settings" email={email}>
      <SettingsView
        email={email}
        remaining={remaining}
        ideaCount={ideas.count ?? 0}
        scriptCount={scripts.count ?? 0}
        scheduledCount={scheduled.count ?? 0}
        initial={{
          niche: profile.niche ?? "",
          platforms: (profile.platforms ?? []).filter(isPlatform),
          frequency: profile.posting_frequency ?? "",
        }}
      />
    </AppShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  );
}