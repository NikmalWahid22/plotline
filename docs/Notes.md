# NOTES.md: catatan keputusan teknis Plotline

File ini dicatat sambil jalan. Tujuannya: ingat kenapa sebuah keputusan diambil, dan jadi bahan cerita untuk case study dan interview.

## Keputusan teknis dan alasannya

| Keputusan | Alasan |
|---|---|
| **Next.js (App Router) + TypeScript** | Frontend dan backend dalam satu project. Server action dipakai untuk memanggil Gemini, jadi API key tetap di server (awalnya direncanakan route handler, lalu diganti, lihat tabel di bawah). Paling umum, jadi AI paling jago menulis kodenya. |
| **Bukan Vite + React murni** | Vite tidak punya server bawaan, jadi API key Gemini butuh tambahan seperti Supabase Edge Functions. Lebih banyak bagian yang bergerak. Opsi cadangan kalau Next.js terlalu berat di laptop. |
| **Tailwind + shadcn/ui** | Cocok dengan gaya bento di DESIGN.md. Komponen dasar tidak dibuat dari nol supaya tampilan konsisten. |
| **Supabase (free tier)** | Database, login, dan RLS dalam satu layanan. Gratis untuk skala portfolio. |
| **Gemini API (free tier)** | Gratis. Limit bisa berubah, cek dokumentasi resmi sebelum mendesain fitur yang bergantung padanya. |
| **dnd-kit** | Drag and drop. **Sudah dipakai di Papan** (21 Nov 2026). Kalender masih memakai drag bawaan browser, rencana diganti ke dnd-kit supaya jalan di layar sentuh. |
| **Vercel + GitHub** | Deploy otomatis tiap push, gratis. |
| **Publishable key, bukan anon key** | Supabase menghentikan key lama (anon dan service_role) mulai awal 2027. Nama variabel: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. |
| **Secret key / service_role tidak dipakai** | Itu kunci admin yang melewati RLS. Tidak boleh ada di frontend maupun dikirim ke AI. |
| **`proxy.ts`, bukan `middleware.ts`** | Next.js 16 mengganti nama file ini. Di Next.js 15 ke bawah, `proxy.ts` tidak pernah dipanggil. Cek versi dengan `npm ls next`. |
| **`getClaims()` untuk cek login di server** | Memverifikasi token. `getSession()` hanya membaca cookie yang bisa dipalsukan, jangan dipakai di kode server. |

### Keputusan yang diambil sambil membangun

