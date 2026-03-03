# 1️⃣ Analisa Sistem

## A. Permasalahan Saat Ini
1.	Antrian manual → menumpuk pada hari pelayanan.
2.	Tidak ada pembatasan kuota harian terkontrol.
3.	Orang tua datang pagi-pagi untuk ambil nomor.
4.	Tidak ada estimasi waktu layanan.
5.	Petugas kesulitan monitoring jumlah pasien real-time.
6.	Tidak ada dashboard statistik kunjungan.

## B. Tujuan Sistem
1.	Mengurangi antrian fisik.
2.	Membatasi kuota pelayanan per hari.
3.	Memberikan estimasi waktu layanan.
4.	Meningkatkan efisiensi petugas.
5.	Mendukung pelaporan dan evaluasi program gizi.

## C. Aktor Sistem
1.	Admin Dinas
2.	Petugas Rumah Pemulihan Gizi
3.	Orang Tua/Wali Pasien
4.	Kepala Dinas / Pimpinan (Monitoring)

# 2️⃣ Konsep Solusi Sistem

## Model Sistem

### Hybrid System:
1. Pendaftaran online
2. Nomor antrian digital
3. Check-in saat datang
4. Dashboard monitoring real-time

### Bisa berbasis:
1. Web App (Mobile Friendly)
2. Atau Web + WhatsApp Gateway (opsional)

# 3️⃣ Modul Sistem yang Dibutuhkan

## 1. Modul Master Data
   - Data pasien (balita/anak)
   - Data orang tua/wali
   - Data petugas
   - Data jadwal pelayanan
   - Kuota harian
   - Jenis layanan (konsultasi, pemulihan intensif, kontrol ulang, dll)

## 2. Modul Registrasi & Akun
Untuk orang tua:
   - Registrasi akun 
   - Login
   - Verifikasi nomor HP (OTP jika memungkinkan)
   - Manajemen profil anak
## 3. Modul Pendaftaran Antrian 
Fitur:
   - Pilih tanggal pelayanan
   - Tampilkan sisa kuota real-time
   - Generate nomor antrian otomatis
   - Estimasi jam layanan
   - Download / Screenshot tiket antrian (QR Code)
## 4. Modul Check-in Kedatangan
* Scan QR Code saat datang
* Manual input nomor antrian
* Status:
   - Terdaftar
   - Hadir
   - Dilayani
   - Selesai
   - Tidak hadir
## 5. Modul Manajemen Antrian (Petugas)
* Panggil nomor antrian
* Display nomor yang sedang dilayani
* Antrian berikutnya
* Estimasi waktu tunggu
* Skip / panggil ulang
## 6. Modul Dashboard Monitoring
Untuk pimpinan:
- Jumlah pendaftar harian
- Jumlah hadir vs tidak hadir
- Grafik kunjungan per bulan
- Grafik kasus gizi
- Waktu tunggu rata-rata
- Top kecamatan pengunjung
## 7. Modul Notifikasi
Opsional tapi sangat membantu:
- Notifikasi WhatsApp / SMS
- Konfirmasi pendaftaran
- Reminder H-1
- Reminder 2 jam sebelum layanan
## 8. Modul Laporan & Ekspor Data
- Rekap kunjungan 
- -Rekap antrian 
- Export Excel 
- Statistik evaluasi program

## 9. Modul Pengaturan Sistem
* Setting kuota harian
* Setting jam pelayanan
* Setting durasi rata-rata per pasien
* Role & permission management

# 4️⃣ Requirement Sistem

## A. Functional Requirements

### Untuk Orang Tua
- Bisa daftar akun
- Bisa mendaftarkan lebih dari 1 anak
- Bisa melihat riwayat kunjungan
- Bisa membatalkan antrian (dengan batas waktu)
- Bisa melihat estimasi waktu pelayanan

### Untuk Petugas
- Login sebagai petugas
- Melihat daftar antrian hari ini
- Memanggil nomor
- Mengubah status pasien
- Mencetak daftar hadir

### Untuk Admin
- Mengelola jadwal
- Mengelola kuota
- Melihat laporan
- Mengelola user


## B. Non-Functional Requirements

### 1. Performance
   - Support minimal 200–300 pendaftaran per hari
   - Real-time update antrian (<3 detik refresh)
### 2. Security
   - HTTPS
   - Role-based access control
   - Enkripsi password
   - Validasi input
   - Proteksi CSRF

### 3. Usability
   - Mobile-first design
   - UI sederhana untuk orang tua
   - Bahasa mudah dipahami

### 4. Reliability
   - Backup database harian
   - Logging aktivitas

# 6️⃣ Flow Sistem (Ringkas)
1.	Orang tua daftar akun
2.	Pilih tanggal pelayanan
3.	Sistem cek kuota
4.	Nomor antrian dibuat
5.	Sistem kirim notifikasi
6.	Saat datang → scan QR
7.	Petugas panggil antrian
8.	Dashboard update otomatis

# Entity Relational Diagram
## 1️⃣ users

Menyimpan semua akun (orang tua, petugas, admin).

Field:
- id (PK)
- name
- email
- phone
- password
- role (parent / petugas / admin / pimpinan)
- status (active / suspended)
- created_at
- updated_at

## 2️⃣ patients (anak/balita)

Relasi ke orang tua.

Field:
- id (PK)
- parent_id (FK → users.id)
- nik (nullable)
- no_kk
- nama
- tanggal_lahir
- jenis_kelamin
- alamat
- kecamatan
- desa
- berat_lahir
- created_at
- updated_at

## 3️⃣ service_types

Jenis layanan.

Field:
- id (PK)
- nama_layanan
- deskripsi
- durasi_estimasi_menit
- aktif

## 4️⃣ schedules

Jadwal pelayanan.

Field:
- id (PK)
- tanggal
- jam_mulai
- jam_selesai
- kuota
- service_type_id (FK → service_types.id)
- status (open / closed)

## 5️⃣ queues (inti sistem)

Data antrian.

Field:
- id (PK)
- kode_booking (unik)
- schedule_id (FK → schedules.id)
- patient_id (FK → patients.id)
- nomor_antrian
- estimasi_dilayani
- status (booked / checked_in / called / served / finished / no_show / cancelled)
- waktu_checkin
- waktu_dilayani
- waktu_selesai
- created_at

## 6️⃣ queue_logs

Log perubahan status (audit trail).

Field:
- id (PK)
- queue_id (FK → queues.id)
- status_sebelumnya
- status_baru
- changed_by (FK → users.id)
- changed_at

## 7️⃣ growth_records (opsional – untuk integrasi gizi)

Jika ingin integrasi skrining awal.

Field:
- id (PK)
- patient_id (FK → patients.id)
- berat_badan
- tinggi_badan
- lingkar_lengan
- tanggal_pemeriksaan
- catatan

## 8️⃣ notifications

Riwayat notifikasi WA/SMS.

Field:
- id (PK)
- user_id (FK → users.id)
- queue_id (FK → queues.id)
- jenis (booking / reminder / panggilan)
- status_kirim (sent / failed)
- waktu_kirim