import type { Metadata } from "next";
import { Contact, LegalPage, Section } from "@/components/legal/legal-page";
import { DAILY_LIMIT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Plotline",
  description: "Aturan pemakaian Plotline.",
};

export default function SyaratPage() {
  return (
    <LegalPage
      title="Syarat & Ketentuan"
      updated="23 November 2026"
      intro="Dengan membuat akun dan memakai Plotline, kamu setuju dengan aturan singkat di bawah ini."
    >
      <Section title="Tentang layanan">
        <p>
          Plotline adalah proyek pribadi dan portofolio, dibuat dan dijalankan
          sendirian tanpa biaya. Layanan diberikan <strong>apa adanya</strong>:
          fiturnya bisa berubah, berhenti sementara, atau dihentikan kapan saja tanpa
          pemberitahuan sebelumnya, dan tidak ada jaminan ketersediaan.
        </p>
      </Section>

      <Section title="Akun">
        <ul>
          <li>Gunakan email yang bisa kamu akses, dan jaga kata sandimu.</li>
          <li>Satu orang satu akun. Akun dipakai untuk keperluan pribadi.</li>
          <li>Kamu bertanggung jawab atas aktivitas di akunmu.</li>
        </ul>
      </Section>

      <Section title="Pemakaian wajar dan jatah AI">
        <ul>
          <li>
            Jatah generate AI adalah {DAILY_LIMIT} kali per akun per hari dan direset
            tengah malam WIB. Panggilan yang gagal tetap dihitung.
          </li>
          <li>
            Dilarang membuat banyak akun untuk menghindari jatah, mengotomatiskan
            permintaan, atau mengganggu layanan.
          </li>
          <li>
            Dilarang memakai Plotline untuk konten yang melanggar hukum, berbahaya,
            atau melanggar hak orang lain.
          </li>
        </ul>
      </Section>

      <Section title="Konten dan hasil AI">
        <ul>
          <li>
            Ide dan script yang kamu simpan adalah milikmu. Kamu bertanggung jawab
            atas isi dan pemakaiannya, termasuk hak cipta.
          </li>
          <li>
            Hasil AI bisa keliru, mirip dengan konten lain, atau tidak cocok. Periksa
            dulu sebelum dipakai atau dipublikasikan.
          </li>
          <li>
            Topik yang kamu kirim diproses oleh Gemini (Google). Lihat Kebijakan
            Privasi untuk rinciannya.
          </li>
        </ul>
      </Section>

      <Section title="Penghentian">
        <p>
          Akun yang melanggar aturan ini dapat dibatasi atau dihapus. Kamu bisa
          berhenti kapan saja dan meminta akunmu dihapus lewat <Contact />.
        </p>
      </Section>

      <Section title="Batas tanggung jawab">
        <p>
          Karena layanan ini gratis dan diberikan apa adanya, pembuat Plotline tidak
          bertanggung jawab atas kehilangan data, kerugian, atau dampak lain dari
          pemakaian layanan. Simpan salinan konten pentingmu sendiri.
        </p>
      </Section>

      <Section title="Perubahan">
        <p>
          Syarat ini bisa diperbarui. Memakai Plotline setelah perubahan berarti kamu
          menerima versi terbaru. Pertanyaan: <Contact />.
        </p>
      </Section>
    </LegalPage>
  );
}