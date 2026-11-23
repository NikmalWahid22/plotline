import Link from "next/link";

// href kosong = halamannya belum ada. Tampil redup dan tidak bisa diklik.
const COLUMNS: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: "Produk",
    links: [
      { label: "Idea Generator", href: "/#fitur" },
      { label: "Script Editor", href: "/#fitur" },
      { label: "Papan Visual", href: "/#fitur" },
      { label: "Kalender", href: "/#fitur" },
    ],
  },
  {
    title: "Sumber Daya",
    links: [
      { label: "Dokumentasi" },
      { label: "Kasus Penggunaan" },
      { label: "Roadmap" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami" },
      { label: "Privasi", href: "/privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-white shadow-[0_-1px_12px_rgba(20,20,26,0.02)]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 pb-8 md:grid-cols-5">
          <div className="col-span-2 max-w-sm space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-ink text-xs font-bold text-brand-lime">
                P
              </span>
              <span className="text-base font-bold tracking-tight">Plotline</span>
            </Link>
            <p className="text-sm text-brand-muted">
              Visual content planner built for tech &amp; creative creators.
            </p>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title} className="space-y-3">
              <p className="text-sm font-bold">{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <Link
                        href={l.href}
                        className="text-sm text-brand-muted transition-colors hover:text-brand-ink"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <span
                        title="Segera hadir"
                        aria-disabled="true"
                        className="cursor-default text-sm text-brand-muted/50"
                      >
                        {l.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-xs font-medium text-brand-muted">
          © 2026 Plotline. Crafted for modern solo creators.
        </p>
      </div>
    </footer>
  );
}