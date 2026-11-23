# Plotline — Rencana Phase 2

Dibuat: 23 November 2026. Dasar: `PHASE2-STITCH-GAP.md` (daftar lengkap fitur yang ditunda), `PHASE1-PROGRESS.md`, dan `NOTES.md`.

## Tujuan

Plotline sekarang proyek pribadi tanpa penguji, jadi Phase 2 punya tiga tujuan:

1. **Aman dibuka ke publik** kapan pun siap (Privasi, Syarat, Confirm email).
2. **Nyaman dipakai sendiri setiap hari**, karena memakai produk sendiri adalah sumber masukan terbaik saat belum ada penguji.
3. **Tetap bisa diceritakan** di portofolio: tiap sprint menghasilkan satu hal yang bisa didemokan.

## Aturan kerja

- **Satu sprint = satu minggu = sekitar 4 sesi** (10–12 jam). Satu sesi kira-kira 2–3 jam.
- Usaha: **S** kurang dari 1 sesi, **M** 1–2 sesi, **L** beberapa sesi. Item L tidak masuk Phase 2 ini.
- Setiap item punya **"selesai jika"**, supaya jelas kapan berhenti.
- **Pakai Plotline untuk rencana konten lo sendiri** mulai Sprint 2, dan catat semua yang mengganggu di `docs/DOGFOOD-LOG.md` (tanggal, apa yang terjadi, seberapa mengganggu). Isi log itu yang menentukan sprint berikutnya, bukan tebakan.
- Sebelum push, jalankan `npm run build` di komputer sendiri.

---

## Sprint 1: Siap publik (4 sesi)

**Sprint 1 selesai (23 Nov 2026).** Item 1, 3, dan 5 selesai dan dites. Item 4 dicoret (alasannya di tabel). Item 2 diselesaikan dengan jalan 2: Confirm email dinyalakan dengan SMTP bawaan Supabase, dan pendaftaran umum ditutup lewat saklar `SIGNUP_OPEN` di `lib/signup.ts`.

| # | Pekerjaan | Usaha | Selesai jika |
|---|---|---|---|
| 1 ✅ | Halaman **Privasi** dan **Syarat** (isi singkat dan jujur: data apa yang disimpan, ke mana dikirim, cara hapus) | S | Dua halaman bisa dibuka dari footer, tautan "Segera hadir" di footer jadi aktif |
| 2 ✅ | **Confirm email** dinyalakan dengan SMTP sendiri (misalnya Resend, gratis) | M | Daftar akun baru harus klik tautan di email, lalu bisa masuk. Redirect URLs Supabase tetap cocok |
| 3 ✅ | Halaman **404 ramah** (termasuk "Ide tidak ditemukan") | S | URL ide yang tidak ada atau milik akun lain menampilkan halaman bergaya aplikasi, bukan 404 polos |
| 4 ❌ | ~~**Kembalikan jatah** kalau panggilan Gemini gagal~~ **Dicoret.** Fungsi pengembalian harus bisa dipanggil dari aplikasi, jadi pengguna bisa memanggilnya sendiri lewat browser setelah tiap generate dan jatahnya tidak pernah habis. Tanpa kunci admin di server tidak ada cara aman, jadi trade-off "gagal tetap memotong jatah" dipertahankan | S–M | Matikan internet atau pakai key palsu, generate: jatah tidak berkurang. Tes 19 di `TEST-SUPABASE.md` diperbarui |
| 5 ✅ | Chip **"Jatah"** di hero Generate ikut berkurang setelah generate | S | Setelah generate, angka di chip langsung turun tanpa refresh |

Catatan keputusan item 2: SMTP bawaan Supabase hanya mengirim ke anggota tim dan dibatasi 2 email per jam, sedangkan Brevo dan Resend butuh domain sendiri. Selama belum ada domain, pendaftaran ditutup. Untuk membukanya: beli domain, pasang SMTP custom, lalu ubah `SIGNUP_OPEN` ke `true`.

Catatan lama: item 2 butuh akun layanan email dan pengaturan DNS bila memakai domain sendiri. Kalau terasa berat, mulai dari SMTP bawaan Supabase untuk uji, lalu pindah.

## Sprint 2: Inti produk, bagian satu (4 sesi)

Mulai dari quick wins di `PHASE2-STITCH-GAP.md` bagian 0, karena datanya sudah ada.

