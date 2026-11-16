// Helper tanggal untuk kalender. Semua tanggal diperlakukan sebagai "kunci" YYYY-MM-DD
// di zona waktu Asia/Jakarta, supaya tidak bergeser karena zona waktu server.

export const TZ = "Asia/Jakarta";

export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
] as const;

// Urutan mulai Senin.
export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;

const KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(value: string): boolean {
  const m = KEY_RE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return (
    date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d
  );
}

function toUtc(key: string): Date {
  const m = KEY_RE.exec(key)!;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

function fromUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Tanggal dari timestamp ISO, dibaca di zona Jakarta.
export function dateKeyFromIso(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function todayKey(): string {
  return dateKeyFromIso(new Date().toISOString());
}

export function addDays(key: string, n: number): string {
  const d = toUtc(key);
  d.setUTCDate(d.getUTCDate() + n);
  return fromUtc(d);
}

// Senin dari minggu yang memuat tanggal ini.
export function startOfWeek(key: string): string {
  const dow = (toUtc(key).getUTCDay() + 6) % 7; // Senin = 0
  return addDays(key, -dow);
}

export function weekDays(start: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function dayInfo(key: string) {
  const d = toUtc(key);
  return {
    day: d.getUTCDate(),
    dayName: DAYS[(d.getUTCDay() + 6) % 7],
    month: MONTHS[d.getUTCMonth()],
    year: d.getUTCFullYear(),
  };
}

// Contoh: "9 – 15 November 2026" atau "28 Des 2026 – 3 Jan 2027".
export function formatRange(start: string): string {
  const a = dayInfo(start);
  const b = dayInfo(addDays(start, 6));
  if (a.year === b.year && a.month === b.month) {
    return `${a.day} – ${b.day} ${b.month} ${b.year}`;
  }
  const short = (i: ReturnType<typeof dayInfo>) => `${i.day} ${i.month.slice(0, 3)}`;
  if (a.year === b.year) return `${short(a)} – ${short(b)} ${b.year}`;
  return `${short(a)} ${a.year} – ${short(b)} ${b.year}`;
}

// Jam 12 siang WIB: aman dari pergeseran tanggal di zona waktu mana pun.
export function toScheduledAt(key: string): string {
  return `${key}T12:00:00+07:00`;
}