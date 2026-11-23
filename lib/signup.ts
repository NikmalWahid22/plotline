// Saklar pendaftaran. Selama Confirm email memakai SMTP bawaan Supabase, hanya anggota
// tim proyek yang bisa menerima email konfirmasi, jadi pendaftaran umum ditutup.
// Ganti ke true setelah SMTP custom (domain sendiri) aktif.
export const SIGNUP_OPEN = false;

export const SIGNUP_CLOSED_NOTE =
  "Pendaftaran masih tertutup. Plotline sedang menjadi proyek pribadi.";