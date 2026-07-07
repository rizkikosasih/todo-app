# Standar Operasional Prosedur (SOP) & Alur Kerja Pengembang (Agent Workflow)

Dokumen ini menjelaskan langkah-langkah prosedural bagi AI Agent untuk menyelesaikan migrasi dan pengembangan Todo App V2 secara konsisten.

---

## Alur Kerja Langkah-Demi-Langkah (Step-by-Step Execution Workflow)

### **Langkah 1: Pencadangan Repositori (Git Backup)**

Sebelum menyentuh file apa pun di root:

1. Pastikan status git bersih (`git status`).
2. Buat branch backup bernama `v1`: `git branch v1` atau `git checkout -b v1`.
3. Buat tag rilis resmi: `git tag -a v1.0.0 -m "Release Official Version 1"`.
4. Kembali ke branch kerja utama (misal `feat/v2-modern-upgrade` dari `main`).

---

### **Langkah 2: Pembersihan Bersih (Clean Rewrite Setup)**

1. Hapus direktori lama: `src/`, `public/`, `index.html`.
2. Hapus file konfigurasi JavaScript: `tailwind.config.js`, `postcss.config.js`, `vite.config.js`, `.eslintrc.cjs`.
3. Simpan file rencana dan dokumentasi di dalam folder `docs/`.

---

### **Langkah 3: Inisialisasi Proyek TypeScript & Shadcn**

1. Instal dependensi TypeScript dan Vite TypeScript plugin.
2. Buat `tsconfig.json` dan pastikan konfigurasi path compiler (`paths` `@/*`) terarah ke `./src/*`.
3. Konfigurasi `vite.config.ts` untuk memproses ekstensi TypeScript dan mendukung path alias `@`.
4. Jalankan inisialisasi Tailwind CSS dan Shadcn UI:
   ```bash
   npx shadcn@latest init
   ```
   _Pilih pengaturan default: TypeScript, CSS Variables, Default Style, Slate/Zinc neutral color._

---

### **Langkah 4: Setup Autentikasi & Database di Zustand Store**

1. Buat file `src/lib/firebase.ts` untuk inisialisasi SDK Firebase v10+.
2. Buat `useAuthStore.ts` untuk mengelola sesi auth Google. Listener Firebase `onAuthStateChanged` harus dipicu di level aplikasi utama (`App.tsx`).
3. Buat `useTodoStore.ts` untuk mengelola database realtime:
   - Sinkronisasi data Todo real-time dengan Firebase.
   - Logika Gamifikasi: tambah XP (+10), hitung kenaikan level (XP >= 100), perbarui streak harian, dan picu letupan konfeti.

---

### **Langkah 5: Pembuatan Komponen UI & Halaman**

1. **Halaman Login (`Login.tsx`):**
   - Desain minimalis dan bersih dengan background gradient modern.
   - Satu tombol besar: "Sign in with Google".
2. **Halaman Dashboard / Utama (`Home.tsx`):**
   - Header berisi Profil Pengguna (Foto, Nama, Level, Streak).
   - Progress Bar XP interaktif dengan transisi animasi.
   - Grafik statistik mingguan (jumlah todo selesai 7 hari terakhir) yang digambar dengan SVG murni yang responsif atau Recharts.
   - Form penambahan Todo dengan opsi kategori, prioritas, dan due date.
   - List Todo menggunakan transisi letupan `framer-motion` saat diubah/dihapus.
3. **Komponen Item Todo (`TodoItem.tsx`):**
   - Menampilkan judul todo, tag kategori, badge prioritas, dan sisa hari/due date.
   - Daftar checklist subtasks yang bisa di-expand/collapse.
   - Tombol Edit, Delete, dan Checkbox status completed.

---

### **Langkah 6: Integrasi Letupan Konfeti (Gamification Visuals)**

1. Pasang paket `canvas-confetti` beserta tipe datanya `@types/canvas-confetti`.
2. Picu pemanggilan `confetti()` ketika Zustand mendeteksi adanya kenaikan level (_level up_) di store.

---

### **Langkah 7: Verifikasi & Auto-Formatting**

1. Pastikan proyek dapat di-build tanpa error TypeScript:
   ```bash
   npm run build
   ```
2. Jalankan formatter Prettier sebelum menyelesaikan tugas:
   ```bash
   npm run format
   ```
