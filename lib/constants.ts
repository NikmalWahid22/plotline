// Konstanta yang dipakai di client DAN server. Jangan impor kode server ke file ini.

// Batas generate AI per user per hari.
// HARUS sama dengan v_limit di fungsi consume_quota() di supabase/schema.sql.
export const DAILY_LIMIT = 10;

// Semua fitur AI (ide, script) berbagi satu jatah harian yang sama.
export const QUOTA_ACTION = "generate";
