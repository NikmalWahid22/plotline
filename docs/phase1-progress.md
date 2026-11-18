# Plotline — Progres Phase 1

Diperbarui: 18 November 2026. Dibandingkan dengan `PRD.md` (bagian 3, 6b, 7, 8) dan `NOTES.md`.

**Legenda:** ✅ selesai · ◐ sebagian · ❌ belum

## Ringkasan

| Bagian | Skor | Catatan |
|---|---|---|
| Fitur dan layar | 9,5 / 11 | Semua layar ada dan perilaku ke Supabase sudah terverifikasi. Kurang: seret kartu di Papan, dan polish HP |
| Kuota dan keamanan | 7,5 / 9 | RLS sudah terbukti lewat tes dua akun. Kurang: verifikasi `.env` sebelum push |
| Rilis dan bukti | 0,5 / 5 | Belum deploy, belum diuji ke orang, belum ada case study |
| **Total** | **17,5 / 25 = 70%** | Sisi produk sekitar **85%**, sisi rilis dan bukti sekitar **10%** |

Persentase di atas hitungan kasar dari daftar centang di bawah (✅ = 1, ◐ = 0,5, ❌ = 0), bukan pengukuran. Intinya: **produknya hampir jadi, tapi belum ada yang membuktikan dan membuatnya bisa dipakai orang lain.** Sisa pekerjaan Phase 1 terutama di rilis, pengujian, dan satu fitur inti (seret kartu).

---

## 1. Tiga fitur inti (PRD bagian 3)

