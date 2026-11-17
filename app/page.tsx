import type { Metadata } from "next";
import { ClosingCta } from "@/components/landing/closing-cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";

export const metadata: Metadata = {
  title: "Plotline | Visual content planner untuk kreator tech",
  description:
    "Satu ruang kerja visual untuk ide, hook, naskah, shot list, dan jadwal konten kreator tech dan creative.",
};

export default function Home() {
  return (
    // Latar kotak-kotak kecil. Ukuran kotak: 24px. Ketebalan garis: angka 0.045.
    <div
      className="min-h-dvh bg-brand-bg"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(20,20,26,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,20,26,0.045) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ClosingCta />
      </main>
      <LandingFooter />
    </div>
  );
}