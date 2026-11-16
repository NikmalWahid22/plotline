import Link from "next/link";
import { Icon, type IconName } from "@/components/primitives/icon";

const QUICK_TOPICS = [
  { icon: "screen" as IconName, label: "Setup terminal developer", topic: "Setup terminal untuk developer modern" },
  { icon: "tune" as IconName, label: "Kesalahan UX form", topic: "3 kesalahan UX form checkout yang bikin user kabur" },
  { icon: "trending" as IconName, label: "Build in public", topic: "Build in public: bikin produk digital dari nol" },
];

const COLUMNS = [
  { dot: "bg-brand-sky", label: "Ide & Riset", cards: [112, 96] },
  { dot: "bg-brand-purple", label: "Syuting", cards: [128] },
  { dot: "bg-brand-ink", label: "Edit & Grading", cards: [112] },
  { dot: "bg-brand-lime", label: "Terbit", cards: [96] },
];

// Papan bayangan di belakang kartu sambutan (hanya hiasan, tidak bisa diklik).
function GhostBoard() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none hidden select-none grid-cols-2 gap-4 opacity-40 blur-[0.6px] md:grid xl:grid-cols-4"
    >
      {COLUMNS.map((c) => (
        <div key={c.label} className="min-h-[34rem] rounded-card bg-white p-4 shadow-card">
          <div className="flex items-center gap-2 pb-3">
            <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
            <span className="font-bold">{c.label}</span>
            <span className="rounded-full bg-[#f0ecf5] px-2 py-0.5 text-xs font-semibold text-brand-muted">0</span>
          </div>
          <div className="mt-2 flex flex-col gap-3">
            {c.cards.map((h, i) => (
              <div
                key={i}
                style={{ height: h }}
                className="flex flex-col justify-between rounded-2xl bg-brand-bg p-4"
              >
                <div className="h-4 w-20 rounded-full bg-[#f0ecf5]" />
                <div className="h-3 w-full rounded bg-[#f0ecf5]" />
                <div className="h-3 w-2/3 rounded bg-[#f0ecf5]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Illustration() {
  return (
    <div className="relative mb-5 flex h-36 w-36 items-center justify-center">
      <svg viewBox="0 0 160 160" fill="none" className="h-full w-full" aria-hidden="true">
        <rect x="22" y="32" width="116" height="96" rx="20" fill="#F0ECF5" />
        <rect x="30" y="40" width="48" height="38" rx="12" fill="#FFFFFF" />
        <rect x="30" y="84" width="48" height="36" rx="12" fill="#BFE3FF" fillOpacity="0.55" />
        <rect x="84" y="40" width="46" height="80" rx="12" fill="#FFFFFF" />
        <rect x="92" y="50" width="30" height="6" rx="3" fill="#14141A" fillOpacity="0.12" />
        <rect x="92" y="62" width="22" height="6" rx="3" fill="#14141A" fillOpacity="0.12" />
        <g transform="translate(18, 16) rotate(-8)">
          <rect width="56" height="34" rx="8" fill="#14141A" />
          <path d="M0 8 L10 0 H18 L8 8 H0Z" fill="#C6F432" />
          <path d="M16 8 L26 0 H34 L24 8 H16Z" fill="#C6F432" />
          <path d="M32 8 L42 0 H50 L40 8 H32Z" fill="#C6F432" />
          <circle cx="28" cy="22" r="5" fill="#C6F432" />
        </g>
        <g transform="translate(108, 14)">
          <path d="M14 0L17.2 9.8L27 13L17.2 16.2L14 26L10.8 16.2L1 13L10.8 9.8L14 0Z" fill="#8B5CF6" />
          <circle cx="14" cy="13" r="3" fill="#FFFFFF" />
        </g>
        <circle cx="134" cy="98" r="6" fill="#C6F432" />
        <circle cx="24" cy="116" r="4" fill="#8B5CF6" />
      </svg>
      <span className="absolute bottom-1 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-lime shadow-card">
        <Icon name="plus" className="h-4 w-4" />
      </span>
    </div>
  );
}

// Tampilan papan kosong: kartu sambutan di atas papan bayangan.
export function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative">
      <GhostBoard />

      <div className="flex items-center justify-center md:absolute md:inset-0 md:p-6">
        <div className="relative flex w-full max-w-2xl flex-col items-center overflow-hidden rounded-card bg-white px-6 py-10 text-center shadow-[0_12px_40px_rgba(20,20,26,0.12)] sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-lime/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-brand-purple/15 blur-2xl" />

          <Illustration />

          <span className="relative inline-flex items-center gap-1.5 rounded-full bg-brand-bg px-3 py-1 text-xs font-bold">
            <Icon name="sparkles" className="h-4 w-4 text-brand-purple" />
            Papan Masih Kosong
          </span>

          <h2 className="relative mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
            Papan visualmu siap diisi ide brilian.
          </h2>
          <p className="relative mt-3 max-w-lg leading-relaxed text-brand-muted">
            Mulai dengan menggali topik pakai AI generator, atau tulis kartu ide pertamamu
            sendiri dalam hitungan detik.
          </p>

          <div className="relative mt-6 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/generate"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-lime px-6 text-sm font-bold shadow-card transition hover:brightness-105 active:scale-95 sm:w-auto"
            >
              <Icon name="sparkles" className="h-5 w-5" />
              Generate Ide Pertama dengan AI
            </Link>
            <button
              type="button"
              onClick={onStart}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold shadow-card transition hover:bg-brand-bg active:scale-95 sm:w-auto"
            >
              <Icon name="notes" className="h-5 w-5" />
              Buat Kartu Ide Manual
            </button>
          </div>

          <div className="relative mt-8 flex flex-col items-center gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Ide cepat siap pakai
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_TOPICS.map((q) => (
                <Link
                  key={q.label}
                  href={`/generate?topik=${encodeURIComponent(q.topic)}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-bg px-3.5 py-1.5 text-xs font-semibold transition hover:bg-brand-lime active:scale-95"
                >
                  <Icon name={q.icon} className="h-3.5 w-3.5" />
                  {q.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}