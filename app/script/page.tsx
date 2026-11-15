import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { requireOnboardedUser } from "@/lib/auth";

// Pintu masuk dari tab "Script & Shot List" di navbar.
// Mengarah ke script terbaru; kalau belum ada, ke ide terbaru; kalau belum ada ide, ke papan.
async function ScriptRedirect(): Promise<React.ReactNode> {
  await connection();
  const { supabase } = await requireOnboardedUser();

  const { data: script } = await supabase
    .from("scripts")
    .select("idea_id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (script?.idea_id) redirect(`/ideas/${script.idea_id}`);

  const { data: idea } = await supabase
    .from("ideas")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (idea?.id) redirect(`/ideas/${idea.id}`);

  return redirect("/dashboard");
}

export default function ScriptIndexPage() {
  return (
    <Suspense fallback={null}>
      <ScriptRedirect />
    </Suspense>
  );
}