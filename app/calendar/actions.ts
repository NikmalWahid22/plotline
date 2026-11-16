"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isDateKey, toScheduledAt } from "@/lib/dates";

export type ActionResult = { error?: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// date = YYYY-MM-DD untuk menjadwalkan, null untuk melepas jadwal.
export async function scheduleIdea(
  id: string,
  date: string | null
): Promise<ActionResult> {
  if (!UUID_RE.test(id)) return { error: "Ide tidak valid." };
  if (date !== null && !isDateKey(date)) return { error: "Tanggal tidak valid." };

  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("ideas")
    .update({ scheduled_at: date ? toScheduledAt(date) : null })
    .eq("id", id);

  if (error) return { error: "Gagal mengatur jadwal. Coba lagi." };

  revalidatePath("/calendar");
  revalidatePath("/dashboard");
  return {};
}