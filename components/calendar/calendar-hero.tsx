export function CalendarHero({
  scheduledThisWeek,
  backlog,
  target = null,
}: {
  scheduledThisWeek: number;
  backlog: number;
  // Target konten per minggu dari profil (null = belum diisi).
  target?: { min: number; label: string } | null;
}) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div className="max-w-2xl">
        <span className="hidden items-center rounded-full bg-brand-lime px-4 py-1.5 sm:inline-flex text-xs font-bold uppercase tracking-wider">
          Distribusi Konten
        </span>
        <h1 className="text-[26px] font-bold leading-[1.15] sm:mt-5 sm:text-4xl md:text-hero">
          Distribusi konten mingguan dengan ritme{" "}
          <span className="text-brand-purple">presisi.</span>
        </h1>
        <p className="mt-4 hidden max-w-xl text-base leading-relaxed text-brand-muted sm:block">
          Tarik ide dari backlog ke hari tayang, atau tambahkan lewat tombol di tiap hari.
          Geser ke samping untuk melihat hari lain.
        </p>
      </div>

      <div className="flex w-full gap-3 lg:w-auto">
        <Metric value={scheduledThisWeek} label="Terjadwal minggu ini" />
        <Metric value={backlog} label="Ide di backlog" />
        {target && (
          <Metric
            value={`${scheduledThisWeek}/${target.min}`}
            label={`Target minggu (${target.label})`}
            reached={scheduledThisWeek >= target.min}
          />
        )}
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
  reached = false,
}: {
  value: number | string;
  label: string;
  reached?: boolean;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-card bg-white px-4 py-3 shadow-card sm:px-6 sm:py-4 lg:min-w-[9.5rem] lg:flex-none">
      <p className={`text-stat max-sm:text-2xl ${reached ? "text-brand-purple" : ""}`}>{value}</p>
      <p className="mt-1 text-xs font-semibold text-brand-muted sm:mt-2">{label}</p>
    </div>
  );
}