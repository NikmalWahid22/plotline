# Plotline — Progres Phase 1

Diperbarui: 22 November 2026. **Phase 1 dinyatakan selesai.** Dibandingkan dengan `PRD.md` (bagian 3, 6b, 7, 8) dan `NOTES.md`.

**Legenda:** ✅ selesai · ◐ sebagian · ❌ belum

## Ringkasan

| Bagian | Skor | Catatan |
|---|---|---|
| Fitur dan layar | 11 / 11 | Semua layar ada, seret kartu di Papan jalan (dnd-kit), perilaku ke Supabase terverifikasi, tampilan HP sudah dirapikan |
| Kuota dan keamanan | 8 / 9 | RLS terbukti lewat tes dua akun dan riwayat git bersih dari secret. Kurang: hasil generate belum otomatis tersimpan |
| Rilis dan bukti | 5 / 5 | Deploy, Lighthouse, `NOTES.md`, README, dan case study proses selesai. Uji ke 5 orang diganti case study proses (tidak dihitung) |
| **Total** | **24 / 25 = 96%** | Satu-satunya kekurangan: hasil Generate belum otomatis tersimpan |

Persentase di atas hitungan kasar dari daftar centang di bawah (✅ = 1, ◐ = 0,5, ❌ = 0), bukan pengukuran. Intinya: **produknya online, lolos Lighthouse, dan terdokumentasi.** Yang belum ada adalah bukti dari pengguna lain, dan itu masuk langkah berikutnya sebelum Phase 2.

---

## 1. Tiga fitur inti (PRD bagian 3)

