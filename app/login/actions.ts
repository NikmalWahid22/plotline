"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readFields(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function login(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const { email, password } = readFields(formData);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { error: "Format email tidak valid." };
  }
  if (!password || password.length > 72) {
    return { error: "Kata sandi wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Pesan sengaja umum, supaya tidak membocorkan apakah email terdaftar.
  if (error) return { error: "Email atau kata sandi salah." };

  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const { email, password } = readFields(formData);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { error: "Format email tidak valid." };
  }
  if (password.length < 8 || password.length > 72) {
    return { error: "Kata sandi harus 8 sampai 72 karakter." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: "Pendaftaran gagal. Periksa data lo lalu coba lagi." };
  }

  // Kalau "Confirm email" dimatikan, sesi langsung ada.
  if (data.session) redirect("/dashboard");

  return { message: "Akun dibuat. Cek email lo untuk konfirmasi, lalu masuk." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}