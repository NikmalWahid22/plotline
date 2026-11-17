import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Masuk | Plotline" };

// Membaca ?mode=daftar dari tombol "Daftar" di landing page.
async function AuthSection({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <AuthCard initialMode={mode === "daftar" ? "daftar" : "masuk"} />;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel kiri: hanya tampil di layar lebar */}
      <section className="hidden flex-col justify-between gap-6 p-6 lg:flex xl:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-ink font-extrabold text-brand-lime">
            P
          </span>
          <span className="text-2xl font-extrabold tracking-tight">plotline</span>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl">
            Plan content that actually gets{" "}
            <span className="inline-block rounded-full bg-brand-lime px-4 py-1 align-baseline leading-none">
              made.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-base text-brand-muted">
            Satu papan untuk ide, hook, script, shot list, dan jadwal konten
            kreator tech dan creative.
          </p>

          {/* Dua kartu contoh */}
          <div className="mt-6 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-card border border-brand-border bg-white p-4 shadow-card">
              <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-semibold">
                Contoh, TikTok
              </span>
              <p className="mt-3 text-xs text-brand-muted">Hook</p>
              <p className="text-sm font-bold">
                &ldquo;Stop scrolling kalau lo...&rdquo;
              </p>
            </div>
            <div className="rounded-card border border-brand-border bg-white p-4 shadow-card">
              <span className="rounded-full bg-brand-purple px-3 py-1 text-xs font-semibold text-white">
                Contoh, Scene 02
              </span>
              <p className="mt-3 text-xs text-brand-muted">Arahan visual</p>
              <p className="text-sm font-bold">Over-the-shoulder shot</p>
            </div>
          </div>

          {/* Kartu hitam */}
          <div className="mt-3 flex max-w-xl items-center gap-3 rounded-card bg-brand-ink p-3 pr-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-lime text-sm font-extrabold text-brand-ink">
              AI
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">Workflow Creator Solo</p>
              <p className="text-xs text-white/60">
                Dari ide kasar jadi jadwal tayang, satu papan.
              </p>
            </div>
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 shrink-0 text-brand-lime"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m8 12.5 3 3 5-6" />
            </svg>
          </div>
        </div>

        {/* Keterangan bawah: platform yang didukung */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-bg bg-brand-purple text-[10px] font-bold text-white">
              YT
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-bg bg-brand-sky text-[10px] font-bold">
              IG
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-bg bg-brand-lime text-[10px] font-bold">
              TK
            </span>
          </div>
          <p className="text-sm text-brand-muted">
            Untuk kreator{" "}
            <span className="font-bold text-brand-ink">
              TikTok, Reels, dan YouTube
            </span>
          </p>
        </div>
      </section>

      {/* Panel kanan: kartu login */}
      <section className="flex items-center justify-center p-4 lg:p-6">
        <Suspense fallback={<AuthCard />}>
          <AuthSection searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}