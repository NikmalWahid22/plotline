"use client";

import { useActionState } from "react";
import { login } from "@/app/login/actions";
import { Button } from "@/components/primitives/button";
import { AuthField, AuthFeedback } from "./auth-field";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="space-y-3">
      <AuthField label="Email" name="email" type="email" placeholder="nama@email.com" autoComplete="email" />
      <AuthField label="Kata sandi" name="password" type="password" placeholder="Kata sandi lo" autoComplete="current-password" />
      <AuthFeedback state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Memproses..." : "Masuk ke Plotline"}
      </Button>
    </form>
  );
}
