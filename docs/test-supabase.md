# Plotline: Checklist Tes Perilaku Supabase

Tujuan: memastikan yang tersimpan di database benar-benar tersimpan, dan data antar akun tidak bocor.
Cara: jalankan satu per satu di aplikasi asli (`npm run dev`). Tiap tes punya **langkah** dan **lulus jika**.
Kalau gagal, catat: nomor tes, apa yang lo lihat, dan pesan error di layar atau terminal. Kirim ke gue.

Siapkan dulu: 1 akun uji dengan minimal 2 ide di Papan. Kalau jatah AI habis, pakai SQL reset kuota dev yang sudah gue kasih sebelumnya (hanya untuk dev, bukan production).

---

## A. Data tersimpan (10 tes)

| # | Tes | Langkah | Lulus jika |
|---|---|---|---|
| 1 | Centang shot tersimpan | Buka script sebuah ide. Centang 2 shot. Refresh halaman (F5) | Dua shot itu masih tercentang |
| 2 | Buat Ulang mereset centang | Di script yang sudah ada centangnya, klik "Buat Ulang" | Script baru muncul, semua centang kosong. Jatah AI berkurang 1 |
| 3 | Tandai Siap Syuting | Di halaman script, klik "Tandai Siap Syuting". Buka Papan | Ide itu pindah ke kolom Syuting. Refresh, tetap di sana |
| 4 | Generate, Simpan, Buka script | Generate ide, simpan satu, buka dari Papan, buat script | Ide muncul di Papan, script terbuka dan tersimpan. Tutup tab, buka lagi, script masih ada tanpa memotong jatah |
| 5 | Jadwal Kalender tersimpan | Di Kalender, seret satu ide dari backlog ke sebuah hari. Refresh | Ide tetap di hari itu dan hilang dari backlog |
| 6 | Lepas jadwal | Klik "Lepas" pada ide terjadwal (atau seret ke backlog). Refresh | Ide kembali ke backlog dan tetap di sana |
| 7 | Pengaturan tersimpan | Pengaturan: ubah niche dan platform, Simpan. Buka Generate | Niche dan platform di Generate sudah mengikuti yang baru |
| 8 | Hapus Semua Ide | Pengaturan: Hapus Semua Ide. Coba ketik salah dulu, lalu ketik `HAPUS` | Salah ketik: tombol tidak jalan. `HAPUS`: Papan kosong dan empty state muncul. **Pakai akun uji.** |
| 9 | Lewati onboarding | Akun baru: di onboarding klik "Lewati untuk sekarang" | Masuk `/dashboard` tanpa error. Tidak dikembalikan ke onboarding terus-menerus |
| 10 | Jatah habis | Habiskan 10/10 generate (atau set lewat SQL dev). Buka Generate | Tampil layar "jatah habis" dengan hitung mundur, bukan error mentah. Tombol generate tidak bisa memanggil Gemini |

Cek ganda di Supabase: buka **Table Editor**, tabel `ideas` / `scripts`. Data dari tes 1, 3, 5 harus terlihat di sana (status, scheduled_at, centang pada kolom shots).

---

## B. Keamanan antar akun (RLS), wajib sebelum publik

Siapkan dua akun dengan alias Gmail: `namalo+tes1@gmail.com` dan `namalo+tes2@gmail.com` (keduanya masuk ke inbox yang sama). Pakai dua browser berbeda, atau satu browser biasa dan satu jendela incognito.

| # | Tes | Langkah | Lulus jika |
|---|---|---|---|
| 11 | Data tidak bocor di Papan | Akun 1 punya 2 ide. Login akun 2 | Papan akun 2 kosong, tidak melihat ide akun 1 |
| 12 | Akses langsung lewat URL | Di akun 1, salin URL satu ide (`/ideas/<id>`). Login akun 2, tempel URL itu | Tampil halaman tidak ditemukan atau diarahkan pergi. **Tidak** menampilkan isi ide akun 1 |
| 13 | Kalender terpisah | Akun 1 jadwalkan ide. Cek Kalender akun 2 | Kalender dan backlog akun 2 kosong |
| 14 | Hapus tidak menyentuh akun lain | Akun 2: Hapus Semua Ide. Kembali ke akun 1 | Semua ide akun 1 masih utuh |
| 15 | Kuota terpisah | Pakai 3 generate di akun 1. Cek jatah akun 2 | Jatah akun 2 masih penuh (10/10) |
| 16 | Halaman butuh login | Logout, lalu buka `/dashboard`, `/calendar`, `/settings` | Semuanya mengarah ke `/login` |

Catatan penting: **jangan** menguji RLS lewat SQL Editor Supabase. SQL Editor berjalan dengan hak penuh dan melewati RLS, jadi hasilnya selalu "terlihat" dan menyesatkan. Tes harus lewat aplikasi.

---

## C. Kuota dan error

| # | Tes | Langkah | Lulus jika |
|---|---|---|---|
| 17 | Jatah berkurang tepat | Catat jatah. Generate sekali. Cek lagi | Berkurang tepat 1 |
| 18 | Refresh tidak memotong jatah | Setelah generate, refresh halaman | Jatah tidak berkurang lagi |
| 19 | Error ramah | Matikan internet atau isi `GEMINI_API_KEY` palsu sementara, lalu generate | Muncul pesan yang bisa dipahami, bukan teks error mentah atau layar putih. Kembalikan key setelahnya |
| 20 | Input aneh | Generate dengan topik kosong, lalu topik sangat panjang (lebih dari 500 karakter) | Ada pesan validasi, aplikasi tidak crash |

Catatan: panggilan Gemini yang gagal tetap memotong 1 jatah. Ini trade-off yang sudah disepakati, jadi di tes 19 itu bukan bug.

---

## D. Hasil

Tulis hasil tiap tes: ✅ lulus, ❌ gagal, atau ◐ aneh tapi tidak parah.

Urutan prioritas jika ada yang gagal:
1. Tes 11 sampai 16 (kebocoran data): perbaiki sebelum apa pun
2. Tes 1 sampai 10 (data hilang): perbaiki sebelum diuji ke orang lain
3. Sisanya: perbaiki sesuai urutan temuan