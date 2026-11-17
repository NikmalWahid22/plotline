import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { Icon, type IconName } from "@/components/primitives/icon";

type Current = "board" | "generate" | "script" | "calendar" | "settings";

// href kosong = fitur belum ada (tampil redup, tidak bisa diklik).
const NAV: { key: string; href?: string; label: string }[] = [
  { key: "board", href: "/dashboard", label: "Papan Visual" },
  { key: "generate", href: "/generate", label: "Idea Generator" },
  { key: "script", href: "/script", label: "Script & Shot List" },
  { key: "calendar", href: "/calendar", label: "Kalender" },
];

// Tab bawah di HP: label pendek dan ikon supaya muat dan mudah dijangkau ibu jari.
const MOBILE_TABS: { key: Current; href: string; label: string; icon: IconName }[] = [
  { key: "board", href: "/dashboard", label: "Papan", icon: "kanban" },
  { key: "generate", href: "/generate", label: "Generate", icon: "sparkles" },
  { key: "script", href: "/script", label: "Script", icon: "film" },
  { key: "calendar", href: "/calendar", label: "Kalender", icon: "calendar" },
];

const SHADOW = "shadow-card";

const FOOTER_LINKS = [
  "Dokumentasi",
  "Pintasan Keyboard",
  "Status Sistem",
  "Privasi & Keamanan",
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-brand-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </svg>
  );
}

// Kerangka halaman setelah login: bar atas yang menempel, lalu isi halaman.
export function AppShell({
  email,
  current,
  children,
}: {
  email?: string;
  current: Current;
  children: React.ReactNode;
}) {
  const initial = email?.[0]?.toUpperCase() ?? "P";

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-50 bg-brand-bg/90 shadow-[0_1px_8px_rgba(20,20,26,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
          {/* Kiri: logo + navigasi */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-ink text-sm font-bold text-brand-lime">
                P
              </span>
              <span className="text-lg font-bold tracking-tight">Plotline</span>
            </Link>

            <nav
              aria-label="Navigasi utama"
              className="hidden gap-0.5 rounded-full bg-[#f0ecf5] p-1 lg:flex"
            >
              {NAV.map((item) => {
                const active = current === item.key;
                const base =
                  "shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold transition-all";

                // Tab tanpa halaman sendiri: menyala hanya saat halamannya sedang dibuka
                // (script dibuka dari kartu ide), selain itu redup dan tidak bisa diklik.
                if (!item.href) {
                  if (active) {
                    return (
                      <span
                        key={item.key}
                        aria-current="page"
                        className={`${base} bg-white text-brand-ink ${SHADOW}`}
                      >
                        {item.label}
                      </span>
                    );
                  }
                  return (
                    <span
                      key={item.key}
                      aria-disabled="true"
                      title="Buka dari kartu ide di Papan"
                      className={`${base} cursor-not-allowed text-[#444934]/50`}
                    >
                      {item.label}
                    </span>
                  );
                }
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`${base} ${
                      active
                        ? `bg-white text-brand-ink ${SHADOW}`
                        : "text-[#444934] hover:text-brand-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Kanan: cari, ide baru, notifikasi, avatar */}
          <div className="flex items-center gap-2 md:gap-3">
            <div
              title="Segera hadir"
              className={`hidden h-10 items-center gap-2 rounded-full bg-white px-4 xl:flex ${SHADOW}`}
            >
              <SearchIcon />
              <input
                disabled
                placeholder="Cari konten, tags, ide..."
                aria-label="Cari (segera hadir)"
                className="w-36 cursor-not-allowed bg-transparent text-sm font-medium placeholder:text-brand-muted focus:outline-none lg:w-48"
              />
            </div>

            <Link
              href="/dashboard#tulis-ide"
              className={`flex h-10 items-center gap-1.5 rounded-full bg-brand-lime px-4 text-sm font-bold transition hover:brightness-105 ${SHADOW}`}
            >
              <span aria-hidden="true" className="text-lg leading-none">+</span>
              <span className="hidden sm:inline">Ide Baru</span>
            </Link>

            <button
              type="button"
              disabled
              title="Segera hadir"
              aria-label="Notifikasi (segera hadir)"
              className={`flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-white ${SHADOW}`}
            >
              <BellIcon />
            </button>

            {/* Avatar membuka menu akun: email dan Keluar */}
            <details className="group relative">
              <summary
                aria-label="Menu akun"
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white [&::-webkit-details-marker]:hidden"
              >
                {initial}
              </summary>
              <div className={`absolute right-0 top-12 w-60 rounded-2xl bg-white p-3 ${SHADOW}`}>
                {email && (
                  <p className="truncate px-2 pb-2 text-sm text-brand-muted">{email}</p>
                )}
                <Link
                  href="/settings"
                  className={`mb-2 flex h-10 w-full items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    current === "settings" ? "bg-brand-lime" : "bg-brand-bg hover:bg-brand-border"
                  }`}
                >
                  Pengaturan
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="h-10 w-full rounded-full bg-brand-bg text-sm font-bold transition-colors hover:bg-brand-border"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-6 sm:px-6 lg:px-10">
        {children}
      </div>

      <footer className="w-full bg-brand-bg pb-28 pt-6 shadow-[0_-1px_8px_rgba(20,20,26,0.03)] lg:pb-6">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-10">
          <p className="flex flex-wrap items-baseline justify-center gap-x-2 text-center md:justify-start">
            <span className="text-lg font-bold tracking-tight">Plotline</span>
            <span className="text-sm font-medium text-brand-muted">
              © 2026 Plotline. Papan konten untuk kreator tech dan creative.
            </span>
          </p>

          {/* Halaman ini belum ada: tampil redup, tidak bisa diklik */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            {FOOTER_LINKS.map((label) => (
              <li key={label}>
                <span
                  aria-disabled="true"
                  title="Segera hadir"
                  className="cursor-not-allowed text-xs font-semibold text-brand-muted"
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      {/* Navigasi bawah, hanya di HP dan tablet kecil */}
      <nav
        aria-label="Navigasi utama"
        className="fixed inset-x-0 bottom-0 z-50 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(20,20,26,0.06)] backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
          {MOBILE_TABS.map((t) => {
            const active = current === t.key;
            return (
              <li key={t.key} className="flex-1">
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1 py-1 text-[11px] font-bold"
                >
                  <span
                    className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-brand-lime text-brand-ink" : "text-brand-muted"
                    }`}
                  >
                    <Icon name={t.icon} className="h-5 w-5" />
                  </span>
                  <span className={active ? "text-brand-ink" : "text-brand-muted"}>{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}