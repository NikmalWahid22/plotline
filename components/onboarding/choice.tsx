import type { Option } from "@/lib/profile";

// Kartu pilihan. Dipakai untuk niche, platform, dan frekuensi.
export function Choice({
  option,
  selected,
  onSelect,
}: {
  option: Option;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative rounded-2xl border p-4 text-left transition duration-150 hover:-translate-y-0.5 ${
        selected
          ? "border-brand-ink bg-brand-lime/25"
          : "border-brand-border bg-white hover:bg-brand-bg"
      }`}
    >
      <span className="block font-bold">{option.label}</span>
      {option.desc && (
        <span className="mt-0.5 block text-sm text-brand-muted">{option.desc}</span>
      )}
      {selected && (
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-ink text-[11px] font-bold text-brand-lime"
        >
          ✓
        </span>
      )}
    </button>
  );
}
