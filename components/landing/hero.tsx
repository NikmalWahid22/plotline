import Link from "next/link";
import { Icon } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";
import { HeroBoard } from "./hero-board";

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 md:pt-12 lg:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-brand-lime" />
          <span className="text-xs font-bold sm:text-sm">
            Dibuat untuk solo kreator developer dan desainer
          </span>
        </div>

        <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.025em] md:text-6xl lg:text-[64px] lg:leading-[1.06]">
          Plan content that actually gets{" "}
          <span className="inline-block -rotate-1 rounded-full bg-brand-lime px-5 py-1 shadow-sm md:py-2">
            made
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-brand-muted md:text-lg">
          Satu ruang kerja visual untuk merangkai ide dengan hook tajam, naskah
          dan shot list yang jelas, sampai jadwal mingguan yang rapi.
        </p>

        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/login?mode=daftar"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-lime px-8 text-sm font-bold shadow-[0_4px_20px_rgba(198,244,50,0.35)] transition hover:brightness-105 sm:w-auto"
          >
            Coba Gratis Sekarang
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <a
            href="#papan"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold shadow-[0_4px_16px_rgba(20,20,26,0.04)] transition hover:bg-brand-bg sm:w-auto"
          >
            <Icon name="play" className="h-4 w-4 text-brand-purple" />
            Lihat Demo Interaktif
          </a>
        </div>

        <p className="mt-6 text-sm text-brand-muted">
          Gratis, tanpa kartu kredit. {DAILY_LIMIT} generate AI per hari.
        </p>
      </div>

      <HeroBoard />
    </section>
  );
}