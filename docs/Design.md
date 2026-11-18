# DESIGN.md: aturan desain (wajib dibaca AI sebelum mengerjakan UI)

Gaya: **bento modern**. Kartu rounded besar, satu warna aksen berani, tipografi tebal, banyak ruang kosong.

## Warna
- background: #F6F5F1 (putih hangat)
- surface (kartu): #FFFFFF
- ink (teks utama): #14141A
- muted (teks sekunder): #6B6B76
- primary (aksen utama): #C6F432 (lime)
- secondary (aksen kedua): #8B5CF6 (ungu)
- sky (aksen pendukung): #BFE3FF
- border: #E8E6DF
- Aturan: satu halaman maksimal satu warna aksen dominan. Teks di atas lime harus memakai ink.

## Tipografi
- Font: Plus Jakarta Sans (heading + body)
- Hero: 56-72px, weight 800, line-height 1.05
- Heading section: 32-40px, weight 700
- Body: 16px, weight 400-500
- Satu kata di hero boleh di-highlight dengan pill/kotak berwarna primary

## Bentuk dan jarak
- Radius kartu: 24px, tombol: 999px (pill), input: 16px
- Padding kartu: 24px; jarak antar kartu: 16px
- Bayangan lembut: 0 8px 30px rgba(20,20,26,0.06)
- Layout grid bento 12 kolom; kartu berukuran beda-beda (1x1, 2x1, 2x2)

## Komponen
- Gunakan shadcn/ui untuk Button, Card, Input, Dialog, Tabs. Jangan membuat komponen dasar dari nol.
- Tombol utama: latar primary, teks ink, pill. Tombol sekunder: outline border, latar putih.
- Kartu ide: judul, hook satu baris, chip platform, chip status.

## Gerak
- Transisi 150-250ms, ease-out. Hover kartu: naik 2px + bayangan sedikit lebih tebal.
- Tanpa animasi berlebihan.

## Responsif
- Mobile dulu. Breakpoint: 640 / 1024. Grid bento turun jadi 1 kolom di mobile.

## Aturan untuk AI
1. Baca file ini sebelum mengubah UI apa pun.
2. Jangan mengubah warna, font, atau layout bagian yang tidak disebut di prompt.
3. Kerjakan satu bagian per permintaan.
4. Jangan menambah library baru tanpa bertanya.
5. Setiap selesai satu bagian, ringkas file apa yang diubah.