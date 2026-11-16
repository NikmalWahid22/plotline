import type { Platform, Status } from "@/lib/ideas";

// Ide di kalender. date = kunci YYYY-MM-DD (Jakarta), null = belum dijadwalkan.
export type CalendarIdea = {
  id: string;
  title: string;
  hook: string | null;
  platform: Platform;
  status: Status;
  date: string | null;
};