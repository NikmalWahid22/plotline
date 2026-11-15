// Jatah harian untuk fitur AI. Logika sebenarnya ada di database
// (fungsi consume_quota dan get_quota_remaining di supabase/schema.sql).
// File ini HANYA boleh diimpor dari kode server.

import type { ServerSupabase } from "@/lib/auth";
import { QUOTA_ACTION } from "@/lib/constants";

export type QuotaResult = "ok" | "exhausted" | "error";

// Pakai satu jatah. Panggil SEBELUM memanggil AI supaya tidak bisa diakali dengan permintaan paralel.
export async function consumeQuota(
  supabase: ServerSupabase
): Promise<QuotaResult> {
  const { data, error } = await supabase.rpc("consume_quota", {
    p_action: QUOTA_ACTION,
  });
  if (error) return "error";
  return data ? "ok" : "exhausted";
}

// Sisa jatah hari ini, atau null kalau gagal dibaca.
export async function getRemainingQuota(
  supabase: ServerSupabase
): Promise<number | null> {
  const { data } = await supabase.rpc("get_quota_remaining", {
    p_action: QUOTA_ACTION,
  });
  return typeof data === "number" ? data : null;
}