| Keputusan | Alasan | Trade-off |
|---|---|---|
| **Server action, bukan route handler** untuk memanggil Gemini | Lebih sedikit kode, tetap hanya jalan di server, jadi API key tidak pernah sampai ke browser | Tidak ada endpoint publik yang bisa dites terpisah |
| **Kuota dihitung di database** (`consume_quota()`, 10 per hari, reset tengah malam WIB) | Kuota di browser bisa diakali. Di database, satu-satunya jalan adalah lewat akun | Panggilan Gemini yang gagal tetap memotong satu jatah (dipotong sebelum memanggil Gemini) |
| **Kuota dipotong sebelum Gemini dipanggil** | Mencegah akun membuang panggilan gratis dengan memutus koneksi | Pengguna bisa kehilangan jatah karena error di sisi Gemini |
| **RLS di semua tabel**, dites lewat aplikasi, bukan SQL Editor | SQL Editor berjalan dengan hak penuh dan melewati RLS, jadi hasilnya selalu "terlihat" dan menyesatkan | Tes harus manual dengan dua akun |
| **Publishable key, bukan anon key** | Supabase menghentikan key lama mulai awal 2027 | Nama variabel berbeda dari banyak tutorial |
| **Prompt Gemini dibatasi dan output divalidasi** | Mengurangi prompt injection dan hasil yang formatnya rusak | Hasil kadang ditolak walau isinya wajar |
| **Model default `gemini-3.5-flash-lite`**, cadangan lewat env (`GEMINI_MODEL`, `GEMINI_FALLBACK_MODEL`) | Gratis dan cepat, dan bisa diganti tanpa mengubah kode | Kualitas teks di bawah model yang lebih besar |
| **Next.js 16 Cache Components**: data per-request dibungkus `<Suspense>` dengan `await connection()` | Halaman statis tetap di-prerender, bagian yang butuh login dimuat belakangan | Aturan lebih ketat (misalnya `new Date()` tidak boleh di komponen yang di-prerender) |
| **Seret kartu dengan dnd-kit** | Mendukung mouse, sentuh, dan keyboard | Tambah satu dependensi |
| **Kartu pindah langsung (optimistic) lewat `useOptimistic`** | Terasa instan. Kalau server gagal, tampilan balik sendiri dan muncul pesan error | Kartu sempat terlihat pindah sebelum server mengonfirmasi |
| **Mouse harus geser 8px, sentuh harus tahan 0,25 detik** sebelum dianggap seret | Klik biasa dan scroll tetap jalan | Seret terasa sedikit "berat" di awal |
| **Perubahan tampilan HP lewat kelas responsif**, bukan komponen terpisah | Desktop tidak ikut berubah, satu kode untuk semua ukuran | Beberapa komponen punya banyak varian kelas |
| **Landing: angka dan klaim karangan dari desain Stitch dibuang** (testimoni, statistik, harga, metrik) | Tidak boleh memajang data palsu di produk sungguhan | Landing terlihat lebih sederhana dari desain awal |
| **Seret Kalender masih drag bawaan browser** | Cepat dibuat, tanpa dependensi | Tidak jalan di layar sentuh, di HP dipakai tombol "Tambah" |

## Keamanan (wajib dipatuhi)

1. API key Gemini hanya dipanggil dari server, tidak pernah dari browser.
2. Secret disimpan di `.env.local`, tidak di-commit. `.gitignore` memuat `.env*` dan `!.env.example`.
3. RLS aktif di semua tabel. User hanya akses datanya sendiri.
4. Validasi semua input di server sebelum diproses atau dikirim ke AI.
5. Error mentah dari API tidak ditampilkan ke user.
6. Kuota 10 generate per user per hari, dihitung lewat fungsi `consume_quota()` di database. Batas ditulis di dalam fungsi supaya tidak bisa diakali dari browser.

## Struktur data

- `profiles`: preferensi onboarding. Dibuat otomatis lewat trigger saat user mendaftar.
- `ideas`: kartu di papan (status: idea, filming, editing, published).
- `scripts`: script, shot list, ide thumbnail. Satu ide maksimal satu script.
- `usage_logs`: catatan pemakaian AI. User hanya bisa membaca, tidak bisa menulis langsung.

SQL lengkap ada di `supabase/schema.sql`.

## Struktur folder

- `app/`: halaman dan route (satu folder = satu URL)
- `app/*/actions.ts`: server action (simpan, pindah, hapus, generate). Tidak ada `app/api/` karena Gemini dipanggil lewat server action
- `components/`: komponen UI per fitur (`board/`, `calendar/`, `generate/`, `script/`, `landing/`, ...) dan `primitives/` untuk dasar seperti Card
- `lib/`: fungsi bantu dan koneksi (`lib/supabase/`, `lib/gemini/`)
- `types/`: tipe TypeScript
- `supabase/`: file SQL
- `design/`: screenshot referensi dari Stitch

## Log progres

- [x] PRD, DESIGN.md, desain Stitch (landing, dashboard, kalender)
- [x] Supabase project dibuat, `schema.sql` dijalankan
- [x] Project Next.js terpasang, font Plus Jakarta Sans dan warna brand aktif
- [x] Kode koneksi Supabase (`client.ts`, `server.ts`, `proxy.ts`)
- [x] Tes RLS antar-user (18 Nov 2026, tes 11 sampai 16 lulus)
- [x] Halaman login / sign up
- [x] Onboarding
- [x] Dashboard (papan) + empty state, termasuk seret kartu (dnd-kit)
- [x] Idea Generator (Gemini)
- [x] Script + shot list
- [x] Kalender mingguan
- [x] Settings + tampilan kuota
- [x] Landing page, tampilan HP untuk semua halaman
- [x] Deploy ke Vercel (`plotline-creator.vercel.app`)
- [x] Lighthouse di atas 85 (20 Nov 2026)
- [x] Case study proses: draf sudah ditulis (21 Nov 2026), tinggal mengisi bagian pribadi dan cerita Gemini
- [ ] ~~Uji ke 5 orang~~ **Diganti** dengan case study proses. Uji ke 2–3 orang jadi langkah berikutnya, bukan syarat Phase 1

