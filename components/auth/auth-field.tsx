"use client";

import { useState } from "react";
import { Input, Label } from "@/components/primitives/field";
import { Alert } from "@/components/primitives/alert";
import type { AuthState } from "@/app/login/actions";

export function AuthField({
  label,
  name,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="pr-20"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-muted hover:text-brand-ink"
          >
            {show ? "Sembunyi" : "Lihat"}
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthFeedback({ state }: { state: AuthState }) {
  if (!state) return null;
  if (state.error) return <Alert>{state.error}</Alert>;
  if (state.message) return <Alert tone="info">{state.message}</Alert>;
  return null;
}
