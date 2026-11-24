"use client";

import { useActionState, useEffect, useState } from "react";
import { updateIdea, type IdeaFormState } from "@/app/dashboard/actions";
import { PlatformPicker } from "@/components/ideas/platform-picker";
import { Alert } from "@/components/primitives/alert";
import { Button } from "@/components/primitives/button";
import { Input, Label, Textarea } from "@/components/primitives/field";
import type { BoardIdea, Platform } from "@/lib/ideas";

// Form edit di dalam kartu. Kartu tidak bisa diseret selama form terbuka.
export function IdeaEditForm({
  idea,
  onDone,
  onCancel,
}: {
  idea: BoardIdea;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState<IdeaFormState, FormData>(
    updateIdea.bind(null, idea.id),
    null
  );
  const [platform, setPlatform] = useState<Platform>(idea.platform);

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  const titleId = `title-${idea.id}`;
  const hookId = `hook-${idea.id}`;

  return (
    <form action={action} className="space-y-3">
      <div>
        <Label htmlFor={titleId}>Judul</Label>
        <Input
          id={titleId}
          name="title"
          required
          maxLength={200}
          defaultValue={idea.title}
          autoFocus
        />
      </div>

      <div>
        <Label htmlFor={hookId}>
          Hook <span className="font-normal text-brand-muted">(opsional)</span>
        </Label>
        <Textarea
          id={hookId}
          name="hook"
          maxLength={500}
          rows={3}
          defaultValue={idea.hook ?? ""}
        />
      </div>

      <PlatformPicker value={platform} onChange={setPlatform} />

      {idea.has_script && platform !== idea.platform && (
        <Alert tone="info" className="text-xs">
          Script yang sudah ada tidak ikut berubah. Buat ulang kalau perlu menyesuaikan
          platform baru.
        </Alert>
      )}

      {state?.error && <Alert>{state.error}</Alert>}

      <div className="flex gap-2 pt-1">
        <Button variant="secondary" size="sm" onClick={onCancel} disabled={pending}>
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={pending} className="flex-1">
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}