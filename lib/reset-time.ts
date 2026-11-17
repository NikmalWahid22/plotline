// Sisa waktu sampai jatah AI direset (tengah malam WIB, UTC+7, tanpa DST).
// Fungsi murni: aman dipakai di komponen client.
export function timeUntilReset(): string {
  const DAY = 86_400_000;
  const WIB = 7 * 3_600_000;
  const left = DAY - ((Date.now() + WIB) % DAY);
  const hours = Math.floor(left / 3_600_000);
  const minutes = Math.max(1, Math.ceil((left % 3_600_000) / 60_000));
  if (minutes === 60) return `${hours + 1} jam`;
  return hours > 0 ? `${hours} jam ${minutes} mnt` : `${minutes} mnt`;
}