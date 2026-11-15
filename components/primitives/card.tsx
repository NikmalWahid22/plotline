import { cn } from "@/lib/utils";

// Kartu bergaya bento: tanpa garis tepi, hanya bayangan lembut (shadow-card di globals.css).
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-card bg-white shadow-card", className)}
      {...props}
    />
  );
}