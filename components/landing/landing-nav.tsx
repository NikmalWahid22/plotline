import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { SIGNUP_OPEN } from "@/lib/signup";
import { createClient } from "@/lib/supabase/server";

const LINKS = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara Kerja" },
];

const GHOST = "rounded-full px-3 py-1.5 text-sm font-bold text-brand-ink transition-colors hover:text-brand-muted";
const SOLID =
  "inline-flex h-9 items-center rounded-full bg-brand-lime px-4 text-sm font-bold text-brand-ink shadow-[0_2px_10px_rgba(198,244,50,0.3)] transition hover:brightness-105";

function GuestActions() {
  return (
    <>
      <Link href="/login" className={GHOST}>
        Masuk
      </Link>
      {SIGNUP_OPEN ? (
        <Link href="/login?mode=daftar" className={SOLID}>
          Get started
        </Link>
      ) : null}
    </>
  );
}

// Cek login per request. Kalau sudah login, tombolnya jadi "Buka Papan".
async function Actions(): Promise<React.ReactNode> {
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    return (
      <Link href="/dashboard" className={SOLID}>
        Buka Papan
      </Link>
    );
  }
  return <GuestActions />;
}

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 bg-brand-bg/90 shadow-[0_1px_8px_rgba(20,20,26,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-16 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-ink text-xs font-bold text-brand-lime">
            P
          </span>
          <span className="text-base font-bold tracking-tight">Plotline</span>
        </Link>

        <nav aria-label="Navigasi landing" className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-bold text-brand-muted transition-colors hover:text-brand-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Suspense fallback={<GuestActions />}>
            <Actions />
          </Suspense>
        </div>
      </div>
    </header>
  );
}