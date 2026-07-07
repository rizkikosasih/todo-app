# Todo App V2 - Gamified Task Management

Todo App V2 adalah pelacak tugas (To-Do List) modern berbasis web yang menggabungkan produktivitas harian dengan mekanika RPG (Role-Playing Game). Aplikasi ini merupakan pembaruan total dari versi V1 (legacy) untuk memberikan pengalaman pengguna yang lebih interaktif, responsif, dan menyenangkan.

---

## 🎮 Fitur Utama

### 1. Gamifikasi & RPG Engine

- **XP (Experience Points):** Selesaikan tugas utama untuk mendapatkan `+10 XP` dan sub-tugas untuk mendapatkan `+2 XP`.
- **Sistem Leveling:** Kumpulkan `100 XP` untuk menaikkan tingkat level Anda. Setiap kenaikan level akan memicu letupan konfeti visual yang meriah.
- **Daily Streaks:** Lacak konsistensi harian Anda. Menyelesaikan minimal satu tugas utama setiap hari akan menambah streak harian Anda. Jika terlewat satu hari saja, streak akan kembali ke 0.

### 2. Manajemen Tugas Lanjutan

- **Sub-Tugas (Checklists):** Pecah tugas besar Anda menjadi beberapa sub-tugas yang dapat dicentang secara mandiri.
- **Kategori & Prioritas:** Kelompokkan tugas berdasarkan label warna kategori (contoh: _Work, Personal, Leisure_) serta atur urgensi tugas (_High, Medium, Low_).
- **Tenggat Waktu (Due Dates):** Atur tanggal batas penyelesaian tugas dengan indikator peringatan keterlambatan (_overdue_).

### 3. Dashboard Produktivitas & Tema

- **Grafik Produktivitas Mingguan:** Visualisasi statistik jumlah tugas selesai selama 7 hari terakhir yang digambar menggunakan komponen SVG dinamis yang sangat ringan.
- **Mode Gelap & Terang:** Sistem peralihan tema instan yang ramah mata dan tersinkronisasi otomatis dengan `localStorage`.

### 4. Autentikasi Modern

- **Google Sign-In:** Sistem masuk cepat dan aman menggunakan Google OAuth2 Firebase Auth satu klik.

---

## 💻 Tech Stack

- **Framework Utama:** React 18 (Vite + TypeScript)
- **Manajemen State:** Zustand
- **Desain & Gaya:** Tailwind CSS & Lucide Icons
- **Backend:** Firebase Core (Authentication & Realtime Database)
- **Animasi & Visual:** Framer Motion & Canvas-Confetti

---

## 🚀 Memulai Proyek Secara Lokal

### Prasyarat

Pastikan Anda sudah menginstal Node.js (v18+) dan npm di perangkat Anda.

### 1. Kloning Repositori & Instalasi

Instal seluruh paket dependensi proyek:

```bash
npm install
```

### 2. Konfigurasi Environment Variables

Buat berkas `.env` di direktori root dan masukkan kredensial Firebase Anda:

```env
VITE_APP_FIREBASE_API_KEY=kunci_api_anda
VITE_APP_FIREBASE_AUTH_DOMAIN=domain_auth_anda
VITE_APP_FIREBASE_PROJECT_ID=id_proyek_anda
VITE_APP_FIREBASE_STORAGE_BUCKET=bucket_penyimpanan_anda
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=sender_id_anda
VITE_APP_FIREBASE_APP_ID=app_id_anda
VITE_APP_FIREBASE_MEASUREMENT_ID=measurement_id_anda
VITE_APP_FIREBASE_DATABASE_URL=url_realtime_database_anda
```

### 3. Menjalankan Server Pengembangan

Jalankan server lokal di port 4000:

```bash
npm run dev
```

Buka peramban Anda dan akses halaman di `http://localhost:4000`.

### 4. Build untuk Produksi

Lakukan bundling proyek untuk deployment:

```bash
npm run build
```

### 5. Format Kode

Merapikan spasi dan indentasi file proyek menggunakan Prettier:

```bash
npm run format
```