| # | Pekerjaan | Usaha | Selesai jika |
|---|---|---|---|
| 1 | **Edit ide** (judul, hook, platform) | S–M | Ide bisa diubah dari kartu, perubahan tetap setelah refresh, divalidasi di server |
| 2 | Tampilkan **hook di kartu backlog** Kalender | S | Kartu backlog menampilkan hook satu baris |
| 3 | **Progress shot list** ("3 / 8 shot") di kartu Syuting | S | Angka cocok dengan centang di halaman script |
| 4 | Statistik **"Terbit minggu ini"** (bukan total) | S | Hanya menghitung ide terbit dalam 7 hari terakhir. Butuh `published_at` |
| 5 | Tombol **"+" di tiap kolom** Papan | S | Ide baru langsung masuk ke kolom yang dipilih |
| 6 | **Target rilis** ("n konten per hari") dari frekuensi posting di profil | S | Tampil di header Kalender, dihitung dari data profil |

## Sprint 3: Inti produk, bagian dua (4 sesi)

| # | Pekerjaan | Usaha | Selesai jika |
|---|---|---|---|
| 1 | **Edit script** (naskah dan shot) | M | Setiap scene dan shot bisa diubah dan disimpan ke database. "Buat Ulang" tetap bisa menimpa dengan peringatan |
| 2 | **Tambah, hapus, dan urutkan scene** | M | Scene baru bisa ditambah manual, urutan tersimpan |
| 3 | **Seret Kalender ke dnd-kit** | M | Seret ide ke hari lain jalan dengan mouse dan sentuh. Tombol "Tambah" di HP tetap ada |

## Sprint 4: Output AI dan ekspor (4 sesi)

| # | Pekerjaan | Usaha | Selesai jika |
|---|---|---|---|
| 1 | **Perluas output AI**: durasi per scene dan shot, instruksi suara, spesifikasi kamera, label A-Roll / B-Roll | M | Skema output divalidasi ulang, script lama tetap terbaca, tampil di halaman script |
| 2 | **Ekspor `.ics`** untuk jadwal tayang | S | File `.ics` bisa diimpor ke Google Calendar atau Apple Calendar |
| 3 | **Ekspor shot list** lewat cetak browser (PDF) | M | Satu halaman cetak rapi per ide |
| 4 | **Tone default** tersimpan di profil | S | Generate otomatis memakai tone dari profil |

---

## Setelah Sprint 4: tentukan dari log

Kandidat, dipilih berdasarkan `DOGFOOD-LOG.md`:

- **Kalender Bulanan** dan jam tayang per ide (M)
- **Profil**: nama, foto, multi-niche (M)
- **Login dengan Google** dan **lupa password** (S–M)
- **Pencarian ide** (M)
- **Tampilan Agenda** di Papan (M)

## Tidak dikerjakan di Phase 2

| Item | Alasan |
|---|---|
| Pembayaran, paket Pro | Butuh pengguna nyata dulu, dan di luar budget Rp0 |
| Analitik performa, API TikTok atau YouTube | Di luar cakupan, butuh integrasi luar |
| Kolaborasi tim, proyek atau sprint | Mengubah model data, nilainya belum terbukti |
| Notifikasi | Butuh tabel dan jadwal baru, belum ada kebutuhan |
| Mode Syuting layar penuh, batch shooting | Besar (L). Pertimbangkan setelah edit script selesai dan terpakai |
| Skor viral, angka "hemat waktu", metrik karangan | Tidak bisa diverifikasi, jangan dibuat |

## Penguji (ditunda)

Belum ada penguji, dan itu tidak menghalangi Phase 2. Kalau nanti ada 2 sampai 3 orang, ikuti urutan ini:

1. Kirim link dan satu tugas: bikin satu ide sampai script, lalu jadwalkan.
2. Catat di mana mereka berhenti atau bingung (jangan dijelaskan dulu).
3. Gabungkan temuan dengan `DOGFOOD-LOG.md`, lalu atur ulang sprint.

## Cara menutup tiap sprint

- Jalankan `npm run build`, lalu tes alurnya di `plotline-creator.vercel.app` setelah deploy.
- Perbarui `PHASE1-PROGRESS.md` (atau buat `PHASE2-PROGRESS.md`) dan log di `NOTES.md`.
- Tambahkan satu paragraf ke case study kalau ada cerita yang layak (masalah, keputusan, hasil terukur).