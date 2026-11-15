import { cn } from "@/lib/utils";

type Tone = "neutral" | "sky" | "purple" | "lime";

const TONES: Record<Tone, string> = {
  neutral: "border border-brand-border bg-brand-bg text-brand-muted",
  sky: "bg-brand-sky text-brand-ink",
  purple: "bg-brand-purple text-white",
  lime: "bg-brand-lime text-brand-ink",
};

export function Chip({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-0.5 text-xs font-semibold",
        TONES[tone],
        className
      )}
      {...props}
    />
  );
}
