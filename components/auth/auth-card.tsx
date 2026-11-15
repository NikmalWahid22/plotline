"use client";

import { useState } from "react";
import { Card } from "@/components/primitives/card";
import { DAILY_LIMIT } from "@/lib/constants";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

type Mode = "masuk" | "daftar";

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("masuk");

  return (
    <Card className="w-full max-w-md p-6">
      <div className="mx-auto mb-6 flex w-full max-w-xs rounded-full border border-brand-border bg-brand-bg p-1">
        {(["masuk", "daftar"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2 text-sm font-bold capitalize transition-colors duration-150 ${
              mode === m
                ? "bg-white text-brand-ink shadow-sm"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        {mode === "masuk" ? "Selamat datang kembali" : "Mulai dengan Plotline"}
      </h1>
      <p className="mt-1.5 text-sm text-brand-muted">
        {mode === "masuk"
          ? "Lanjutkan perencanaan konten lo."
          : "Bikin akun gratis dan rencanakan konten pertama lo."}
      </p>

      <button
        type="button"
        disabled
        className="mt-5 flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-brand-border bg-brand-bg font-bold text-brand-muted"
      >
        Lanjutkan dengan Google
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold">
          Segera
        </span>
      </button>

      <div className="my-4 flex items-center gap-3 text-xs text-brand-muted">
        <span className="h-px flex-1 bg-brand-border" />
        atau pakai email
        <span className="h-px flex-1 bg-brand-border" />
      </div>

      {mode === "masuk" ? <LoginForm /> : <SignupForm />}

      <p className="mt-4 text-center text-xs text-brand-muted">
        Gratis, {DAILY_LIMIT} generate AI per hari.
      </p>
    </Card>
  );
}
