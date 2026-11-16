export function CalendarHero({
  scheduledThisWeek,
  backlog,
}: {
  scheduledThisWeek: number;
  backlog: number;
}) {
  return (
    <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-brand-lime px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
          Distribusi Konten
        </span>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
          Distribusi konten mingguan dengan ritme{" "}
          <span className="text-brand-purple">presisi.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-muted">
          Tarik ide dari backlog ke hari tayang, atau tambahkan lewat tombol di tiap hari.
          Geser ke samping untuk melihat hari lain.
        </p>
      </div>

      <div className="flex gap-3">
        <Metric value={scheduledThisWeek} label="Terjadwal minggu ini" />
        <Metric value={backlog} label="Ide di backlog" />
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[9.5rem] rounded-card bg-white px-6 py-4 shadow-card">
      <p className="text-3xl font-extrabold leading-none">{value}</p>
      <p className="mt-2 text-xs font-semibold text-brand-muted">{label}</p>
    </div>
  );
}