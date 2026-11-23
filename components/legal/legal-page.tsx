import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

// Kontak untuk pertanyaan data dan permintaan hapus akun.
// Isi email di bawah ini kalau mau menampilkan email. Kalau dikosongkan, yang tampil
// adalah profil GitHub pemilik proyek.
export const CONTACT_EMAIL = "";
export const CONTACT_FALLBACK_URL = "https://github.com/NikmalWahid22";

export function Contact() {
  return CONTACT_EMAIL ? (
    <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
      {CONTACT_EMAIL}
    </a>
  ) : (
    <a
      className="font-semibold underline"
      href={CONTACT_FALLBACK_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      profil GitHub pemilik proyek
    </a>
  );
}

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-dvh bg-brand-bg"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(20,20,26,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,26,0.045) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <LandingNav />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-10">
        <article className="rounded-card bg-white p-6 shadow-card md:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-muted">
            Diperbarui {updated}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base font-medium text-brand-muted">{intro}</p>
          <div className="mt-8 space-y-8 border-t border-brand-ink/10 pt-8 lg:columns-2 lg:gap-x-14 lg:space-y-0 [&>section]:break-inside-avoid lg:[&>section]:mb-8">
            {children}
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-heading">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-brand-ink/90 md:text-base [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}