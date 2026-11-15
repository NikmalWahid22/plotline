// Pilihan profil (niche dan frekuensi posting).
// Dipakai oleh onboarding, validasi di server, dan prompt AI.

export type Option = { value: string; label: string; desc?: string };

export const NICHES: Option[] = [
  { value: "coding", label: "Coding", desc: "Tutorial, build in public, tips dev" },
  { value: "ui_design", label: "UI Design", desc: "Redesign, UI/UX, desain web" },
  { value: "motion", label: "Motion", desc: "Animasi, video editing, VFX" },
  { value: "gadgets", label: "Gadget", desc: "Review dan unboxing perangkat" },
  { value: "other", label: "Lainnya", desc: "Tech dan creative di luar itu" },
];

export const FREQUENCIES: Option[] = [
  { value: "1-2", label: "1-2 konten per minggu", desc: "Santai" },
  { value: "3-4", label: "3-4 konten per minggu", desc: "Rutin" },
  { value: "5+", label: "5+ konten per minggu", desc: "Intens" },
];

// Nama niche untuk prompt AI dan tampilan.
// Niche "Lainnya" atau kosong jadi "Tech dan creative".
export function nicheLabel(niche: string | null | undefined): string {
  const found = NICHES.find((n) => n.value === niche);
  if (!found || found.value === "other") return "Tech dan creative";
  return found.label;
}
