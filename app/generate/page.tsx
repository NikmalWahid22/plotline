import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireOnboardedUser } from "@/lib/auth";
import { getRemainingQuota } from "@/lib/quota";
import { nicheLabel } from "@/lib/profile";
import { AppShell } from "@/components/layout/app-shell";
import { Generator } from "@/components/generate/generator";
import { GenerateHero } from "@/components/generate/generate-hero";
import { isPlatform, type Platform } from "@/lib/ideas";

export const metadata: Metadata = { title: "Generate ide | Plotline" };

function GenerateSkeleton() {
  return (
    <AppShell current="generate">
      <GenerateHero remaining={null} />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="h-96 animate-pulse rounded-card border border-brand-border bg-white" />
        <div className="h-96 animate-pulse rounded-card border border-brand-border bg-white/50" />
      </div>
    </AppShell>
  );
}

// Bagian yang butuh data per-request (sesi, profil, sisa kuota)
async function GenerateContent({
  searchParams,
}: {
  searchParams: Promise<{ topik?: string }>;
}) {
  await connection();
  const { topik } = await searchParams;
  const { supabase, email, profile } = await requireOnboardedUser();
  const remaining = await getRemainingQuota(supabase);

  // Platform awal: pilihan pertama dari onboarding, kalau valid.
  const first = profile.platforms?.[0] ?? "";
  const defaultPlatform: Platform = isPlatform(first) ? first : "tiktok";

  return (
    <AppShell current="generate" email={email}>
      <GenerateHero remaining={remaining} />
      <Generator
        nicheName={nicheLabel(profile.niche)}
        defaultPlatform={defaultPlatform}
        initialRemaining={remaining}
        initialTopic={(topik ?? "").trim().slice(0, 200)}
      />
    </AppShell>
  );
}

export default function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ topik?: string }>;
}) {
  return (
    <Suspense fallback={<GenerateSkeleton />}>
      <GenerateContent searchParams={searchParams} />
    </Suspense>
  );
}