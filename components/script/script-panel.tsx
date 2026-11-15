"use client";

import { useState, useTransition } from "react";
import { moveIdea } from "@/app/dashboard/actions";
import { generateScriptAction } from "@/app/ideas/[id]/actions";
import { Alert } from "@/components/primitives/alert";
import { Card } from "@/components/primitives/card";
import type { Platform, Status } from "@/lib/ideas";
import type { Script } from "@/lib/scripts";
import { ScriptHeader } from "./script-header";
import { ScriptView } from "./script-view";

type IdeaInfo = {
  id: string;
  title: string;
  hook: string | null;
  platform: Platform;
  status: Status;
};

export function ScriptPanel({
  idea,
  nicheName,
  initialScript,
  initialRemaining,
}: {
  idea: IdeaInfo;
  nicheName: string;
  initialScript: Script | null;
  initialRemaining: number | null;
}) {
  const [script, setScript] = useState(initialScript);
  // Naik setiap script dibuat ulang, supaya centang shot ikut di-reset.
  const [version, setVersion] = useState(0);
  const [remaining, setRemaining] = useState(initialRemaining);
  const [status, setStatus] = useState<Status>(idea.status);
  const [error, setError] = useState<string | null>(null);
  const [generating, startGenerate] = useTransition();
  const [marking, startMark] = useTransition();

  function generate() {
    if (script && !window.confirm("Script lama akan diganti. Lanjut? (memakai 1 jatah)")) return;
    setError(null);
    startGenerate(async () => {
      const res = await generateScriptAction(idea.id);
      if (res?.remaining !== undefined) setRemaining(res.remaining);
      if (res?.error) setError(res.error);
      else if (res?.script) {
        setScript(res.script);
        setVersion((v) => v + 1);
      }
    });
  }

  function markFilming() {
    setError(null);
    startMark(async () => {
      const res = await moveIdea(idea.id, "filming");
      if (res.error) setError(res.error);
      else setStatus("filming");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <ScriptHeader
        title={idea.title}
        hook={idea.hook}
        platform={idea.platform}
        status={status}
        nicheName={nicheName}
        script={script}
        remaining={remaining}
        generating={generating}
        marking={marking}
        onGenerate={generate}
        onMarkFilming={markFilming}
      />

      {error && <Alert>{error}</Alert>}

      {generating ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((n) => (
            <Card key={n} className="h-36 animate-pulse" />
          ))}
        </div>
      ) : script ? (
        <ScriptView key={version} script={script} ideaId={idea.id} />
      ) : (
        <Card className="px-6 py-14 text-center">
          <p className="font-bold">Belum ada script</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-brand-muted">
            Klik Generate Script di atas. AI akan menulis scene, shot list, dan
            ide thumbnail untuk ide ini.
          </p>
        </Card>
      )}
    </div>
  );
}