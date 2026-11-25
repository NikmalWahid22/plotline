// Konstanta dan tipe untuk ide konten. Nilainya HARUS sama dengan batas di tabel `ideas` (supabase/schema.sql).

export const PLATFORMS = [
  { value: "tiktok", label: "TikTok", fullLabel: "TikTok" },
  { value: "reels", label: "Reels", fullLabel: "Instagram Reels" },
  { value: "youtube_shorts", label: "Shorts", fullLabel: "YouTube Shorts" },
  { value: "youtube_long", label: "YouTube", fullLabel: "YouTube" },
] as const;

export const STATUSES = [
  { value: "idea", label: "Ide & Riset" },
  { value: "filming", label: "Syuting" },
  { value: "editing", label: "Edit & Grading" },
  { value: "published", label: "Terbit" },
] as const;

export type Platform = (typeof PLATFORMS)[number]["value"];
export type Status = (typeof STATUSES)[number]["value"];

// Ide yang sudah tersimpan di database.
export type Idea = {
  id: string;
  title: string;
  hook: string | null;
  platform: Platform;
  status: Status;
  created_at: string;
  // Waktu ide masuk ke tahap Terbit (null kalau belum terbit).
  published_at?: string | null;
  // Terisi di halaman papan: apakah ide ini sudah punya script.
  has_script?: boolean;
};

// Ide di papan: ditambah penanda apakah sudah punya script.
// shots_total / shots_done: jumlah shot di script dan yang sudah dicentang "Ambil Shot".
export type BoardIdea = Idea & {
  has_script: boolean;
  shots_total?: number;
  shots_done?: number;
};

// Ide hasil AI yang belum disimpan.
export type IdeaDraft = { title: string; hook: string };

export function isPlatform(value: string): value is Platform {
  return PLATFORMS.some((p) => p.value === value);
}

export function isStatus(value: string): value is Status {
  return STATUSES.some((s) => s.value === value);
}

export function platformLabel(value: string) {
  return PLATFORMS.find((p) => p.value === value)?.label ?? value;
}