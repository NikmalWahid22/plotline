import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";

export function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <Card className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-lime text-2xl font-extrabold">
        +
      </span>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight">
        Papan lo masih kosong
      </h2>
      <p className="mt-2 max-w-sm text-brand-muted">
        Tambahkan ide konten pertama lo. Nanti ide ini bisa digeser dari Ide
        sampai Terbit.
      </p>
      <Button onClick={onStart} className="mt-6">
        Tambah ide pertama
      </Button>
    </Card>
  );
}
