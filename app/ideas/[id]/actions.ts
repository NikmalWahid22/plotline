"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { nicheLabel } from "@/lib/profile";
import { consumeQuota, getRemainingQuota } from "@/lib/quota";
import { generateScript } from "@/lib/gemini/script";
import { errorCode, userMessage } from "@/lib/gemini/errors";
import { isPlatform } from "@/lib/ideas";
import type { Script } from "@/lib/scripts";

export type ScriptState = {
  error?: string;
  script?: Script;
  remaining?: number | null;
} | null;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Buat (atau buat ulang) script untuk satu ide. Berbagi jatah harian yang sama dengan generate ide.
export async function generateScriptAction(
  ideaId: string
): Promise<ScriptState> {
  if (!UUID_RE.test(ideaId)) return { error: "Ide tidak valid." };

  const { supabase, userId } = await requireUser();

  // RLS: hanya ide milik user ini yang bisa dibaca.
  const { data: idea } = await supabase
    .from("ideas")
    .select("id, title, hook, platform")
    .eq("id", ideaId)
    .maybeSingle();
  if (!idea || !isPlatform(idea.platform)) {
    return { error: "Ide tidak ditemukan." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("niche")
    .eq("id", userId)
    .maybeSingle();

  // Pakai jatah SEBELUM memanggil Gemini (lihat catatan di generateIdeasAction).
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
    const script = await generateScript({
      title: idea.title,
      hook: idea.hook,
      niche: nicheLabel(profile?.niche),
      platform: idea.platform,
    });

    // Satu ide satu script: kalau sudah ada, ditimpa.
    const { error } = await supabase.from("scripts").upsert(
      { idea_id: idea.id, user_id: userId, ...script },
      { onConflict: "idea_id" }
    );
    if (error) {
      console.error("[script] simpan gagal", error.message);
      return {
        error: "Script jadi tapi gagal disimpan. Coba lagi.",
        remaining: await getRemainingQuota(supabase),
      };
    }

    revalidatePath(`/ideas/${idea.id}`);
    return { script, remaining: await getRemainingQuota(supabase) };
  } catch (err) {
    console.error("[gemini]", errorCode(err), err instanceof Error ? err.message : err);
    return { error: userMessage(err), remaining: await getRemainingQuota(supabase) };
  }
}

// Centang atau lepas centang "Ambil Shot". Disimpan di kolom shots (jsonb) milik script.
export async function toggleShotDone(
  ideaId: string,
  index: number,
  done: boolean
): Promise<{ error?: string }> {
  if (!UUID_RE.test(ideaId) || !Number.isInteger(index) || index < 0 || index > 100) {
    return { error: "Data tidak valid." };
  }

  const { supabase } = await requireUser();

  const { data: row } = await supabase
    .from("scripts")
    .select("shots")
    .eq("idea_id", ideaId)
    .maybeSingle();

  const shots = Array.isArray(row?.shots)
    ? ([...row.shots] as Record<string, unknown>[])
    : null;
  if (!shots || index >= shots.length) return { error: "Shot tidak ditemukan." };

  shots[index] = { ...shots[index], done: Boolean(done) };

  const { error } = await supabase
    .from("scripts")
    .update({ shots })
    .eq("idea_id", ideaId);
  if (error) return { error: "Gagal menyimpan centang." };

  return {};
}