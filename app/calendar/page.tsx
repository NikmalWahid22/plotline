import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireOnboardedUser } from "@/lib/auth";
import { weeklyTarget } from "@/lib/profile";
import { AppShell } from "@/components/layout/app-shell";
import { CalendarView } from "@/components/calendar/calendar-view";
import { dateKeyFromIso, isDateKey, startOfWeek, todayKey } from "@/lib/dates";
import type { CalendarIdea } from "@/lib/calendar";
import type { Platform, Status } from "@/lib/ideas";

export const metadata: Metadata = { title: "Kalender | Plotline" };

function CalendarSkeleton() {
  return (
    <AppShell current="calendar">
      <div className="h-48 animate-pulse rounded-card bg-white" />
      <div className="mt-6 h-96 animate-pulse rounded-card bg-white" />
    </AppShell>
  );
}

async function CalendarContent({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  await connection();
  const { week } = await searchParams;
  const { supabase, email, profile } = await requireOnboardedUser();

  const today = todayKey();
  const anchor = week && isDateKey(week) ? week : today;
  const weekStart = startOfWeek(anchor);

  const { data } = await supabase
    .from("ideas")
    .select("id, title, hook, platform, status, scheduled_at")
    .order("created_at", { ascending: false });

  const ideas: CalendarIdea[] = (data ?? []).map((i) => ({
    id: i.id as string,
    title: i.title as string,
    hook: (i.hook as string | null) ?? null,
    platform: i.platform as Platform,
    status: i.status as Status,
    date: i.scheduled_at ? dateKeyFromIso(i.scheduled_at as string) : null,
  }));

  return (
    <AppShell current="calendar" email={email}>
      <CalendarView
        ideas={ideas}
        weekStart={weekStart}
        today={today}
        target={weeklyTarget(profile.posting_frequency)}
      />
    </AppShell>
  );
}

export default function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarContent searchParams={searchParams} />
    </Suspense>
  );
}