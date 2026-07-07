# Workspace Agent Rules: Todo App V2

Dokumen ini berisi pedoman perilaku, standar kode, dan arsitektur yang **WAJIB** diikuti oleh setiap AI Agent yang bekerja dalam repositori ini.

---

## 1. Aturan Pemformatan & Pembersihan Kode

- **Auto-Format Terotomatisasi:** Setelah melakukan perubahan pada berkas kode (`.ts`, `.tsx`, `.css`, `.json`), Anda **WAJIB** menjalankan perintah formatter proyek sebelum mengakhiri turn Anda:
  ```powershell
  npm run format
  ```
  atau menjalankan Prettier secara manual pada berkas yang diubah:
  ```powershell
  npx prettier --write <path-file>
  ```
- **No Unused Code:** Jangan meninggalkan variabel, import, atau komentar boilerplate yang tidak terpakai. Bersihkan sebelum menyelesaikan pekerjaan.

---

## 2. Standar TypeScript & Penulisan Kode

- **Tipe Data Kuat (Strong Typing):** Hindari penggunaan tipe data `any`. Tulis antarmuka (interface) atau type alias secara jelas di `src/types/index.ts`.
- **Komponen Fungsional:** Gunakan komponen fungsional React dengan tipe `React.FC` atau deklarasi fungsi standar dengan parameter tipe eksplisit.
- **Destructuring Props:** Lakukan destructuring props untuk kejelasan kode.
- **Handling Null/Undefined:** Selalu lakukan pengecekan defensif terhadap data dari database Firebase untuk mencegah crash (misalnya gunakan optional chaining `todo.subtasks?.someId`).

---

## 3. Desain, CSS & Antarmuka (Aesthetics Guidelines)

- **Desain UI Premium:** Gunakan estetika modern:
  - Gunakan palet warna HSL modern yang dikonfigurasi melalui variabel CSS di `src/index.css`.
  - Hindari warna-warna dasar mentah (plain red/blue/green).
  - Tambahkan efek hover, transisi halus, dan animasi mikro menggunakan `framer-motion`.
- **Shadcn UI & Tailwind:**
  - Komponen primitif ditempatkan di `src/components/ui/`.
  - Kustomisasi tampilan dilakukan langsung melalui kelas Tailwind CSS di dalam berkas komponen terkait.
  - Tetap gunakan strategi kelas (`class` strategy) untuk dukungan mode gelap/terang.

---

## 4. State Management & Database

- **Zustand Stores:**
  - Logika autentikasi dan status pengguna dikelola oleh `useAuthStore` di `src/store/useAuthStore.ts`.
  - Logika Todo, Subtasks, statistik produktivitas, dan gamifikasi (XP, Level, Streak) dikelola oleh `useTodoStore` di `src/store/useTodoStore.ts`.
- **Firebase Realtime DB:**
  - Semua transaksi database dilakukan melalui store Zustand untuk memisahkan UI dan data.
  - Hindari pemanggilan API Firebase langsung di dalam komponen UI, kecuali di dalam hooks/stores.
  - Pastikan listener database dilepas (`off` atau unsubscribe) ketika komponen di-unmount atau user melakukan logout untuk mencegah kebocoran memori.
