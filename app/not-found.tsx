import type { Metadata } from "next";
import Link from "next/link";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

export const metadata: Metadata = { title: "Halaman tidak ditemukan | Plotline" };

// Tampil untuk alamat yang salah, dan untuk ide yang sudah dihapus atau bukan milik akun ini.
// Pesannya sengaja tidak membedakan keduanya, supaya tidak membocorkan apakah sebuah ide ada.
export default function NotFound() {
  return (
    <div
      className="flex min-h-dvh flex-col bg-brand-bg"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(20,20,26,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,26,0.045) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <LandingNav />
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl rounded-card bg-white p-8 text-center shadow-card md:p-12">
          <p className="inline-block rounded-full bg-brand-lime px-4 py-1 text-sm font-bold">
            404
          </p>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            Halaman tidak ditemukan
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base font-medium text-brand-muted">
            Alamatnya mungkin salah, atau ide yang kamu cari sudah dihapus atau bukan
            milik akun ini.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-lime px-8 text-sm font-bold shadow-[0_4px_20px_rgba(198,244,50,0.35)] transition hover:brightness-105"
            >
              Kembali ke Papan
            </Link>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-bg px-8 text-sm font-bold transition hover:brightness-95"
            >
              Ke beranda
            </Link>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}