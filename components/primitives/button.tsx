import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-lime text-brand-ink hover:brightness-95",
  secondary: "border border-brand-border bg-white hover:bg-brand-bg",
};

const SIZES: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-11 px-6",
  lg: "h-12 px-6",
};

type Props = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-full font-bold transition duration-150 disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
}
