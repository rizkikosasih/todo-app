# Product Requirements Document (PRD): Todo App V2 (Modern Gamified Todo)

## 1. Pendahuluan & Latar Belakang

Proyek ini adalah pembaruan besar-besaran (V2) dari aplikasi Todo List sederhana (V1). V1 menggunakan React JS, Material Tailwind, dan Firebase Authentication dengan metode Email/Password tradisional. Untuk meningkatkan keterlibatan pengguna (_user engagement_) dan kegunaan aplikasi (_usability_), V2 akan dikembangkan sebagai aplikasi web modern berbasis TypeScript, menggunakan Zustand untuk manajemen state, Tailwind CSS + Shadcn UI untuk antarmuka premium, serta integrasi sistem gamifikasi (XP, level, streaks, dan selebrasi visual).

## 2. Tujuan & Sasaran Proyek

- **Peningkatan Keterlibatan Pengguna:** Menggunakan mekanika permainan (gamifikasi) untuk memotivasi pengguna menyelesaikan tugas mereka.
- **Modernisasi Tech Stack:** Migrasi dari JavaScript ke TypeScript untuk keandalan kode, dan dari Material Tailwind ke Shadcn UI untuk visual yang lebih modern dan bersih.
- **Penyederhanaan UX:** Mengganti autentikasi email/password yang lambat dengan Google OAuth2 satu klik.
- **Fitur Todo Lanjutan:** Menyediakan subtasks, kategori/tag dengan warna, prioritas, batasan waktu (due dates), dan grafik statistik produktivitas.

## 3. Fitur Utama & Kebutuhan Fungsional

### F3.1: Autentikasi Google OAuth2 Terpusat

- **Sign-In:** Hanya ada satu metode masuk, yaitu tombol "Sign In with Google". Halaman Register dan Login lama dengan email/password akan dihapus.
- **Session Persistence:** Sesi masuk tetap bertahan menggunakan listener `onAuthStateChanged` Firebase Auth, disimpan di Zustand store.

### F3.2: Sistem Manajemen Todo Modern

- **CRUD Todo:** Menambah, melihat, mengubah text/detail, dan menghapus tugas.
- **Subtasks (Checklist):** Setiap todo dapat didefinisikan memiliki beberapa sub-tugas yang dapat dicentang secara mandiri.
- **Prioritas:** Memiliki level prioritas: _High_ (Merah), _Medium_ (Kuning), _Low_ (Biru/Hijau).
- **Batas Waktu (Due Dates):** Penentuan tanggal batas penyelesaian tugas dengan indikator keterlambatan (_overdue_).
- **Kategori & Tag:** Kategori khusus (seperti Work, Personal, Urgent, Leisure) dengan kode warna estetis.

### F3.3: Mesin Gamifikasi (XP, Level, & Streaks)

- **XP (Experience Points):**
  - Menyelesaikan 1 tugas utama = `+10 XP`.
  - Menyelesaikan 1 sub-tugas = `+2 XP` (opsional/tambahan motivasi).
- **Leveling System:** Setiap level memerlukan `100 XP`. Ketika XP menyentuh 100, level bertambah dan sisa XP dibawa ke level berikutnya.
- **Daily Streaks:** Menghitung jumlah hari berurutan di mana pengguna menyelesaikan minimal 1 todo utama. Jika sehari kosong, streak kembali ke 0.
- **Celebration FX:** Menampilkan letupan konfeti visual menggunakan library `canvas-confetti` dan transisi gerak halus menggunakan `framer-motion` saat pengguna naik level atau memecahkan rekor streak.

### F3.4: Dashboard Statistik & Dark Mode

- **Grafik Produktivitas:** Visualisasi sederhana jumlah todo yang selesai selama 7 hari terakhir (misal: Senin - Minggu). Menggunakan visualisasi SVG kustom yang ringan atau Recharts.
- **Tema Gelap & Terang:** Sistem peralihan tema instan (_dark/light mode_) menggunakan strategi kelas Tailwind CSS (`class` strategy) dan disimpan di `ThemeProvider` Zustand.

## 4. Struktur Data (Firebase Realtime Database)

Struktur database V2 akan memetakan model data baru berikut:

### `/users/$userId/stats`

```json
{
  "xp": 140,
  "level": 2,
  "streak": 5,
  "lastCompletedDate": "2026-07-06"
}
```

### `/todos/$userId/$todoId`

```json
{
  "id": "todo_id_string",
  "text": "Nama Todo Utama",
  "completed": false,
  "timestamp": 1783282900000,
  "priority": "high",
  "category": "Work",
  "dueDate": "2026-07-10",
  "subtasks": {
    "subtask_id_1": {
      "id": "subtask_id_1",
      "text": "Subtask 1",
      "completed": true
    }
  }
}
```

## 5. Kebutuhan Non-Fungsional (NFR)

- **Desain Responsif:** Tampilan harus optimal dari layar ponsel kecil (320px) hingga layar desktop besar (1440px+).
- **Aksesibilitas (A11y):** Komponen UI wajib menggunakan standar ARIA (didukung oleh Shadcn/Radix).
- **Kecepatan & Performa:** Menghindari library charting berat jika memungkinkan untuk mengurangi waktu muat. Mengutamakan Zustand yang ringan dibandingkan Redux.
- **Keamanan Tipe Data:** Penggunaan TypeScript (`strict: true`) di seluruh berkas aplikasi untuk meminimalisasi bug runtime.