## Masalah yang pernah muncul dan solusinya

- **`npm error notarget` dan `ECONNRESET` saat install:** koneksi putus di tengah pengunduhan. Solusi: hapus `node_modules` dan `package-lock.json`, atur retry npm, matikan VPN atau ganti jaringan, lalu `npm install` ulang.
- **`EPERM` saat npm membersihkan `node_modules`:** file terkunci oleh Windows atau antivirus. Solusi: tutup VS Code, restart laptop, hapus folder lewat Command Prompt.
- **Halaman tampil tanpa CSS:** package Tailwind belum utuh akibat instalasi gagal. Solusi: `npm install` ulang sampai selesai tanpa error, hapus folder `.next`, jalankan ulang.
- **Latar halaman hitam:** kemungkinan aturan dark mode dari template atau shadcn. Project ini hanya memakai tema terang (sesuai DESIGN.md). Perlu dibereskan di `globals.css` dan `page.tsx`.

### Masalah saat membangun dan deploy

Format: gejala, penyebab, solusi, pelajaran.

### 1. Build Vercel gagal, padahal jalan di komputer sendiri
- **Gejala:** `components/board/page.tsx: Type 'Idea' is not assignable to type 'BoardIdea'` saat deploy.
- **Penyebab:** ada salinan lama `page.tsx` yang nyasar di folder `components/board/`. `next dev` tidak memeriksa tipe semua file, tapi `next build` memeriksa semuanya. Vercel menjalankan `npm run build`.
- **Solusi:** `git rm components/board/page.tsx`, commit, push.
- **Pelajaran:** jalankan `npm run build` di komputer sendiri sebelum push. Dan **Redeploy** di Vercel hanya menjalankan ulang commit yang sama, jadi perbaikan harus lewat commit baru.

### 2. Dua proyek Vercel tanpa sengaja
- **Gejala:** muncul dua proyek, satu gagal dan satu berhasil.
- **Penyebab:** tiap "Import" membuat proyek baru, bukan memperbarui yang lama.
- **Solusi:** pertahankan yang punya environment variable dan statusnya Ready, hapus satunya.

### 3. Nama domain ditolak
- **Gejala:** `plotline.vercel.app` sudah dipakai, dan `plotline.studio.vercel.app` ditolak.
- **Penyebab:** nama `*.vercel.app` siapa cepat dia dapat, dan titik menandakan subdomain yang tidak lo miliki.
- **Solusi:** pakai tanda hubung (`plotline-creator.vercel.app`).
- **Pelajaran:** Site URL dan Redirect URLs di Supabase harus ikut diperbarui ke domain yang benar-benar dipakai.

### 4. Latar kotak-kotak landing tidak muncul
- **Gejala:** gradient grid tidak tampil di browser.
- **Penyebab:** `@utility` di `globals.css` tidak ikut terpakai (file belum tertimpa di sisi lo).
- **Solusi:** gradient ditulis inline di `app/page.tsx`.

### 5. Tampilan HP terlalu panjang
- **Gejala:** Generate hampir 3 layar, Script 4,6 layar, Kalender 2,7 layar di HP.
- **Solusi:** teks sekunder disembunyikan di HP, Script jadi tiga tab (Naskah, Shot List, Thumbnail), Kalender jadi strip 7 hari dengan daftar per hari.
- **Hasil terukur:** Generate 2,8 ke 1,4 layar, Script 4,6 ke 1,2 sampai 2,0 layar per tab, Kalender 2,7 ke 1,3 layar.
- **Pelajaran:** semua perubahan lewat kelas responsif supaya desktop tidak ikut berubah.

