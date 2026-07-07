IMPLEMENTATION PLAN: TODO APP V2 (MODERN UPGRADE)

FASE 1: GIT BACKUP & RELEASE V1

Tahap ini bertujuan mengamankan codebase lama secara permanen sebelum dilakukan pembersihan total (clean rewrite).

1. Pembuatan Branch Backup:

git checkout -b v1

2. Penerbitan Rilis Resmi (Tagging):

git tag -a v1.0.0 -m "Release Official Version 1"

3. Push ke Remote Repository:

git push origin v1 && git push origin v1.0.0

4. Kembali ke Branch Kerja Baru (feat/v2-modern-upgrade):

git checkout main

git checkout -b feat/v2-modern-upgrade

FASE 2: PEMBERSIHAN & STRUKTURISASI ULANG

Karena versi lama telah dicadangkan sepenuhnya di branch v1, kita dapat mengosongkan folder root di branch feat/v2-modern-upgrade agar bersih dari file lama.

1. Penghapusan File Lama: Menghapus src/, public/, index.html, tailwind.config.js, postcss.config.js, vite.config.js, dan .eslintrc.cjs dari root.

2. Dokumentasi Rencana: Membuat folder docs/ dan menyimpan file rencana ini sebagai docs/upgrade-plan.md.

3. Struktur Folder Baru:

todo-app/

├── docs/

│   └── upgrade-plan.md

├── public/

├── src/

│   ├── components/

│   │   ├── ui/               <-- Shadcn UI primitives

│   │   ├── TodoItem.tsx

│   │   ├── DashboardStats.tsx

│   │   └── ThemeProvider.tsx

│   ├── store/

│   │   ├── useAuthStore.ts   <-- Zustand Auth Store

│   │   └── useTodoStore.ts   <-- Zustand Todo & Gamification Store

│   ├── hooks/

│   ├── pages/

│   │   ├── Login.tsx         <-- Google OAuth Only

│   │   ├── Home.tsx          <-- Dashboard & Todo List

│   │   └── NotFound.tsx

│   ├── lib/

│   │   ├── firebase.ts       <-- Firebase Config (Google Auth & Realtime DB)

│   │   └── utils.ts

│   ├── types/

│   │   └── index.ts          <-- TypeScript Interfaces

│   ├── App.tsx

│   ├── index.css

│   └── main.tsx

├── package.json

├── tsconfig.json

└── vite.config.ts

FASE 3: INSTALASI & KONFIGURASI TECH STACK BARU

1. Konfigurasi TypeScript: Inisialisasi tsconfig.json dan setup Vite untuk TypeScript (vite.config.ts).

2. Pustaka Utama (Dependencies):

- firebase (v10.9.0+) untuk Google Auth & Realtime DB.

- zustand untuk state management global yang ultra-lightweight.

- lucide-react untuk ikon modern.

- framer-motion & canvas-confetti untuk animasi dan selebrasi visual.

- recharts (atau visualisasi SVG kustom) untuk grafik produktivitas harian.

3. Setup Shadcn UI & Tailwind CSS:

- Inisialisasi Tailwind CSS dengan variabel CSS modern.

- Setup Shadcn UI untuk komponen UI premium seperti Button, Card, Dialog, Select, Dropdown, Checkbox, Input, dll.

FASE 4: IMPLEMENTASI FITUR MODERN

1. Satu Metode Autentikasi: Google OAuth2 Sign-In

- Firebase Integration: Mengonfigurasi GoogleAuthProvider dengan Firebase Auth.

- Minimalist Login Page: Halaman login estetik dan bersih dengan satu tombol terpusat: "Sign In with Google".

- Session Persistence: Sesi user disimpan di Zustand store dan tersinkronisasi otomatis dengan Firebase State Observer (onAuthStateChanged).

2. Sistem Gamification (XP, Level, & Streaks)

- XP Engine: Setiap tugas yang diselesaikan memberikan +10 XP. Setiap level memerlukan 100 XP untuk naik ke tingkat berikutnya.

- Daily Streaks: Logika untuk mendeteksi apakah pengguna menyelesaikan minimal satu tugas setiap harinya secara berurutan.

- Visual Celebration: Efek letupan confetti dari canvas-confetti ketika pengguna berhasil naik level atau menyelesaikan target harian.

3. Manajemen Todo Lanjutan

- Subtasks (Checklist): Pengguna dapat membagi satu tugas utama menjadi sub-task (misalnya: "Belanja" -> Subtask: "Susu", "Roti", "Telur").

- Kategori & Tag: Pengelompokan tugas berdasarkan label warna (Work, Personal, Urgent, Leisure, dll).

- Prioritas & Due Dates: Pengaturan tingkat kepentingan (High, Medium, Low) beserta batas tanggal penyelesaian.

4. Dashboard Statistik & Dark Mode

- Statistik Produktivitas: Grafik sederhana yang menunjukkan visualisasi jumlah tugas yang diselesaikan selama seminggu terakhir.

- Dark/Light Mode: Integrasi mode gelap dan terang menggunakan Tailwind CSS (class strategy).
