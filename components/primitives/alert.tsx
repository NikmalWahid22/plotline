import { cn } from "@/lib/utils";

export function Alert({
  tone = "error",
  className,
  ...props
}: React.ComponentProps<"p"> & { tone?: "error" | "info" }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-2.5 text-sm",
        tone === "error" ? "bg-red-50 text-red-700" : "bg-brand-sky text-brand-ink",
        className
      )}
      {...props}
    />
  );
}