### 6. File uji ikut ter-commit
- **Gejala:** `test-gemini.mjs` dan file uji lain masuk repo.
- **Solusi:** `git rm --cached`, hapus file, lalu periksa riwayat dengan `git log -p --all | Select-String "AIza|eyJ|sb_secret|service_role"`. Hasilnya hanya teks dokumentasi dan potongan hash di `package-lock.json`, tidak ada key asli.

### 7. Peringatan hydration dari dnd-kit
- **Gejala:** `aria-describedby="DndDescribedBy-0"` berbeda dengan `-2` antara server dan browser.
- **Penyebab:** dnd-kit membuat ID otomatis yang berbeda di server dan di klien.
- **Solusi:** beri `id` tetap pada `DndContext`.

### 8. Skor Lighthouse berbeda jauh antar tes
- **Gejala:** `/dashboard` 71 dan 77 di satu tes, 95 dan 96 di tes lain.
- **Penyebab:** mode browser biasa memuat ekstensi (adblock dan sejenisnya) yang memperlambat halaman.
- **Solusi:** ukur di incognito, minimal dua kali, dan matikan "Clear storage" untuk halaman yang butuh login.

### 9. Masalah Gemini
**[ISI]** ceritakan dengan kata-kata lo sendiri: model yang sempat gagal atau tidak tersedia, kenapa ada model cadangan, dan format output yang harus divalidasi. Bagian ini paling kuat untuk case study kalau ceritanya nyata.

---

## Catatan kuota alat AI

- Antigravity (free): limit mingguan, dihitung dari kerja agent. Pakai Flash untuk tugas rutin, satu tugas kecil per prompt, plan dulu baru eksekusi.
- Quota Antigravity berbeda dari quota Gemini API milik aplikasi ini.
- Diskusi, riset, dan review kode dilakukan di chat terpisah supaya tidak memakan quota agent.

## Hasil terukur

| Yang diukur | Hasil | Tanggal |
|---|---|---|
| Tes perilaku Supabase | 20 dari 20 lulus (data, RLS dua akun, kuota, error) | 18 Nov 2026 |
| Lighthouse `/dashboard` (incognito, Mobile) | 95 dan 96 / A11y 95 / BP 100 / SEO 100 | 20 Nov 2026 |
| Lighthouse `/login` | 92 / 95 / 100 / 91 | 20 Nov 2026 |
| Lighthouse landing | 87 dan 95 / 91 / 100 / 91 | 20 Nov 2026 |
| Panjang halaman di HP | Generate 2,8 ke 1,4, Script 4,6 ke 1,2–2,0, Kalender 2,7 ke 1,3 layar | 18 Nov 2026 |
| Seret kartu di Papan | Lulus: pindah langsung, tetap setelah refresh, klik kartu tetap jalan | 21 Nov 2026 |

## Yang belum dan rencana berikutnya

- **Belum diuji ke pengguna lain.** Semua pengujian dilakukan sendiri. Kriteria PRD "3 dari 5 orang mau pakai lagi" belum terpenuhi.
- Seret di Kalender belum jalan di layar sentuh (rencana: ganti ke dnd-kit).
- Halaman Privasi dan Syarat belum ada (wajib sebelum link disebar luas).
- Hasil Generate baru tersimpan saat tombol Simpan ditekan.
- Chip "Jatah" di hero Generate (desktop) belum ikut berkurang setelah generate.
- Confirm email perlu dinyalakan (dengan SMTP sendiri) sebelum dibuka untuk publik, supaya akun palsu tidak menghabiskan kuota Gemini.

## Ide untuk v2 (di luar scope v1)

- Pelacak performa konten dan saran berbasis data
- Halaman share publik untuk satu ide dan script
- Versi mobile dashboard
- Seret Kalender ke dnd-kit, halaman Privasi dan Syarat, 404 yang lebih ramah