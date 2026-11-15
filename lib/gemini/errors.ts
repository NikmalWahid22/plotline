// Jenis error dari Gemini dan pesan yang aman ditampilkan ke user.
// Pesan asli dari API hanya boleh dicatat di terminal server, tidak ke user.

export type GeminiErrorCode =
  | "config"
  | "rate_limit"
  | "model"
  | "timeout"
  | "bad_output"
  | "unavailable";

export class GeminiError extends Error {
  code: GeminiErrorCode;
  constructor(code: GeminiErrorCode, message: string) {
    super(message);
    this.name = "GeminiError";
    this.code = code;
  }
}

// Kegagalan sementara di sisi Google atau jaringan: layak dicoba ulang.
// Timeout sengaja tidak dicoba ulang supaya user tidak menunggu terlalu lama.
export function isOverloaded(err: unknown): boolean {
  if (err instanceof GeminiError) return false;
  const msg = err instanceof Error ? err.message : String(err);
  return /\b50[023]\b|UNAVAILABLE|INTERNAL|overloaded|high demand|fetch failed|ECONNRESET|ETIMEDOUT/i.test(
    msg
  );
}

export function toGeminiError(err: unknown): GeminiError {
  if (err instanceof GeminiError) return err;
  const msg = err instanceof Error ? err.message : String(err);

  // Google kewalahan: tampilkan sebagai "AI lagi ramai".
  if (isOverloaded(err)) return new GeminiError("rate_limit", msg);
  if (/429|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(msg)) {
    return new GeminiError("rate_limit", msg);
  }
  if (/401|403|API key|PERMISSION_DENIED|UNAUTHENTICATED/i.test(msg)) {
    return new GeminiError("config", msg);
  }
  if (/404|NOT_FOUND|not found|not supported/i.test(msg)) {
    return new GeminiError("model", msg);
  }
  return new GeminiError("unavailable", msg);
}

export function errorCode(err: unknown): GeminiErrorCode {
  return err instanceof GeminiError ? err.code : "unavailable";
}

const USER_MESSAGES: Record<GeminiErrorCode, string> = {
  config: "Layanan AI belum dikonfigurasi dengan benar. Coba lagi nanti.",
  model: "Layanan AI belum dikonfigurasi dengan benar. Coba lagi nanti.",
  rate_limit:
    "AI lagi ramai atau batas gratisnya sedang tercapai. Coba lagi beberapa menit lagi.",
  timeout: "AI terlalu lama merespons. Coba lagi.",
  bad_output:
    "Hasil dari AI tidak bisa dibaca. Coba lagi, atau ubah topiknya sedikit.",
  unavailable: "AI sedang tidak tersedia. Coba lagi sebentar.",
};

export function userMessage(err: unknown): string {
  return USER_MESSAGES[errorCode(err)];
}
