"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { nicheLabel } from "@/lib/profile";
import { consumeQuota, getRemainingQuota } from "@/lib/quota";
import { generateIdeas } from "@/lib/gemini/ideas";
import { errorCode, userMessage } from "@/lib/gemini/errors";
import { isPlatform, type IdeaDraft, type Platform } from "@/lib/ideas";
import { isTone } from "@/lib/tones";

export type GenerateState = {
  error?: string;
  ideas?: IdeaDraft[];
  platform?: Platform;
  batch?: string;
  remaining?: number | null;
} | null;

export async function generateIdeasAction(
  _prev: GenerateState,
  formData: FormData
): Promise<GenerateState> {
  const topic = String(formData.get("topic") ?? "").trim();
  const platformRaw = String(formData.get("platform") ?? "");
  const toneRaw = String(formData.get("tone") ?? "");

  // Validasi input di server.
  if (topic.length < 3 || topic.length > 200) {
    return { error: "Topik harus 3 sampai 200 karakter." };
  }
  if (!isPlatform(platformRaw)) return { error: "Pilih platform." };
  if (!isTone(toneRaw)) return { error: "Pilih gaya bahasa." };
  const platform: Platform = platformRaw;

  const { supabase, userId } = await requireUser();

  // Niche dibaca dari database, bukan dari browser.
  const { data: profile } = await supabase
    .from("profiles")
    .select("niche")
    .eq("id", userId)
    .maybeSingle();

  // Pakai jatah SEBELUM memanggil Gemini supaya tidak bisa diakali dengan permintaan paralel.
  // Konsekuensinya: kalau Gemini gagal, jatah tetap terpakai.
  const quota = await consumeQuota(supabase);
  if (quota === "error") {
    return { error: "Gagal memeriksa kuota. Coba lagi sebentar." };
  }
  if (quota === "exhausted") {
    return {
      error: "Jatah generate hari ini sudah habis. Reset tengah malam WIB.",
      remaining: 0,
    };
  }

  try {
    const ideas = await generateIdeas({
      topic,
      niche: nicheLabel(profile?.niche),
      platform,
      tone: toneRaw,
    });
    return {
      ideas,
      platform,
      batch: crypto.randomUUID(),
      remaining: await getRemainingQuota(supabase),
    };
  } catch (err) {
    console.error("[gemini]", errorCode(err), err instanceof Error ? err.message : err);
    return { error: userMessage(err), remaining: await getRemainingQuota(supabase) };
  }
}

// Simpan satu ide hasil generate ke papan.
export async function saveGeneratedIdea(input: {
  title: string;
  hook: string;
  platform: string;
}): Promise<{ id?: string; error?: string }> {
  const title = String(input.title ?? "").trim();
  const hook = String(input.hook ?? "").trim();
  const platform = String(input.platform ?? "");

  if (title.length < 1 || title.length > 200) return { error: "Judul tidak valid." };
  if (hook.length > 500) return { error: "Hook terlalu panjang." };
  if (!isPlatform(platform)) return { error: "Platform tidak valid." };

  const { supabase } = await requireUser();

  // user_id terisi otomatis dari sesi login (default auth.uid()).
  const { data, error } = await supabase
    .from("ideas")
    .insert({ title, hook: hook || null, platform })
    .select("id")
    .single();

  if (error || !data) return { error: "Gagal menyimpan ide. Coba lagi." };

  revalidatePath("/dashboard");
  return { id: String(data.id) };
}