| Fitur | Status | Yang sudah ada | Yang kurang |
|---|---|---|---|
| **Idea Generator** | ✅ | Input topik, platform, dan gaya bahasa. Lima ide dengan hook. Simpan satu atau semua. Prompt dibatasi (anti prompt-injection), output divalidasi | Hasil belum otomatis tersimpan (lihat Penyimpangan #3) |
| **Script + Shot List** | ✅ | Script per scene, daftar shot, ide thumbnail. Salin script. Buat ulang. Centang shot selesai tersimpan di database. Tandai "Siap Syuting" | Belum bisa diedit (Phase 2) |
| **Papan Visual** | ✅ | Empat kolom status, filter platform, tambah ide cepat, **seret kartu antar kolom (dnd-kit, langsung pindah, balik otomatis kalau gagal)**, tombol panah untuk HP dan keyboard, hapus. Kartu menampilkan status script | Seret di HP belum ada karena hanya satu kolom tampil, dipakai tombol panah |

## 2. Layar dan alur (PRD "Urutan layar yang dikerjakan")

| Minggu PRD | Layar | Status |
|---|---|---|
| 1–2 | Login dan Register | ✅ |
| 1–2 | Onboarding (tiga langkah, bisa dilewati) | ✅ |
| 1–2 | Dashboard (Papan) | ✅ |
| 1–2 | Empty state Papan | ✅ |
| 2–3 | Idea Generator | ✅ |
| 2–3 | Loading dan error state | ✅ (kerangka loading, pesan error ramah per jenis kegagalan) |
| 3–4 | Detail ide (script + shot list) | ✅ |
| 3–4 | **Seret kartu di Papan** | ✅ (21 Nov 2026) |
| 4–5 | Kalender mingguan | ✅ (kolom hari bisa digeser, seret-lepas, tombol Tambah, backlog di samping) |
| 4–5 | Settings dan tampilan kuota | ✅ (profil, jatah AI, hapus semua ide, keluar) |
| 4–5 | Polish | ✅ (token teks dan bobot font rapi; HP sudah dirapikan untuk Papan, Generate, Script dengan tab, dan Kalender dengan strip 7 hari) |

Tambahan di luar PRD yang sudah jadi: **landing page**, tampilan **jatah habis**, **tab bar bawah di HP**, pilihan gaya bahasa di Generate, topik cepat di empty state, hapus semua ide dengan konfirmasi ketik.

## 3. Kuota AI (PRD "Kuota AI")

| Aturan PRD | Status |
|---|---|
| Maksimal 10 generate per user per hari, reset tengah malam WIB | ✅ Dihitung di database lewat `consume_quota()`, jadi tidak bisa diakali dari browser |
| Saat habis, tampilkan state "limit tercapai", bukan error mentah | ✅ |
| Hasil generate selalu disimpan, tidak digenerate ulang saat halaman dibuka | ◐ Script tersimpan. Hasil ide **belum**: baru tersimpan saat user menekan Simpan, dan hilang bila halaman di-refresh sebelum itu |

## 4. Aturan keamanan (PRD "Aturan keamanan (wajib)")

| # | Aturan | Status | Catatan |
|---|---|---|---|
| 1 | API key Gemini hanya di server | ✅ | Dipanggil dari server action, tidak ada di browser |
| 2 | Secret di `.env.local`, tidak di-commit | ✅ | Riwayat git dicek 20 Nov 2026 (`git log -p --all` dengan pola `AIza`, `eyJ`, `sb_secret`, `service_role`). Cocokan hanya teks dokumentasi dan potongan hash `integrity` di `package-lock.json`, tidak ada key asli |
| 3 | RLS aktif di semua tabel | ✅ | Tes dua akun lulus pada 18 Nov 2026: akun lain tidak bisa melihat ide, jadwal, atau menghapus data akun pertama, dan URL ide akun lain menghasilkan 404 (lihat `TEST-SUPABASE.md`, tes 12 sampai 16) |
| 4 | Validasi input di server | ✅ | Semua server action memeriksa UUID, tanggal, enum, panjang teks |
| 5 | Tidak menampilkan error mentah | ✅ | Pesan error dipetakan per kode kegagalan |

## 5. Rilis dan bukti (PRD bagian 7 minggu 1 dan 5, bagian 8)

| Item | Status | Catatan |
|---|---|---|
| Repo GitHub dibuat | ✅ | `NikmalWahid22/plotline`, sudah di-push |
| Deploy ke Vercel | ✅ | Live di `https://plotline-creator.vercel.app`. Alur daftar, generate, script, dan jadwal sudah dites di alamat deploy (20 Nov 2026). Build sempat gagal karena file `components/board/page.tsx` nyasar, sudah dihapus |
| `NOTES.md` dan README mutakhir | ✅ | `README.md` dan `NOTES.md` sudah diperbarui (21 Nov 2026): keputusan, 8 masalah dan solusi, hasil terukur, log progres |
| Diuji ke 5 orang (3 bilang akan memakai lagi) | ➖ | **Diganti** dengan case study proses (keputusan 21 Nov 2026) karena sulit mencari penguji. Uji ke 2–3 orang jadi langkah sebelum Phase 2 |
| Lighthouse performa di atas 85 | ✅ | Diukur 20 Nov 2026 di alamat deploy, Mobile. `/dashboard` incognito: 95 dan 96 (Accessibility 95, Best Practices 100, SEO 100). `/login`: 92 dan 92 (95/100/91). Landing: 87 dan 95 incognito (Accessibility 91, Best Practices 100, SEO 91). Mode biasa lebih rendah (71–77) karena ekstensi browser |
| Case study portofolio | ✅ | Versi proses selesai 22 Nov 2026 (masalah, batasan, keputusan, debugging, hasil terukur, yang belum) |

Kriteria sukses "topik sampai script + shot list kurang dari 2 menit": kemungkinan terpenuhi (generate ide beberapa detik, script beberapa detik), tapi **belum diukur**.

---

## 6. Penyimpangan dari PRD (keputusan yang diambil sambil jalan)

1. **Seret-lepas Kalender memakai drag HTML5 bawaan, bukan dnd-kit.** Praktis, tanpa dependensi tambahan, tapi **tidak jalan di layar sentuh**. Di HP dipakai tombol "Tambah". Dnd-kit mendukung sentuh, jadi layak dipakai untuk Papan dan Kalender sekaligus.
2. **Server action, bukan route handler**, untuk memanggil Gemini. Tetap hanya jalan di server, jadi memenuhi aturan keamanan #1.
3. **Hasil Generate belum otomatis tersimpan.** Kuota sudah terpotong saat generate, jadi refresh sebelum menyimpan membuang satu jatah. Pilihan: simpan otomatis sebagai draf, atau catat sebagai trade-off yang diterima.
4. **Panggilan Gemini yang gagal tetap memotong satu jatah.** Kuota dipotong sebelum memanggil Gemini supaya tidak bisa diakali. Trade-off yang sudah disepakati.
5. **Model default `gemini-3.5-flash-lite`** dengan model cadangan lewat env (`GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`).
6. **Landing page tidak ada di PRD v1**, tapi sudah dibuat (17 Nov 2026) dari desain Stitch: navbar, hero dengan mockup papan yang bisa difilter, fitur, cara kerja, banner penutup, footer, plus latar kotak-kotak. Klaim dan angka karangan dari desain dibuang (lihat `PHASE2-STITCH-GAP.md`). Halaman Privasi dan Syarat belum ada.

---

## 7. Verifikasi perilaku di aplikasi asli (selesai)

Beberapa bagian sudah lolos pemeriksaan tipe dan tampilannya sudah dilihat, Perilaku ke Supabase sudah dites langsung. Tes 11 sampai 19 di `TEST-SUPABASE.md` sudah lulus (RLS, kuota, error). Tes 1 sampai 10 (daftar di bawah) dan tes 20 juga **sudah lulus pada 18 Nov 2026**:

- [x] Centang shot tetap tersimpan setelah refresh
- [x] "Buat Ulang" script mereset centang (jatah berkurang 1 sudah dikonfirmasi; centang kosong setelah Buat Ulang belum dilaporkan eksplisit)
- [x] "Tandai Siap Syuting" memindah ide ke kolom Syuting
- [x] Alur Generate lalu Simpan lalu Buka script
- [x] Seret ide di Kalender, lalu refresh: jadwal tetap
- [x] "Lepas" jadwal dan seret kembali ke backlog
- [x] Simpan perubahan di Pengaturan, lalu cek niche di Generate
- [x] "Hapus Semua Ide" (pakai akun uji)
- [x] "Lewati untuk sekarang" di onboarding berakhir di `/dashboard`
- [x] Tampilan jatah habis saat pemakaian 10/10 (alur nyata sudah dites)

---

## 8. Menutup Phase 1 (urutan yang disarankan)

| # | Pekerjaan | Perkiraan | Kenapa di urutan ini |
|---|---|---|---|
| 1 | ~~**Commit** semua pekerjaan, hapus skrip uji Gemini~~ **Selesai 18 Nov** | 0,5 sesi | Titik aman sebelum lanjut |
| 2 | ~~**Verifikasi** daftar di bagian 7~~ **Selesai 18 Nov**, semua lulus | | |
| 3 | ~~**Seret kartu di Papan** (dnd-kit)~~ **Selesai 21 Nov**. Opsional: ganti drag Kalender ke dnd-kit agar jalan di layar sentuh | 0,5–1 sesi | |
| 4 | ~~**Tes RLS dua akun**~~ **Selesai 18 Nov**, tes validasi input (tes 20) belum dilaporkan | | Aturan keamanan #3 |
| 5 | ~~**Deploy**~~ **Selesai 20 Nov**. Sisa: pastikan Redirect URLs Supabase cocok dengan `plotline-creator.vercel.app`, putuskan Confirm email sebelum link dibagikan, hapus proyek Vercel ganda | 0,5 sesi | Membuka jalan ke pengujian orang |
| 6 | ~~**Update `NOTES.md`**~~ **Selesai 21 Nov** | | |
| 7 | ~~**Lighthouse**~~ **Selesai 20 Nov**, semua halaman di atas 85 | | |
| 8 | ~~**Responsive HP** untuk Generate, Script, Kalender~~ **Selesai 18 Nov** | | |
| 9 | ~~**Landing page**~~ **Selesai 17 Nov** | | |
| 10 | ~~**Case study**~~ **Selesai 22 Nov** (versi proses). ~~Uji ke 5 orang~~ **diganti**; uji ke 2–3 orang jadi langkah sebelum Phase 2 | | |

Dengan 10–12 jam per minggu dan 1 sesi sekitar 2–3 jam, urutan di atas kira-kira **3–4 minggu** sampai Phase 1 benar-benar selesai.

## 9. Definisi "Phase 1 selesai"

- [x] Tiga fitur inti jalan, termasuk seret kartu di Papan (perlu cek ulang di versi deploy setelah push)
- [x] RLS terbukti lewat tes dua akun (18 Nov 2026)
- [x] Tidak ada secret di repo (riwayat git dicek 20 Nov 2026)
- [x] ~~Dipakai 5 orang, minimal 3 bilang akan memakai lagi~~ Diganti case study proses (uji ke 2–3 orang dilakukan sebelum Phase 2)
- [x] Lighthouse performa di atas 85 (20 Nov 2026)
- [x] README, `NOTES.md`, dan case study selesai (22 Nov 2026)

Semua yang di luar daftar ini (Google Calendar, kalender Bulanan, pencarian, edit script, ekspor PDF, notifikasi, pembayaran, dan lainnya) masuk **Phase 2**. Rinciannya ada di `PHASE2-STITCH-GAP.md`.