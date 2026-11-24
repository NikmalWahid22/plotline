"use client";

import { useActionState, useEffect, useState } from "react";
import { createIdea, type IdeaFormState } from "@/app/dashboard/actions";
import { PlatformPicker } from "@/components/ideas/platform-picker";
import { Alert } from "@/components/primitives/alert";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input, Label } from "@/components/primitives/field";
import type { Platform, Status } from "@/lib/ideas";

// Form ringkas untuk menambah ide langsung ke satu kolom Papan.
// Hook bisa diisi nanti lewat tombol Edit di kartu.
export function ColumnAddForm({
  status,
  statusLabel,
  defaultPlatform,
  onDone,
  onCancel,
}: {
  status: Status;
  statusLabel: string;
  defaultPlatform: Platform;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState<IdeaFormState, FormData>(
    createIdea,
    null
  );
  const [platform, setPlatform] = useState<Platform>(defaultPlatform);

  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  const titleId = `col-title-${status}`;

  return (
    <Card className="p-4">
      <form action={action} className="space-y-3">
        <input type="hidden" name="status" value={status} />
        <div>
          <Label htmlFor={titleId}>Ide baru di {statusLabel}</Label>
          <Input
            id={titleId}
            name="title"
            required
            maxLength={200}
            placeholder="Judul ide"
            autoFocus
          />
        </div>

        <PlatformPicker value={platform} onChange={setPlatform} />

        {state?.error && <Alert>{state.error}</Alert>}

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={pending}>
            Batal
          </Button>
          <Button type="submit" size="sm" disabled={pending} className="flex-1">
            {pending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Card>
  );
}