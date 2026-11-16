import { Icon, type IconName } from "@/components/primitives/icon";
import type { Option } from "@/lib/profile";

// Kartu pilihan bento. Dipakai untuk niche, platform, dan frekuensi.
export function Choice({
  option,
  icon,
  selected,
  onSelect,
  className = "",
}: {
  option: Option;
  icon: IconName;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col justify-between gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card transition duration-150 hover:-translate-y-0.5 ${
        selected ? "ring-2 ring-brand-ink" : ""
      } ${className}`}
    >
      <span className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            selected ? "bg-brand-ink text-brand-lime" : "bg-brand-bg text-brand-ink"
          }`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            selected ? "bg-brand-lime text-brand-ink" : "bg-brand-bg"
          }`}
        >
          {selected ? (
            <Icon name="check" className="h-3.5 w-3.5" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-brand-muted" />
          )}
        </span>
      </span>

      <span>
        <span className="block font-bold leading-tight">{option.label}</span>
        {option.desc && (
          <span className="mt-1 block text-sm leading-snug text-brand-muted">{option.desc}</span>
        )}
      </span>
    </button>
  );
}