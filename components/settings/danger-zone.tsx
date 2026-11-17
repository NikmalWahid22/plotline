"use client";

import { useActionState, useState } from "react";
import { deleteAllIdeas, type DeleteState } from "@/app/settings/actions";
import { Alert } from "@/components/primitives/alert";

// Hapus semua ide. Harus mengetik HAPUS dulu supaya tidak terklik tidak sengaja.
export function DangerZone({ ideaCount }: { ideaCount: number }) {
  const [state, action, pending] = useActionState<DeleteState, FormData>(deleteAllIdeas, null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  if (state?.done) return <Alert tone="info">Semua ide sudah dihapus.</Alert>;

  if (!open) {
    return (
      <button
        type="button"
        disabled={ideaCount === 0}
        onClick={() => setOpen(true)}
        className="h-10 rounded-full bg-red-50 px-5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Hapus Semua Ide
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="confirm" className="text-sm">
        Menghapus {ideaCount} ide beserta script dan jadwalnya, tidak bisa dibatalkan. Ketik{" "}
        <b className="text-red-700">HAPUS</b> untuk konfirmasi.
      </label>
      <input
        id="confirm"
        name="confirm"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-11 rounded-2xl bg-brand-bg px-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-red-200"
      />
      {state?.error && <Alert>{state.error}</Alert>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setOpen(false); setText(""); }}
          className="h-10 flex-1 rounded-full bg-brand-bg text-sm font-bold transition hover:bg-brand-border"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={text.trim().toUpperCase() !== "HAPUS" || pending}
          className="h-10 flex-1 rounded-full bg-red-600 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </form>
  );
}