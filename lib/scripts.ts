// Tipe dan validasi script. Bentuknya sama dengan kolom jsonb di tabel `scripts`.

export type Scene = { title: string; voiceover: string; visual: string };
export type Shot = {
  scene: number;
  type: string;
  description: string;
  // Sudah diambil gambarnya (dicentang user di halaman script).
  done: boolean;
};

export type Script = {
  scenes: Scene[];
  shots: Shot[];
  thumbnail_ideas: string[];
};

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// Merapikan data mentah (dari AI atau database) jadi bentuk yang pasti aman dipakai UI.
export function sanitizeScript(raw: unknown): Script | null {
  const r = (raw ?? {}) as Record<string, unknown>;

  const scenes: Scene[] = (Array.isArray(r.scenes) ? r.scenes : [])
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return {
        title: str(o.title, 120),
        voiceover: str(o.voiceover, 800),
        visual: str(o.visual, 400),
      };
    })
    .filter((s) => s.title || s.voiceover)
    .slice(0, 12);

  const shots: Shot[] = (Array.isArray(r.shots) ? r.shots : [])
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      const scene = Number(o.scene);
      return {
        scene: Number.isInteger(scene) && scene > 0 ? scene : 1,
        type: str(o.type, 60),
        description: str(o.description, 300),
        done: o.done === true,
      };
    })
    .filter((s) => s.description)
    .slice(0, 30);

  const thumbnail_ideas = (Array.isArray(r.thumbnail_ideas) ? r.thumbnail_ideas : [])
    .map((t) => str(t, 200))
    .filter(Boolean)
    .slice(0, 5);

  if (scenes.length === 0) return null;
  return { scenes, shots, thumbnail_ideas };
}