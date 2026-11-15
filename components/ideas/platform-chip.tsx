import { Icon, type IconName } from "@/components/primitives/icon";
import { PLATFORMS, type Platform } from "@/lib/ideas";

const STYLE: Record<Platform, { icon: IconName; tone: string }> = {
  tiktok: { icon: "phone", tone: "bg-brand-sky" },
  reels: { icon: "phone", tone: "bg-brand-sky" },
  youtube_shorts: { icon: "play", tone: "bg-brand-bg" },
  youtube_long: { icon: "screen", tone: "bg-[#f0ecf5]" },
};

// Chip platform dengan ikon, warna mengikuti jenis platform.
export function PlatformChip({ platform }: { platform: Platform }) {
  const { icon, tone } = STYLE[platform];
  const label = PLATFORMS.find((p) => p.value === platform)?.fullLabel ?? platform;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
    >
      <Icon name={icon} className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}