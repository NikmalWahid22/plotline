"use client";

import { useActionState } from "react";
import { signup } from "@/app/login/actions";
import { Button } from "@/components/primitives/button";
import { AuthField, AuthFeedback } from "./auth-field";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, null);
  return (
    <form action={action} className="space-y-3">
      <AuthField label="Email" name="email" type="email" placeholder="nama@email.com" autoComplete="email" />
      <AuthField label="Kata sandi (min. 8 karakter)" name="password" type="password" placeholder="Buat kata sandi" autoComplete="new-password" />
      <AuthFeedback state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Memproses..." : "Daftar gratis"}
      </Button>
    </form>
  );
}
