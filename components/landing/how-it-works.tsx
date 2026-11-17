import { Icon } from "@/components/primitives/icon";
import { DAILY_LIMIT } from "@/lib/constants";
import { STATUSES } from "@/lib/ideas";

const CARD =
  "rounded-[24px] bg-white p-5 shadow-[0_8px_30px_rgba(20,20,26,0.06)] md:p-6";

const STEPS = [
  {
    n: "01",
    title: "Tentukan niche dan generate ide",
    body: "Pilih platform dan gaya bahasa, tulis topiknya, lalu biarkan AI meracik angle dan hook untuk tiap ide.",
    result: "Lima ide lengkap dengan hook",
  },
  {
    n: "02",
    title: "Matangkan naskah dan shot list",
    body: "Pilih satu ide. Plotline menyusun script per scene, daftar shot yang perlu diambil, dan ide thumbnail.",
    result: "Script dan shot list siap",
  },
  {
    n: "03",
    title: "Eksekusi di papan dan jadwalkan",
    body: "Pindahkan ide antar tahap di Papan, taruh di Kalender, dan centang shot saat sudah diambil.",
    result: "Jadwal tayang terisi",
  },
];

const FACTS = [
  { value: String(DAILY_LIMIT), label: "Generate AI per hari" },
  { value: "5", label: "Ide setiap generate" },
  { value: String(STATUSES.length), label: "Tahap di papan" },
  { value: "Rp0", label: "Biaya, tanpa kartu kredit" },
];

export function HowItWorks() {
  return (
    <section
      id="cara-kerja"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 md:py-16 lg:px-10"
    >
      <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-lime" />
          Alur kerja
        </span>
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-tight md:text-4xl">
          Alur Kerja 3 Langkah Kreator Solo
        </h2>
        <p className="mt-3 text-base text-brand-muted">
          Dari ide dadakan sampai materi syuting yang rapi, dalam satu alur.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className={`${CARD} flex flex-col justify-between gap-5 transition-transform duration-200 md:hover:-translate-y-0.5`}
          >
            <div>
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-lime text-base font-extrabold shadow-sm">
                {s.n}
              </span>
              <h3 className="mb-2 text-xl font-bold leading-snug tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-brand-muted md:text-base">{s.body}</p>
            </div>
            <p className="flex items-center gap-2 rounded-xl bg-brand-bg p-3 text-xs font-bold">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-lime">
                <Icon name="check" className="h-3 w-3" />
              </span>
              {s.result}
            </p>
          </div> 
        ))}
      </div>

      <div className={`${CARD} mt-4 md:p-8`}>
        <dl className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {f.value}
              </dd>
              <p className="mt-1 text-xs font-semibold text-brand-muted">{f.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}