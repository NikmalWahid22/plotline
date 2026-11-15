"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isPlatform, isStatus } from "@/lib/ideas";

export type IdeaFormState = { error?: string; ok?: boolean } | null;
export type ActionResult = { error?: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createIdea(
  _prev: IdeaFormState,
  formData: FormData
): Promise<IdeaFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const hook = String(formData.get("hook") ?? "").trim();
  const platform = String(formData.get("platform") ?? "");

  if (title.length < 1 || title.length > 200) {
    return { error: "Judul wajib diisi (maksimal 200 karakter)." };
  }
  if (hook.length > 500) return { error: "Hook maksimal 500 karakter." };
  if (!isPlatform(platform)) return { error: "Pilih platform." };

  const { supabase } = await requireUser();

  // user_id terisi otomatis dari sesi login (default auth.uid() di database).
  const { error } = await supabase
    .from("ideas")
    .insert({ title, hook: hook || null, platform });

  if (error) return { error: "Gagal menyimpan ide. Coba lagi sebentar." };

  revalidatePath("/dashboard");
  return { ok: true };
}

export async function moveIdea(
  id: string,
  status: string
): Promise<ActionResult> {
  if (!UUID_RE.test(id)) return { error: "Ide tidak valid." };
  if (!isStatus(status)) return { error: "Status tidak valid." };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("ideas").update({ status }).eq("id", id);

  if (error) return { error: "Gagal memindahkan ide." };

  revalidatePath("/dashboard");
  return {};
}

export async function deleteIdea(id: string): Promise<ActionResult> {
  if (!UUID_RE.test(id)) return { error: "Ide tidak valid." };

  const { supabase } = await requireUser();
  const { error } = await supabase.from("ideas").delete().eq("id", id);

  if (error) return { error: "Gagal menghapus ide." };

  revalidatePath("/dashboard");
  return {};
}
