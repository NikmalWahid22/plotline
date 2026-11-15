import { Icon } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";

// Bagian atas halaman Generate ide: eyebrow, judul, subjudul, dan info jatah AI.
export function GenerateHero({ remaining }: { remaining: number | null }) {
  return (
    <header className="mb-8 flex flex-col gap-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-muted">
        <Icon name="sparkles" className="h-4 w-4 text-brand-purple" />
        Mesin ide konten
      </p>

      <h1 className="max-w-[620px] text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-5xl xl:text-[64px] xl:leading-[68px]">
        Generate ide konten dengan{" "}
        <span className="inline-block rounded-full bg-brand-lime px-3.5 py-1 leading-none">
          hook
        </span>{" "}
        mematikan.
      </h1>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl text-lg text-brand-muted">
          Didesain khusus untuk kreator tech &amp; design: developer, UI/UX
          designer, motion artist.
        </p>

        <p className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-card">
          <span className="h-2 w-2 rounded-full bg-brand-lime" />
          <span>Model: Gemini</span>
          <span className="h-1 w-1 rounded-full bg-brand-muted/60" />
          <span className="text-brand-muted">
            Jatah {typeof remaining === "number" ? remaining : "–"}/{DAILY_LIMIT}
          </span>
        </p>
      </div>
    </header>
  );
}