| Fitur | Status | Yang sudah ada | Yang kurang |
|---|---|---|---|
| **Idea Generator** | ✅ | Input topik, platform, dan gaya bahasa. Lima ide dengan hook. Simpan satu atau semua. Prompt dibatasi (anti prompt-injection), output divalidasi | Hasil belum otomatis tersimpan (lihat Penyimpangan #3) |
| **Script + Shot List** | ✅ | Script per scene, daftar shot, ide thumbnail. Salin script. Buat ulang. Centang shot selesai tersimpan di database. Tandai "Siap Syuting" | Belum bisa diedit (Phase 2) |
| **Papan Visual** | ◐ | Empat kolom status, filter platform, tambah ide cepat, pindah lewat tombol panah, hapus. Kartu menampilkan status script | **Seret kartu antar kolom belum ada** (PRD menyebut dnd-kit) |

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
| 3–4 | **Seret kartu di Papan** | ❌ |
| 4–5 | Kalender mingguan | ✅ (kolom hari bisa digeser, seret-lepas, tombol Tambah, backlog di samping) |
| 4–5 | Settings dan tampilan kuota | ✅ (profil, jatah AI, hapus semua ide, keluar) |
| 4–5 | Polish | ◐ (token teks dan bobot font sudah rapi; HP baru Papan yang dirapikan) |

Tambahan di luar PRD yang sudah jadi: tampilan **jatah habis**, **tab bar bawah di HP**, pilihan gaya bahasa di Generate, topik cepat di empty state, hapus semua ide dengan konfirmasi ketik.

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
| 2 | Secret di `.env.local`, tidak di-commit | ◐ | `NOTES.md` mencatat `.gitignore` memuat `.env*`. **Belum diverifikasi sebelum push pertama** (repo GitHub belum dibuat) |
| 3 | RLS aktif di semua tabel | ✅ | Tes dua akun lulus pada 18 Nov 2026: akun lain tidak bisa melihat ide, jadwal, atau menghapus data akun pertama, dan URL ide akun lain menghasilkan 404 (lihat `TEST-SUPABASE.md`, tes 12 sampai 16) |
| 4 | Validasi input di server | ✅ | Semua server action memeriksa UUID, tanggal, enum, panjang teks |
| 5 | Tidak menampilkan error mentah | ✅ | Pesan error dipetakan per kode kegagalan |

## 5. Rilis dan bukti (PRD bagian 7 minggu 1 dan 5, bagian 8)

| Item | Status | Catatan |
|---|---|---|
| Repo GitHub dibuat | ❌ | |
| Deploy ke Vercel | ❌ | PRD menargetkan "deploy kosong" di minggu 1. Belum dilakukan |
| `NOTES.md` dan README mutakhir | ◐ | `NOTES.md` ada, tapi log progres masih menunjukkan hampir semua kotak kosong, dan cerita debugging Gemini belum masuk |
| Diuji ke 5 orang (3 bilang akan memakai lagi) | ❌ | Butuh link deploy lebih dulu |
| Lighthouse performa di atas 85 | ❌ | Belum diukur |
| Case study portofolio | ❌ | |

Kriteria sukses "topik sampai script + shot list kurang dari 2 menit": kemungkinan terpenuhi (generate ide beberapa detik, script beberapa detik), tapi **belum diukur**.

---

## 6. Penyimpangan dari PRD (keputusan yang diambil sambil jalan)

1. **Seret-lepas Kalender memakai drag HTML5 bawaan, bukan dnd-kit.** Praktis, tanpa dependensi tambahan, tapi **tidak jalan di layar sentuh**. Di HP dipakai tombol "Tambah". Dnd-kit mendukung sentuh, jadi layak dipakai untuk Papan dan Kalender sekaligus.
2. **Server action, bukan route handler**, untuk memanggil Gemini. Tetap hanya jalan di server, jadi memenuhi aturan keamanan #1.
3. **Hasil Generate belum otomatis tersimpan.** Kuota sudah terpotong saat generate, jadi refresh sebelum menyimpan membuang satu jatah. Pilihan: simpan otomatis sebagai draf, atau catat sebagai trade-off yang diterima.
4. **Panggilan Gemini yang gagal tetap memotong satu jatah.** Kuota dipotong sebelum memanggil Gemini supaya tidak bisa diakali. Trade-off yang sudah disepakati.
5. **Model default `gemini-3.5-flash-lite`** dengan model cadangan lewat env (`GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`).
6. **Landing page tidak ada di PRD v1**, tapi ada di daftar rencana. `app/page.tsx` sekarang hanya mengarahkan ke `/dashboard`.

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
| 1 | **Commit** semua pekerjaan, cek kelengkapan file, hapus `test-gemini.mjs`, `list-models.mjs`, `test-models.mjs` | 0,5 sesi | Titik aman sebelum lanjut |
| 2 | ~~**Verifikasi** daftar di bagian 7~~ **Selesai 18 Nov**, semua lulus | | |
| 3 | **Seret kartu di Papan** (dnd-kit), dan ganti drag Kalender ke dnd-kit agar jalan di HP | 1–2 sesi | Satu-satunya fitur inti PRD yang masih kurang |
| 4 | ~~**Tes RLS dua akun**~~ **Selesai 18 Nov**, tes validasi input (tes 20) belum dilaporkan | | Aturan keamanan #3 |
| 5 | **Deploy**: cek secret, buat repo GitHub, hubungkan Vercel, isi Redirect URLs Supabase, nyalakan lagi Confirm email | 1 sesi | Membuka jalan ke pengujian orang |
| 6 | **Update `NOTES.md` dan README** (log progres, cerita debugging Gemini) | 0,5 sesi | Bahan case study |
| 7 | **Lighthouse** dan perbaikan seperlunya | 1 sesi | Kriteria sukses PRD |
| 8 | **Responsive HP** untuk Generate, Script, Kalender (kurangi kartu dan elemen) | 1–2 sesi | Pengujian oleh orang kemungkinan besar lewat HP |
| 9 | ~~**Landing page**~~ **Selesai 17 Nov** | | |
| 10 | **Uji ke 5 orang**, tulis **case study** | 2–3 sesi | Bukti untuk portofolio |

Dengan 10–12 jam per minggu dan 1 sesi sekitar 2–3 jam, urutan di atas kira-kira **3–4 minggu** sampai Phase 1 benar-benar selesai.

## 9. Definisi "Phase 1 selesai"

- [ ] Tiga fitur inti jalan di versi deploy, termasuk seret kartu di Papan
- [x] RLS terbukti lewat tes dua akun (18 Nov 2026)
- [ ] Tidak ada secret di repo
- [ ] Dipakai 5 orang, minimal 3 bilang akan memakai lagi
- [ ] Lighthouse performa di atas 85
- [ ] README, `NOTES.md`, dan case study selesai

Semua yang di luar daftar ini (Google Calendar, kalender Bulanan, pencarian, edit script, ekspor PDF, notifikasi, pembayaran, dan lainnya) masuk **Phase 2**. Rinciannya ada di `PHASE2-STITCH-GAP.md`.