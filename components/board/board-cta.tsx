import Link from "next/link";
import { Card } from "@/components/primitives/card";
import { Icon } from "@/components/primitives/icon";

// Strip ajakan di bawah papan: menuju Generate ide.
export function BoardCta() {
  return (
    <Card className="flex flex-col items-stretch justify-between gap-6 p-6 lg:flex-row lg:items-center">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-bg">
          <Icon name="bolt" className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Butuh ide baru untuk minggu ini?
          </h3>
          <p className="text-sm font-medium text-brand-muted">
            Generate 5 ide lengkap dengan hook dari AI, lalu simpan yang cocok ke papan.
          </p>
        </div>
      </div>
      <Link
        href="/generate"
        className="shrink-0 rounded-full bg-brand-lime px-6 py-2 text-center text-sm font-bold shadow-card transition hover:brightness-105"
      >
        Generate ide
      </Link>
    </Card>
  );
}