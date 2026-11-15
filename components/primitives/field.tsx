import { cn } from "@/lib/utils";

const BASE =
  "w-full rounded-2xl border border-brand-border bg-white outline-none transition-colors placeholder:text-brand-muted focus:border-brand-ink";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label className={cn("mb-1.5 block text-sm font-bold", className)} {...props} />
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(BASE, "h-11 px-4", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea className={cn(BASE, "resize-none px-4 py-3", className)} {...props} />
  );
}
