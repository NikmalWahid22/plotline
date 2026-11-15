"use client";

import { useActionState, useEffect, useState } from "react";
import { createIdea, type IdeaFormState } from "@/app/dashboard/actions";
import { PlatformPicker } from "@/components/ideas/platform-picker";
import { Alert } from "@/components/primitives/alert";
import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Input, Label, Textarea } from "@/components/primitives/field";
import { PLATFORMS, type Platform } from "@/lib/ideas";

export function IdeaForm({
  onDone,
  onCancel,
}: {
  onDone: () => void;
  onCancel: () => void;
}) {
  const [state, action, pending] = useActionState<IdeaFormState, FormData>(
    createIdea,
    null
  );
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0].value);

  // Tutup form setelah ide berhasil disimpan.
  useEffect(() => {
    if (state?.ok) onDone();
  }, [state, onDone]);

  return (
    <Card className="p-6">
      <form action={action}>
        <h2 className="text-xl font-extrabold tracking-tight">Ide baru</h2>

        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              name="title"
              required
              maxLength={200}
              placeholder="Contoh: 3 trik CSS Grid yang jarang diketahui"
            />
          </div>

          <div>
            <Label htmlFor="hook">
              Hook <span className="font-normal text-brand-muted">(opsional)</span>
            </Label>
            <Textarea
              id="hook"
              name="hook"
              maxLength={500}
              rows={2}
              placeholder="Kalimat pembuka 3 detik pertama"
            />
          </div>

          <PlatformPicker value={platform} onChange={setPlatform} />
        </div>

        {state?.error && <Alert className="mt-4">{state.error}</Alert>}

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={pending} className="flex-1">
            {pending ? "Menyimpan..." : "Simpan ide"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
