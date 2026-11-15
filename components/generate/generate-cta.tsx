import Link from "next/link";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";

// Strip di bawah halaman Generate: ajakan ke Papan Visual.
export function GenerateCta() {
  return (
    <Card className="flex flex-col items-stretch justify-between gap-5 p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-lime">
          <Icon name="board" className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-bold tracking-tight">
            Alirkan ide langsung ke Papan Visual
          </h3>
          <p className="text-sm font-medium text-brand-muted">
            Ide yang kamu simpan otomatis masuk kolom Ide &amp; Riset di papan konten.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-brand-ink px-5 text-sm font-bold text-white transition hover:bg-brand-ink/90"
      >
        Buka Papan Visual
        <Icon name="external" className="h-4 w-4" />
      </Link>
    </Card>
  );
}