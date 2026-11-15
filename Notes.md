# NOTES.md: catatan keputusan teknis Plotline

File ini dicatat sambil jalan. Tujuannya: ingat kenapa sebuah keputusan diambil, dan jadi bahan cerita untuk case study dan interview.

## Keputusan teknis dan alasannya

| Keputusan | Alasan |
|---|---|
| **Next.js (App Router) + TypeScript** | Frontend dan backend dalam satu project. Route handler di server dipakai untuk menyimpan API key Gemini dengan aman. Paling umum, jadi AI paling jago menulis kodenya. |
| **Bukan Vite + React murni** | Vite tidak punya server bawaan, jadi API key Gemini butuh tambahan seperti Supabase Edge Functions. Lebih banyak bagian yang bergerak. Opsi cadangan kalau Next.js terlalu berat di laptop. |
| **Tailwind + shadcn/ui** | Cocok dengan gaya bento di DESIGN.md. Komponen dasar tidak dibuat dari nol supaya tampilan konsisten. |
| **Supabase (free tier)** | Database, login, dan RLS dalam satu layanan. Gratis untuk skala portfolio. |
| **Gemini API (free tier)** | Gratis. Limit bisa berubah, cek dokumentasi resmi sebelum mendesain fitur yang bergantung padanya. |
| **dnd-kit** | Drag and drop untuk papan kanban dan kalender. |
| **Vercel + GitHub** | Deploy otomatis tiap push, gratis. |
| **Publishable key, bukan anon key** | Supabase menghentikan key lama (anon dan service_role) mulai awal 2027. Nama variabel: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. |
| **Secret key / service_role tidak dipakai** | Itu kunci admin yang melewati RLS. Tidak boleh ada di frontend maupun dikirim ke AI. |
| **`proxy.ts`, bukan `middleware.ts`** | Next.js 16 mengganti nama file ini. Di Next.js 15 ke bawah, `proxy.ts` tidak pernah dipanggil. Cek versi dengan `npm ls next`. |
| **`getClaims()` untuk cek login di server** | Memverifikasi token. `getSession()` hanya membaca cookie yang bisa dipalsukan, jangan dipakai di kode server. |

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
- `app/api/`: kode server, tempat memanggil Gemini
- `components/`: potongan UI yang dipakai ulang (`ui/` dari shadcn)
- `lib/`: fungsi bantu dan koneksi (`lib/supabase/`, `lib/gemini.ts`)
- `types/`: tipe TypeScript
- `supabase/`: file SQL
- `design/`: screenshot referensi dari Stitch

## Log progres

- [x] PRD, DESIGN.md, desain Stitch (landing, dashboard, kalender)
- [x] Supabase project dibuat, `schema.sql` dijalankan
- [x] Project Next.js terpasang, font Plus Jakarta Sans dan warna brand aktif
- [x] Kode koneksi Supabase (`client.ts`, `server.ts`, `proxy.ts`)
- [ ] Tes RLS antar-user (user A tidak bisa baca data user B)
- [ ] Halaman login / sign up
- [ ] Onboarding
- [ ] Dashboard (papan) + empty state
- [ ] Idea Generator (Gemini)
- [ ] Script + shot list
- [ ] Kalender mingguan
- [ ] Settings + tampilan kuota
- [ ] Deploy ke Vercel
- [ ] Uji ke 5 orang, tulis case study

## Masalah yang pernah muncul dan solusinya

- **`npm error notarget` dan `ECONNRESET` saat install:** koneksi putus di tengah pengunduhan. Solusi: hapus `node_modules` dan `package-lock.json`, atur retry npm, matikan VPN atau ganti jaringan, lalu `npm install` ulang.
- **`EPERM` saat npm membersihkan `node_modules`:** file terkunci oleh Windows atau antivirus. Solusi: tutup VS Code, restart laptop, hapus folder lewat Command Prompt.
- **Halaman tampil tanpa CSS:** package Tailwind belum utuh akibat instalasi gagal. Solusi: `npm install` ulang sampai selesai tanpa error, hapus folder `.next`, jalankan ulang.
- **Latar halaman hitam:** kemungkinan aturan dark mode dari template atau shadcn. Project ini hanya memakai tema terang (sesuai DESIGN.md). Perlu dibereskan di `globals.css` dan `page.tsx`.

## Catatan kuota alat AI

- Antigravity (free): limit mingguan, dihitung dari kerja agent. Pakai Flash untuk tugas rutin, satu tugas kecil per prompt, plan dulu baru eksekusi.
- Quota Antigravity berbeda dari quota Gemini API milik aplikasi ini.
- Diskusi, riset, dan review kode dilakukan di chat terpisah supaya tidak memakan quota agent.

## Ide untuk v2 (di luar scope v1)

- Pelacak performa konten dan saran berbasis data
- Halaman share publik untuk satu ide dan script
- Versi mobile dashboard