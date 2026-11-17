import type { IconName } from "@/components/primitives/icon";

// Ikon untuk pilihan profil. Dipakai onboarding dan pengaturan.
export const NICHE_ICON: Record<string, IconName> = {
  coding: "screen",
  ui_design: "tune",
  motion: "film",
  gadgets: "phone",
  other: "sparkles",
};

export const PLATFORM_ICON: Record<string, IconName> = {
  tiktok: "phone",
  reels: "phone",
  youtube_shorts: "play",
  youtube_long: "screen",
};

export const FREQUENCY_ICON: Record<string, IconName> = {
  "1-2": "calendar",
  "3-4": "calendar",
  "5+": "bolt",
};