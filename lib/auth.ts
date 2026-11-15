// Pengecekan login di sisi server. Satu tempat, dipakai semua page dan action.
// File ini HANYA boleh diimpor dari kode server.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ServerSupabase = Awaited<ReturnType<typeof createClient>>;

export type Profile = {
  onboarded: boolean;
  niche: string | null;
  platforms: string[] | null;
  posting_frequency: string | null;
};

export type AuthContext = {
  supabase: ServerSupabase;
  userId: string;
  email?: string;
};

// Wajib login. Kalau belum, diarahkan ke /login.
// getClaims() memverifikasi token (jangan diganti getSession() di kode server).
export async function requireUser(): Promise<AuthContext> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) redirect("/login");

  return {
    supabase,
    userId: String(claims.sub),
    email: claims.email ? String(claims.email) : undefined,
  };
}

export async function getProfile(
  supabase: ServerSupabase,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("onboarded, niche, platforms, posting_frequency")
    .eq("id", userId)
    .maybeSingle();

  return (data as Profile | null) ?? null;
}

// Wajib login DAN sudah onboarding. Kalau belum onboarding, diarahkan ke /onboarding.
export async function requireOnboardedUser(): Promise<
  AuthContext & { profile: Profile }
> {
  const ctx = await requireUser();
  const profile = await getProfile(ctx.supabase, ctx.userId);
  if (!profile?.onboarded) redirect("/onboarding");

  return { ...ctx, profile };
}
