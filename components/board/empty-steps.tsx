import { Card } from "@/components/primitives/card";
import { Icon, type IconName } from "@/components/primitives/icon";

const STEPS: { icon: IconName; tone: string; title: string; text: string }[] = [
  {
    icon: "lightbulb",
    tone: "bg-brand-sky text-brand-ink",
    title: "1. Bangun Hook Kuat",
    text: "Pakai 3 detik pertama untuk merebut perhatian audiens TikTok, Reels, dan YouTube Shorts.",
  },
  {
    icon: "film",
    tone: "bg-brand-purple text-white",
    title: "2. Rinci Shot List",
    text: "Petakan angle kamera, b-roll, dan transisi sebelum menekan tombol rekam.",
  },
  {
    icon: "calendar",
    tone: "bg-brand-lime text-brand-ink",
    title: "3. Terbit Konsisten",
    text: "Atur hari tayang tiap ide di Kalender supaya ritme postingmu terjaga.",
  },
];

// Tiga langkah singkat yang tampil saat papan masih kosong.
export function EmptySteps() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {STEPS.map((s) => (
        <Card key={s.title} className="flex items-start gap-4 p-6">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${s.tone}`}>
            <Icon name={s.icon} className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold tracking-tight">{s.title}</h3>
            <p className="mt-1 text-sm font-medium text-brand-muted">{s.text}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}