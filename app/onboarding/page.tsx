import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getProfile, requireUser } from "@/lib/auth";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const metadata: Metadata = { title: "Atur profil | Plotline" };

// Bagian yang butuh data per-request (sesi login dan profil)
async function OnboardingContent() {
  await connection();
  const { supabase, userId } = await requireUser();
  const profile = await getProfile(supabase, userId);

  // Sudah pernah mengisi: langsung ke dashboard.
  if (profile?.onboarded) redirect("/dashboard");

  return <OnboardingForm />;
}

export default function OnboardingPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-xl animate-pulse rounded-card border border-brand-border bg-white" />
        }
      >
        <OnboardingContent />
      </Suspense>
    </main>
  );
}
