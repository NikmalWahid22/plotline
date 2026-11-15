// Gaya bahasa untuk ide yang dihasilkan AI. Aman dipakai di client dan server.

export const TONES = [
  { value: "santai", label: "Santai & To-the-point", desc: "Langsung punchline tanpa basa-basi" },
  { value: "storytelling", label: "Storytelling Personal", desc: "Pendekatan studi kasus & refleksi" },
  { value: "kontroversial", label: "Kontroversial Edukatif", desc: "Patahkan mitos umum industri tech" },
] as const;

export type Tone = (typeof TONES)[number]["value"];

export const DEFAULT_TONE: Tone = "santai";

export function isTone(value: string): value is Tone {
  return TONES.some((t) => t.value === value);
}