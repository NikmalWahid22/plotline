// Label niche. Nilainya sama dengan pilihan di onboarding dan kolom profiles.niche.

const NICHE_LABELS: Record<string, string> = {
  coding: "Coding",
  ui_design: "UI Design",
  motion: "Motion",
  gadgets: "Gadget",
  other: "Tech dan creative",
};

export function nicheLabel(niche: string | null | undefined): string {
  if (!niche) return "Tech dan creative";
  return NICHE_LABELS[niche] ?? "Tech dan creative";
}