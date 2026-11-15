import { PLATFORMS, type Platform } from "@/lib/ideas";

// Pilihan platform berbentuk chip. Mengirim nilai lewat radio bernama "platform".
export function PlatformPicker({
  value,
  onChange,
}: {
  value: Platform;
  onChange: (value: Platform) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-bold">Platform</legend>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <label key={p.value} className="cursor-pointer">
            <input
              type="radio"
              name="platform"
              value={p.value}
              checked={value === p.value}
              onChange={() => onChange(p.value)}
              className="peer sr-only"
            />
            <span className="block rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold transition-colors peer-checked:border-brand-ink peer-checked:bg-brand-lime peer-focus-visible:ring-2 peer-focus-visible:ring-brand-ink">
              {p.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
