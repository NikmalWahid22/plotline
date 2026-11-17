import { Icon, type IconName } from "@/components/primitives/icon";

const CARD =
  "flex flex-col justify-between gap-5 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(20,20,26,0.06)] transition-transform duration-200 md:p-6 md:hover:-translate-y-0.5";

function CardHead({
  tag,
  icon,
  tagClass,
  iconClass = "",
}: {
  tag: string;
  icon: IconName;
  tagClass: string;
  iconClass?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${tagClass}`}>{tag}</span>
      <Icon name={icon} className={`h-5 w-5 ${iconClass}`} />
    </div>
  );
}

const WEEK = [
  { d: "SEN", n: 12, dot: "bg-brand-purple" },
  { d: "SEL", n: 13, dot: "bg-brand-ink/20" },
  { d: "RAB", n: 14, dot: "bg-brand-ink", today: true },
  { d: "KAM", n: 15, dot: "bg-brand-sky" },
  { d: "JUM", n: 16, dot: "bg-brand-purple" },
  { d: "SAB", n: 17, dot: "bg-brand-ink/20" },
  { d: "MIN", n: 18, dot: "bg-brand-ink/20" },
];

export function Features() {
  return (
    <section
      id="fitur"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 md:py-16 lg:px-10"
    >
      <div className="mb-8 max-w-3xl md:mb-10">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-purple" />
          Fitur
        </span>
        <h2 className="text-[28px] font-bold leading-[1.2] tracking-tight md:text-4xl">
          Fitur Inti yang Mengubah Cara Kamu Berkreasi
        </h2>
        <p className="mt-3 text-base text-brand-muted md:text-lg">
          Dirancang untuk memperpendek jarak antara ide di kepala dan video yang
          siap diunggah.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* 1. Idea Generator */}
        <div className={`${CARD} bg-white md:col-span-7`}>
          <div>
            <CardHead
              tag="Ide instan"
              icon="sparkles"
              tagClass="bg-brand-lime"
            />
            <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              Generator Ide Berbasis Hook
            </h3>
            <p className="text-sm text-brand-muted md:text-base">
              Tulis topik seperti &lsquo;setup Neovim&rsquo; atau &lsquo;trik CSS
              Grid&rsquo;, pilih platform dan gaya bahasa, lalu dapatkan lima ide
              lengkap dengan hook untuk 3 detik pertama.
            </p>
          </div>

          <div className="rounded-[16px] bg-brand-bg p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs font-bold">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-lime" />
                Hasil #1
              </span>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold">
                TikTok
              </span>
            </div>
            <div className="rounded-xl bg-white p-4">
              <span className="mb-1 block text-xs font-bold text-brand-purple">
                Hook 3 detik pertama
              </span>
              <p className="text-base font-bold leading-snug">
                &ldquo;Jangan sentuh CSS Grid sebelum paham konsep 3 baris
                ini.&rdquo;
              </p>
            </div>
            <p className="mt-3 text-right text-xs font-bold">Simpan ke Papan →</p>
          </div>
        </div>

        {/* 2. Script dan shot list */}
        <div
          className={`${CARD} bg-brand-purple text-white md:col-span-5`}
        >
          <div>
            <CardHead
              tag="Siap syuting"
              icon="film"
              tagClass="bg-white/20"
              iconClass="text-white"
            />
            <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              Script dan Shot List
            </h3>
            <p className="text-sm text-white/80 md:text-base">
              Setiap ide dipecah per scene: narasi dan arahan visual. Daftar shot
              bisa dicentang saat sudah diambil, lengkap dengan ide thumbnail.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-white/10 p-3">
              <span className="text-sm">Scene 1: Hook pembuka</span>
              <span className="shrink-0 rounded-full bg-brand-lime px-2.5 py-0.5 text-xs font-bold text-brand-ink">
                Close-up
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-white/10 p-3">
              <span className="text-sm">Scene 2: Demo keyboard</span>
              <span className="shrink-0 rounded-full bg-brand-sky px-2.5 py-0.5 text-xs font-bold text-brand-ink">
                B-roll
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-lime text-brand-ink">
                <Icon name="check" className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm">Shot selesai diambil</span>
            </div>
          </div>
        </div>

        {/* 3. Papan */}
        <div className={`${CARD} bg-white md:col-span-5`}>
          <div>
            <CardHead tag="Papan visual" icon="kanban" tagClass="bg-brand-sky" />
            <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              Papan Empat Tahap
            </h3>
            <p className="text-sm text-brand-muted md:text-base">
              Lihat seluruh perjalanan konten dalam satu papan, dari Ide &amp;
              Riset, Syuting, Edit &amp; Grading, sampai Terbit.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-[16px] bg-brand-bg p-4">
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl bg-white p-2.5 shadow-sm">
              <span className="truncate text-sm font-medium">
                Tips Auto-Layout Figma
              </span>
              <Icon name="grip" className="h-4 w-4 shrink-0 text-brand-muted" />
            </div>
            <Icon name="arrow" className="h-4 w-4 shrink-0" />
            <span className="shrink-0 rounded-xl bg-brand-lime/40 px-3 py-2 text-xs font-bold">
              Syuting
            </span>
          </div>
        </div>

        {/* 4. Kalender */}
        <div className={`${CARD} bg-white md:col-span-7`}>
          <div>
            <CardHead
              tag="Kalender mingguan"
              icon="calendar"
              tagClass="bg-brand-bg"
            />
            <h3 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
              Jadwal Tayang yang Rapi
            </h3>
            <p className="text-sm text-brand-muted md:text-base">
              Tarik ide dari backlog ke hari tayangnya. Dalam satu minggu kelihatan
              hari mana yang masih kosong, jadi tidak ada jadwal yang terlewat.
            </p>
          </div>

          <div className="rounded-[16px] bg-brand-bg p-3 sm:p-4">
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEK.map((w) => (
                <div
                  key={w.d}
                  className={`rounded-xl p-1.5 sm:p-2 ${
                    w.today ? "bg-brand-lime" : "bg-white shadow-sm"
                  }`}
                >
                  <span
                    className={`block text-[10px] font-semibold sm:text-xs ${
                      w.today ? "" : "text-brand-muted"
                    }`}
                  >
                    {w.d}
                  </span>
                  <span className="block text-sm font-bold">{w.n}</span>
                  <span className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${w.dot}`} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-bold">
              <span className="rounded-full bg-brand-lime px-3 py-1">
                Rabu: 1 ide terjadwal
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}