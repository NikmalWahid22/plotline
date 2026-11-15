import { redirect } from "next/navigation";

// Sementara, halaman utama langsung ke papan. Kalau belum login, proxy.ts
// akan mengarahkan ke /login. Nanti file ini diganti landing page.
export default function Home() {
  redirect("/dashboard");
}