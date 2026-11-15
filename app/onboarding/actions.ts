"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { FREQUENCIES, NICHES } from "@/lib/profile";
import { isPlatform } from "@/lib/ideas";

export type OnboardingState = { error?: string } | null;

const hasValue = (list: { value: string }[], v: string) =>
  list.some((o) => o.value === v);

export async function saveOnboarding(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const niche = String(formData.get("niche") ?? "");
  const platforms = [...new Set(formData.getAll("platforms").map(String))];
  const frequency = String(formData.get("frequency") ?? "");

  // Validasi di server: jangan percaya data dari browser.
  if (!hasValue(NICHES, niche)) return { error: "Pilih niche dulu." };
  if (platforms.length === 0 || !platforms.every(isPlatform)) {
    return { error: "Pilih minimal satu platform." };
  }
  if (!hasValue(FREQUENCIES, frequency)) {
    return { error: "Pilih frekuensi posting." };
  }

  const { supabase, userId } = await requireUser();

  // upsert: aman walaupun baris profil belum ada. RLS tetap membatasi ke baris user ini.
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    niche,
    platforms,
    posting_frequency: frequency,
    onboarded: true,
  });

  if (error) return { error: "Gagal menyimpan. Coba lagi sebentar." };

  redirect("/dashboard");
}

export async function skipOnboarding() {
  const { supabase, userId } = await requireUser();
  await supabase.from("profiles").upsert({ id: userId, onboarded: true });
  redirect("/dashboard");
}
