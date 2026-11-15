// Format tanggal pendek ("13 Nov"). Zona waktu dikunci supaya hasil di server dan browser sama.
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(d);
}