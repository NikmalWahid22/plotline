# Plotline

Visual content planner untuk kreator tech dan creative. Satu papan untuk ide, hook, script, shot list, dan jadwal konten.

> Status: **Phase 1 selesai**. Fitur inti jalan, sudah diuji, dan sudah online di **[plotline-creator.vercel.app](https://plotline-creator.vercel.app)**. Rinciannya di [`docs/PHASE1-PROGRESS.md`](docs/PHASE1-PROGRESS.md).

## Yang bisa dilakukan

- **Generator ide:** tulis topik, pilih platform dan gaya bahasa, dapatkan lima ide dengan hook 3 detik pertama (Gemini).
- **Script dan shot list:** dari satu ide, dibuat script per scene, daftar shot yang bisa dicentang, dan ide thumbnail.
- **Papan visual:** empat tahap (Ide & Riset, Syuting, Edit & Grading, Terbit), seret kartu antar tahap, filter per platform, tambah ide cepat.
- **Kalender mingguan:** seret ide dari backlog ke hari tayang.
- **Pengaturan:** niche, platform, frekuensi posting, pemakaian jatah AI, hapus semua ide.
- **Jatah AI:** 10 generate per akun per hari, reset tengah malam WIB, dihitung di database.

## Stack

| Bagian | Pilihan |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components), TypeScript |
| Styling | Tailwind CSS v4 |
| Seret-lepas | dnd-kit |
| Database dan login | Supabase (Postgres, Auth, Row Level Security) |
| AI | Gemini API (free tier) lewat `@google/genai`, dipanggil dari server |
| Deploy | Vercel |

## Menjalankan di komputer sendiri

Butuh Node.js 20 atau lebih baru, dan project Supabase (gratis).

```bash
git clone <url-repo-ini>
cd <nama-folder>
npm install
cp .env.example .env.local
```

Isi `.env.local`:

| Variabel | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase |
| `GEMINI_API_KEY` | API key dari Google AI Studio. **Jangan di-commit** |
| `GEMINI_MODEL` | Opsional. Default `gemini-3.5-flash-lite` |
| `GEMINI_FALLBACK_MODEL` | Opsional. Model cadangan kalau model utama gagal |

Siapkan database: buka **SQL Editor** di dashboard Supabase, jalankan isi `supabase/schema.sql`. File itu membuat tabel, kebijakan RLS, dan fungsi kuota.

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Keamanan

- API key Gemini hanya dipakai di server, tidak pernah dikirim ke browser.
- RLS aktif di semua tabel. Sudah dites dengan dua akun: akun lain tidak bisa membaca, mengubah, atau menghapus data akun pertama, termasuk lewat URL langsung.
- Semua server action memvalidasi input (UUID, tanggal, enum, panjang teks).
- Kuota dipotong di database sebelum Gemini dipanggil, jadi tidak bisa diakali dari browser.
- Pesan error dipetakan ke bahasa yang ramah, tidak menampilkan error mentah.

## Struktur

```
app/          halaman dan server action
components/   komponen UI per fitur (board, calendar, generate, landing, ...)
lib/          fungsi bantu, koneksi Supabase, pemanggil Gemini
supabase/     skema SQL
docs/         catatan proyek
```

## Dokumen

| Dokumen | Isi |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Kebutuhan produk dan batasan Phase 1 |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Sistem desain (warna, huruf, kartu) |
| [`docs/NOTES.md`](docs/NOTES.md) | Keputusan teknis dan catatan masalah |
| [`docs/PHASE1-PROGRESS.md`](docs/PHASE1-PROGRESS.md) | Seberapa jauh Phase 1, dan sisanya |
| [`docs/PHASE2-STITCH-GAP.md`](docs/PHASE2-STITCH-GAP.md) | Fitur desain yang sengaja ditunda ke Phase 2 |
| [`docs/TEST-SUPABASE.md`](docs/TEST-SUPABASE.md) | Checklist tes data, RLS, dan kuota |

## Keterbatasan yang diketahui

- Seret kartu di Papan jalan di layar md ke atas. Di HP hanya satu kolom tampil, jadi pindah status lewat tombol panah. Seret-lepas di Kalender memakai drag bawaan browser, jadi belum jalan di layar sentuh (di HP dipakai tombol Tambah).
- Hasil generate baru tersimpan saat tombol Simpan ditekan.
- Panggilan Gemini yang gagal tetap memotong satu jatah.
- Belum ada halaman Privasi dan Syarat.

## Lisensi

Belum ditentukan.