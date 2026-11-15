import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { Board } from "@/components/board/board";
import type { Idea } from "@/lib/ideas";

export const metadata: Metadata = { title: "Papan | Plotline" };

function Shell({
  email,
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink font-extrabold text-brand-lime">
            P
          </span>
          <span className="text-2xl font-extrabold tracking-tight">plotline</span>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-brand-muted sm:inline">{email}</span>
          )}
          <form action={signOut}>
            <button className="h-10 rounded-full border border-brand-border bg-white px-5 text-sm font-bold transition-colors hover:bg-brand-bg">
              Keluar
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}

// Kerangka sementara selama data dimuat
function DashboardSkeleton() {
  return (
    <Shell>
      <div className="h-9 w-56 animate-pulse rounded-full bg-brand-border" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-64 animate-pulse rounded-card border border-brand-border bg-white/50"
          />
        ))}
      </div>
    </Shell>
  );
}

// Bagian yang butuh data per-request (sesi login, profil, ide)
async function DashboardContent() {
  await connection();

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarded")
    .eq("id", String(claims.sub))
    .maybeSingle();

  if (!profile?.onboarded) redirect("/onboarding");

  // RLS memastikan hanya ide milik user ini yang keluar.
  const { data: ideas } = await supabase
    .from("ideas")
    .select("id, title, hook, platform, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <Shell email={claims.email ? String(claims.email) : undefined}>
      <Board ideas={(ideas ?? []) as Idea[]} />
    </Shell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}