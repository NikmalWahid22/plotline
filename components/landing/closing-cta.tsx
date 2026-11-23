import Link from "next/link";
import { Icon } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";
import { SIGNUP_CLOSED_NOTE, SIGNUP_OPEN } from "@/lib/signup";

export function ClosingCta() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-4 sm:px-6 md:pb-20 lg:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[24px] bg-white p-6 text-center shadow-[0_20px_40px_rgba(20,20,26,0.06)] md:p-10">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-ink text-brand-lime">
          <Icon name="sparkles" className="h-6 w-6" />
        </span>
        <h2 className="max-w-2xl text-balance text-[28px] font-bold leading-[1.2] tracking-tight md:text-4xl">
          Mulai jadwalkan konten minggu ini.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-brand-muted">
          Tinggalkan catatan berantakan di Notes dan Google Docs. Ide, naskah,
          dan jadwal ada di satu tempat.
        </p>
        <Link
          href={SIGNUP_OPEN ? "/login?mode=daftar" : "/login"}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-lime px-8 text-sm font-bold shadow-[0_4px_20px_rgba(198,244,50,0.35)] transition hover:brightness-105 sm:w-auto"
        >
          {SIGNUP_OPEN ? "Mulai Gratis Sekarang" : "Masuk ke Plotline"}
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs font-semibold text-brand-muted">
          {SIGNUP_OPEN
            ? `Gratis, tanpa kartu kredit. ${DAILY_LIMIT} generate AI per hari.`
            : SIGNUP_CLOSED_NOTE}
        </p>
      </div>
    </section>
  );
}