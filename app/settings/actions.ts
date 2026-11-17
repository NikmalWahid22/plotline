"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { FREQUENCIES, NICHES } from "@/lib/profile";
import { isPlatform } from "@/lib/ideas";

export type SettingsState = { error?: string; ok?: boolean } | null;
export type DeleteState = { error?: string; done?: boolean } | null;

const hasValue = (list: { value: string }[], v: string) =>
  list.some((o) => o.value === v);

export async function updateProfile(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
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
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    niche,
    platforms,
    posting_frequency: frequency,
    onboarded: true,
  });

  if (error) return { error: "Gagal menyimpan. Coba lagi sebentar." };

  // Niche dipakai di Papan, Generate, dan Script.
  revalidatePath("/", "layout");
  return { ok: true };
}

// Hapus semua ide milik user ini (script ikut terhapus). Tidak bisa dibatalkan.
export async function deleteAllIdeas(
  _prev: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "HAPUS") {
    return { error: 'Ketik "HAPUS" untuk melanjutkan.' };
  }

  const { supabase } = await requireUser();
  // RLS membatasi ke baris milik user ini. Filter ini hanya syarat dari API delete.
  const { error } = await supabase
    .from("ideas")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) return { error: "Gagal menghapus. Coba lagi sebentar." };

  revalidatePath("/", "layout");
  return { done: true };
}