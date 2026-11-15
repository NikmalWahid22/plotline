# PRD: Plotline (working title)

Content planner visual untuk kreator tech/creative. Versi 1, target selesai 5 minggu.

## 1. Masalah
Kreator tech/creative (developer yang bikin konten, desainer, motion artist, reviewer gadget) sering bingung:
- Ide konten tercecer di Notes, chat, dan tab browser
- Mengubah ide jadi script dan shot list memakan waktu
- Susah melihat gambaran konten satu minggu/bulan ke depan

## 2. Target user
Kreator solo di TikTok, Reels, YouTube Shorts, dan YouTube dengan topik tech/creative. Mengerjakan semuanya sendiri, waktu terbatas.

## 3. Fitur inti v1 (maksimal 3)
1. **Idea Generator**: input topik/niche + platform, output 5-10 ide konten lengkap dengan hook.
2. **Script + Shot List**: pilih satu ide, hasilnya script per scene (hook, isi, CTA) dan daftar shot (visual, durasi, catatan).
3. **Papan Visual**: semua ide tampil sebagai kartu bergaya bento, bisa diseret ke kolom status (Ide, Syuting, Edit, Terbit) dan ke kalender mingguan.

## 4. Tidak dibuat di v1
- Pelacak performa/analitik
- Integrasi posting otomatis ke sosmed
- Kolaborasi tim
- Pembayaran
- Aplikasi mobile native (cukup responsif)

## 5. Diferensiasi
- Khusus niche tech/creative: template dan bahasa yang relevan (contoh: "build in public", "before/after redesign", "review tools")
- Satu papan menyatukan ide, script, shot list, dan jadwal
- UI bergaya bento yang rapi dan konsisten

## 6. Stack (semua gratis)
- Next.js + TypeScript + Tailwind + shadcn/ui
- Supabase (database + auth), free tier
- Gemini API (free tier, cek limit terbaru sebelum implementasi)
- Deploy: Vercel; repo: GitHub

## 6b. Keputusan teknis (terkunci untuk v1)

### Stack final
| Kebutuhan | Pilihan |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling & komponen | Tailwind + shadcn/ui (ikuti DESIGN.md) |
| Database + auth | Supabase (free tier) |
| AI | Gemini API (free tier; cek limit terbaru di dokumentasi resmi sebelum implementasi) |
| Drag and drop | dnd-kit |
| Deploy | Vercel + GitHub |

### Aturan keamanan (wajib)
1. API key Gemini hanya dipanggil dari server (route handler Next.js), tidak pernah dari browser.
2. Semua secret disimpan di `.env.local` dan tidak boleh di-commit. Pastikan `.env*` ada di `.gitignore`.
3. Row Level Security (RLS) aktif di semua tabel: user hanya bisa membaca dan mengubah datanya sendiri.
4. Validasi semua input dari user di server sebelum diproses atau dikirim ke AI.
5. Jangan menampilkan pesan error mentah dari API ke user.

### Struktur data (3 tabel)
- `profiles`: id (sama dengan auth user id), niche, platforms (array), posting_frequency, created_at
- `ideas`: id, user_id, title, hook, platform, status (idea / filming / editing / published), scheduled_at, created_at
- `scripts`: id, idea_id, user_id, scenes (json: hook, body, cta + timestamp), shots (json: visual, durasi, catatan), thumbnail_ideas (json), created_at
- Tambahan untuk kuota: `usage_logs` (id, user_id, action, created_at)

### Kuota AI
- Maksimal 10 generate per user per hari (dihitung dari `usage_logs`, reset tengah malam WIB).
- Hasil generate selalu disimpan ke database, tidak digenerate ulang saat halaman dibuka.
- Saat kuota habis, tampilkan state "limit tercapai" (bukan error mentah).

### Urutan layar yang dikerjakan
1. Minggu 1-2: Login, Onboarding, Dashboard (board) + empty state
2. Minggu 2-3: Idea Generator, loading/error state
3. Minggu 3-4: Detail ide (script + shot list), drag and drop board
4. Minggu 4-5: Kalender mingguan, Settings + kuota, polish

### Catatan implementasi
- Tanggal, "hari ini", dan jumlah slot kalender dihitung dari data/tanggal sistem, bukan hardcode.
- Commit ke Git setiap satu bagian selesai dan berjalan.
- Catat keputusan teknis penting di `NOTES.md`.

## 7. Tahapan (10-12 jam/minggu)
| Minggu | Target |
|---|---|
| 1 | PRD final, riset 3-5 kompetitor, DESIGN.md, setup repo + deploy kosong, layout dasar |
| 2 | Idea Generator jalan (tanpa login) |
| 3 | Script + Shot List per ide |
| 4 | Auth + simpan data (Supabase) + Papan Visual drag and drop |
| 5 | Kalender mingguan, polish, uji ke 5 orang, tulis case study |

## 8. Kriteria sukses
- 5 orang asli mencoba dan 3 di antaranya bilang akan memakainya lagi
- Dari input topik sampai script + shot list selesai kurang dari 2 menit
- Skor Lighthouse performa di atas 85
- Case study portfolio selesai

## 9. Risiko
- Limit API gratis: batasi jumlah generate per user per hari, simpan hasil di database
- Desain berubah-ubah saat dibuat AI: patuhi DESIGN.md, commit per bagian
- Scope melebar: apa pun di luar bagian 3 masuk daftar v2