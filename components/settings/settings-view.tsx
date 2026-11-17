import { signOut } from "@/app/login/actions";
import { nicheLabel } from "@/lib/profile";
import { SettingsForm } from "./settings-form";
import { DangerZone } from "./danger-zone";
import { UsagePanel } from "./usage-panel";

export function SettingsView({
  email,
  initial,
  remaining,
  ideaCount,
  scriptCount,
  scheduledCount,
}: {
  email?: string;
  initial: { niche: string; platforms: string[]; frequency: string };
  remaining: number | null;
  ideaCount: number;
  scriptCount: number;
  scheduledCount: number;
}) {
  const letter = email?.[0]?.toUpperCase() ?? "P";

  return (
    <div className="flex flex-col gap-6">
      <section>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-muted">
          <span className="h-2 w-2 rounded-full bg-brand-lime" />
          Pengaturan Akun &amp; Preferensi
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Sesuaikan alur kerja dan preferensi{" "}
          <span className="rounded-full bg-brand-lime px-3 py-0.5">studiomu</span>.
        </h1>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Identitas */}
        <section className="rounded-card bg-white p-6 shadow-card lg:col-span-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Identitas Kreator
            </p>
            <span className="rounded-full bg-brand-bg px-3 py-1 text-xs font-bold">Paket Gratis</span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-purple text-2xl font-bold text-white">
              {letter}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold">{email ?? "-"}</p>
              <p className="text-sm text-brand-muted">Kreator {nicheLabel(initial.niche)}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-brand-border pt-5">
            <p className="mb-3 text-sm font-bold">Data</p>
            <DangerZone ideaCount={ideaCount} />
          </div>

          <form action={signOut} className="mt-5 border-t border-brand-border pt-4">
            <button type="submit" className="text-sm font-bold text-red-700 hover:underline">
              Keluar Akun
            </button>
          </form>
        </section>

        {/* Preferensi */}
        <section className="rounded-card bg-white p-6 shadow-card lg:col-span-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Parameter Rekomendasi
            </p>
            <span className="rounded-full bg-brand-sky px-3 py-1 text-xs font-bold">Gemini</span>
          </div>
          <h2 className="mt-2 text-heading">Preferensi Niche &amp; Target Kanal</h2>
          <p className="mt-1 mb-5 text-sm text-brand-muted">
            Ini menentukan rekomendasi AI di Idea Generator dan Script.
          </p>
          <SettingsForm initial={initial} />
        </section>
      </div>

      <UsagePanel
        remaining={remaining}
        ideaCount={ideaCount}
        scriptCount={scriptCount}
        scheduledCount={scheduledCount}
      />
    </div>
  );
}