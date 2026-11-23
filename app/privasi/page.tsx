import type { Metadata } from "next";
import { Contact, LegalPage, Section } from "@/components/legal/legal-page";
import { DAILY_LIMIT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privasi | Plotline",
  description: "Data apa yang disimpan Plotline, ke mana dikirim, dan cara menghapusnya.",
};

export default function PrivasiPage() {
  return (
    <LegalPage
      title="Kebijakan Privasi"
      updated="23 November 2026"
      intro="Plotline adalah proyek pribadi untuk portofolio. Halaman ini menjelaskan apa adanya: data apa yang disimpan, ke mana data dikirim, dan bagaimana menghapusnya."
    >
      <Section title="Data yang disimpan">
        <ul>
          <li>
            <strong>Akun:</strong> alamat email dan kata sandi. Kata sandi dikelola oleh
            Supabase Auth dan disimpan dalam bentuk hash, jadi Plotline tidak pernah
            melihat kata sandi aslimu.
          </li>
          <li>
            <strong>Profil:</strong> niche, platform utama, dan frekuensi posting yang
            kamu isi saat onboarding atau di Pengaturan.
          </li>
          <li>
            <strong>Konten:</strong> ide, hook, script, shot list, ide thumbnail, status
            ide, dan jadwal tayang.
          </li>
          <li>
            <strong>Pemakaian AI:</strong> jumlah dan waktu generate, hanya untuk
            menghitung jatah {DAILY_LIMIT} kali per hari.
          </li>
        </ul>
      </Section>

      <Section title="Data yang dikirim ke Gemini (Google)">
        <p>
          Saat kamu membuat ide atau script, teks yang relevan dikirim ke Gemini API
          milik Google: topik yang kamu ketik, niche, platform, gaya bahasa, dan ide
          yang dipilih untuk dibuatkan script.
        </p>
        <p>
          Plotline memakai Gemini API versi gratis. Menurut ketentuan Google untuk
          layanan gratis, data yang dikirim dapat dipakai untuk meningkatkan produk
          Google, dan ketentuan itu bisa berubah. Karena itu{" "}
          <strong>jangan memasukkan informasi rahasia atau data pribadi orang lain</strong>{" "}
          ke kolom topik atau ide.
        </p>
      </Section>

      <Section title="Di mana data disimpan">
        <ul>
          <li>Database dan login: Supabase.</li>
          <li>
            Hosting aplikasi: Vercel, yang mencatat log akses standar (misalnya alamat
            IP dan waktu permintaan) untuk keperluan operasional.
          </li>
        </ul>
        <p>
          Akses antar akun dipisahkan di tingkat database (Row Level Security): akun
          lain tidak bisa membaca atau mengubah datamu.
        </p>
      </Section>

      <Section title="Cookie dan pelacak">
        <p>
          Plotline hanya memakai cookie yang dibutuhkan untuk menjaga kamu tetap
          masuk. Tidak ada iklan, tidak ada pelacak pihak ketiga, dan data tidak
          dijual.
        </p>
      </Section>

      <Section title="Menghapus data">
        <ul>
          <li>
            <strong>Semua ide dan script:</strong> Pengaturan, lalu Hapus Semua Ide.
          </li>
          <li>
            <strong>Seluruh akun:</strong> hubungi <Contact /> dan sebutkan email
            akunmu. Akun dan datanya akan dihapus.
          </li>
        </ul>
      </Section>

      <Section title="Perubahan dan kontak">
        <p>
          Halaman ini bisa diperbarui seiring Plotline berkembang. Tanggal di bagian
          atas menunjukkan versi terakhir. Pertanyaan tentang data: <Contact />.
        </p>
      </Section>
    </LegalPage>
  );
}