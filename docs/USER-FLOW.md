# USER-FLOW.md — Website Kelurahan Betet Kota Kediri

**User Flow & Service Journey Specification**

| Property | Specification |
|---|---|
| Product | Website Kelurahan Betet Kota Kediri |
| Frontend | React + Vite + Bootstrap |
| Backend | Laravel REST API |
| Main Actors | Warga, Petugas, Admin |
| Basis | PRD.md + sequence diagram yang tersedia |
| Purpose | Menjadi acuan UX flow sebelum wireframe dan implementation |

---

# 1. Cara Membaca Dokumen

Dokumen ini menjelaskan perjalanan pengguna dari satu tindakan ke tindakan berikutnya.

Legenda:

```text
→   langkah berikutnya
↓   proses berikutnya
[ ] action
( ) state
```

Percabangan menggunakan:

```text
YA / TIDAK
BERHASIL / GAGAL
```

---

# 2. Actor Map

```text
                    ┌──────────────┐
                    │    WARGA     │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         Layanan Surat             Pengaduan
              │                         │
              └────────────┬────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    ADMIN     │
                    └──────┬───────┘
                           │
                verifikasi / proses /
                  assign / tutup
                           │
                           ▼
                    ┌──────────────┐
                    │   PETUGAS    │
                    └──────────────┘
                           │
                     tugas lapangan
                           │
                           ▼
                       penyelesaian
```

---

# 3. Flow Registrasi Warga

Berdasarkan Sequence Diagram Pendaftaran Akun Warga.

```text
Warga membuka /register
        ↓
Isi data registrasi
        ↓
Upload foto KTP
        ↓
Klik Daftar
        ↓
Sistem memproses registrasi
        ↓
Sistem mengecek NIK
        ↓
      NIK terdaftar?
       /          \
     YA            TIDAK
     ↓               ↓
Tampilkan Error      Validasi data
                     ↓
                  Data valid?
                  /       \
                TIDAK      YA
                 ↓          ↓
             Error       Simpan user
                              ↓
                       Status menunggu
                              ↓
                     Pesan pendaftaran berhasil
                              ↓
                     Cek status berkala
```

Requirement yang terdokumentasi:
- input data warga,
- foto KTP,
- pengecekan NIK,
- penyimpanan user,
- pesan berhasil/error.

---

# 4. Flow Verifikasi Akun Warga

Berdasarkan Sequence Diagram Verifikasi Akun Warga.

```text
Admin login
   ↓
Buka Verifikasi Warga
   ↓
Sistem mengambil pending users
   ↓
Tampilkan daftar
   ↓
Admin pilih user
   ↓
Tinjau data + KTP
   ↓
       Keputusan
       /       \
   Setujui     Tolak
      ↓          ↓
VERIFIED      Input alasan
      ↓          ↓
Success       REJECTED
message        ↓
            Error/status message
```

Catatan:
- status approval terdokumentasi sebagai `VERIFIED`,
- status penolakan terdokumentasi sebagai `REJECTED`,
- penolakan membutuhkan alasan.

---

# 5. Flow Login

**Usulan dari PRD:**

```text
User buka /login
      ↓
Isi credential
      ↓
Submit
      ↓
Valid?
 /      \
TIDAK    YA
 ↓        ↓
Error   Cek role/status
          ↓
     Redirect dashboard
```

Detail credential dan mekanisme token/session harus mengikuti `AUTH.md` dan API final.

---

# 6. Flow Pengajuan Pengaduan

Berdasarkan Sequence Diagram Pengajuan Pengaduan.

```text
Warga login
   ↓
Buka Pengaduan
   ↓
Buat Pengaduan
   ↓
Form pengaduan
   ├── Kategori
   ├── Deskripsi
   ├── Koordinat lokasi
   └── Foto
        ↓
Upload foto
        ↓
Tentukan lokasi pada peta
        ↓
Klik Kirim
        ↓
Validasi input + format foto
        ↓
          Valid?
        /       \
      TIDAK      YA
       ↓          ↓
   Error      Simpan aduan
                  ↓
              status PENDING
                  ↓
           return ID aduan
                  ↓
         Pesan pengaduan berhasil
```

Status awal yang terdokumentasi adalah `PENDING`.

---

# 7. Flow Assignment Pengaduan

Berdasarkan Sequence Diagram Plotting Pengaduan ke Petugas.

```text
Admin login
   ↓
Dashboard Admin
   ↓
Daftar Pengaduan
   ↓
Ambil pengaduan pending
   ↓
Pilih pengaduan
   ↓
Pilih petugas
   ↓
Klik Assign Petugas
   ↓
Sistem assign petugas
   ↓
Update status + petugas
   ↓
       Berhasil?
      /        \
    TIDAK       YA
     ↓           ↓
   Error       IN_PROGRESS
                  ↓
           Success message
```

---

# 8. Flow Pengiriman Tugas via WhatsApp

Berdasarkan Sequence Diagram Terima WA Tugas & Link Lokasi.

```text
Pengaduan berhasil ditugaskan
          ↓
Sistem menyiapkan:
- detail tugas
- link maps
- Magic Link
          ↓
Kirim WhatsApp ke petugas
          ↓
Petugas membuka WhatsApp
          ↓
Klik Magic Link
          ↓
Validasi token
          ↓
       Token valid?
       /          \
     TIDAK          YA
      ↓              ↓
 Akses ditolak     Ambil detail aduan
 / kadaluarsa            ↓
                  Tampilkan detail
                       + peta
                       + form aksi
```

Catatan:
- provider WhatsApp belum ditentukan.
- token expiry policy belum ditentukan dalam sumber.

---

# 9. Flow Penanganan Lapangan

Setelah Magic Link berhasil:

```text
Petugas membuka tugas
       ↓
Melihat detail laporan
       ↓
Melihat lokasi pada peta
       ↓
Melakukan tindakan lapangan
       ↓
Upload foto bukti
       ↓
Isi catatan
       ↓
Kirim penyelesaian
       ↓
Update status pengaduan
       ↓
CLOSED
```

Status dan action penutupan ini terdokumentasi pada sequence penutupan tiket.

---

# 10. Flow Penutupan oleh Admin

```text
Admin buka detail pengaduan
        ↓
Review hasil penanganan
        ↓
Tinjau penutupan
        ↓
Kirim penutupan
        ↓
Update status
        ↓
CLOSED
        ↓
Tampilkan success message
```

---

# 11. Flow Tracking Pengaduan

Berdasarkan Sequence Diagram Pelacakan Status Laporan & Surat.

```text
Warga login
   ↓
Buka Riwayat Layanan
   ↓
Pilih Pengaduan
   ↓
Sistem mengambil pengaduan milik user
   ↓
Tampilkan:
- daftar
- status
- timeline
- foto bukti
- catatan petugas
```

---

# 12. Flow Pengajuan Surat

Berdasarkan Sequence Diagram Ajukan Surat.

```text
Warga login
   ↓
Buka Layanan Surat
   ↓
Pilih jenis surat
   ↓
Sistem mengambil data profile
   ↓
Form dengan data yang dapat di-autofill
   ↓
Warga melengkapi data
   ↓
Upload lampiran
   ↓
Klik Ajukan
   ↓
Validasi form + berkas
   ↓
        Valid?
       /      \
     TIDAK     YA
      ↓         ↓
    Error    Simpan permohonan
                ↓
             DIAJUKAN
                ↓
         Return ID Surat
                ↓
      Pesan berhasil dikirim
```

---

# 13. Flow Proses Surat oleh Admin

Berdasarkan Sequence Diagram Proses Surat.

```text
Admin login
    ↓
Buka Permohonan Surat
    ↓
Ambil surat berstatus DIAJUKAN
    ↓
Pilih surat
    ↓
Tinjau data + berkas
    ↓
        Berkas lengkap & valid?
        /                    \
      TIDAK                   YA
       ↓                       ↓
Input alasan             Proses & Cetak
penolakan                     ↓
       ↓                  Generate dokumen
    DITOLAK                     ↓
       ↓                  SIAP_DIAMBIL
Kirim notifikasi               ↓
penolakan                Kirim notifikasi
                           kepada warga
```

---

# 14. Flow Tracking Surat

```text
Warga login
    ↓
Buka Riwayat Layanan
    ↓
Pilih Riwayat Surat
    ↓
Sistem mengambil surat user
    ↓
Tampilkan:
- status
- nomor surat
- alasan penolakan
```

Status yang terdokumentasi:
- `DIAJUKAN`
- `SIAP_DIAMBIL`
- `DITOLAK`

---

# 15. Flow Kelola Data Petugas

Berdasarkan Sequence Diagram Kelola Data Petugas.

```text
Admin login
   ↓
Buka Data Petugas
   ↓
Tampilkan daftar petugas
   ↓
Klik Tambah Petugas
   ↓
Input:
- Nama
- Nomor WhatsApp
   ↓
Validasi format nomor WhatsApp
   ↓
      Valid?
      /     \
    TIDAK    YA
     ↓        ↓
   Error    Simpan
              ↓
       Role = PETUGAS
              ↓
       Success message
```

---

# 16. End-to-End Journey: Warga → Pengaduan → Petugas

```text
WARGA
  │
  ├─ Register
  │    ↓
  │  Verifikasi
  │    ↓
  │  Login
  │    ↓
  │  Buat Pengaduan
  │    ↓
  │  PENDING
  │
  ▼
ADMIN
  │
  ├─ Melihat pengaduan pending
  │    ↓
  │  Memilih petugas
  │    ↓
  │  Assign
  │    ↓
  │  IN_PROGRESS
  │
  ▼
PETUGAS
  │
  ├─ Menerima WhatsApp
  │    ↓
  │  Buka Magic Link
  │    ↓
  │  Lihat detail + lokasi
  │    ↓
  │  Tangani laporan
  │    ↓
  │  Upload bukti + catatan
  │    ↓
  │  Selesai
  │
  ▼
ADMIN / SYSTEM
  │
  ├─ Review / penutupan
  │    ↓
  │  CLOSED
  │
  ▼
WARGA
  │
  └─ Melihat timeline/status
```

---

# 17. End-to-End Journey: Warga → Surat

```text
WARGA
  │
  ├─ Login
  │   ↓
  │ Layanan Surat
  │   ↓
  │ Pilih Jenis Surat
  │   ↓
  │ Autofill data profile
  │   ↓
  │ Isi data
  │   ↓
  │ Upload berkas
  │   ↓
  │ Ajukan
  │   ↓
  │ DIAJUKAN
  │
  ▼
ADMIN
  │
  ├─ Tinjau permohonan
  │
  ├───────────────┐
  │               │
Valid           Tidak valid
  │               │
  ▼               ▼
Proses & Cetak   Tolak + alasan
  │               │
  ▼               ▼
SIAP_DIAMBIL    DITOLAK
  │               │
  └───────┬───────┘
          ▼
        WARGA
          │
          └─ Melihat status
```

---

# 18. Exception Flow

## 18.1 Registrasi Gagal

```text
Submit
 ↓
NIK sudah terdaftar / data tidak valid
 ↓
Tampilkan error
 ↓
Tetap di halaman register
```

## 18.2 Verifikasi Ditolak

```text
Admin menolak
 ↓
Wajib alasan
 ↓
REJECTED
 ↓
Warga melihat alasan/status
```

## 18.3 Pengaduan Tidak Valid

```text
Submit
 ↓
Validasi gagal
 ↓
Error dekat field
 ↓
Data diperbaiki
 ↓
Submit ulang
```

## 18.4 Magic Link Invalid / Expired

```text
Buka token
 ↓
Validasi gagal
 ↓
Tampilkan:
"Akses tidak valid atau sudah kedaluwarsa."
```

## 18.5 Pengajuan Surat Ditolak

```text
Admin menolak
 ↓
Isi alasan
 ↓
DITOLAK
 ↓
Warga melihat alasan
```

---

# 19. UX Rules yang Mengikuti Flow

## 19.1 Jangan Kehilangan Context

Saat error form:
- data yang sudah diisi tetap dipertahankan jika memungkinkan,
- error ditampilkan dekat field.

## 19.2 Konfirmasi Action Penting

Gunakan confirmation untuk:
- menolak akun,
- menugaskan petugas,
- menolak surat,
- menutup tiket.

## 19.3 Feedback Setelah Action

Setiap action penting memiliki:
- loading,
- success,
- error.

## 19.4 Status Harus Terlihat

Pada:
- dashboard,
- detail,
- riwayat,

status layanan harus menjadi informasi yang mudah ditemukan.

---

# 20. Flow-to-Page Mapping

| Flow | Halaman |
|---|---|
| Registrasi | `/register` |
| Status verifikasi | `/verifikasi` |
| Login | `/login` |
| Dashboard warga | `/warga` |
| Pengaduan | `/warga/pengaduan` |
| Buat pengaduan | `/warga/pengaduan/buat` |
| Detail pengaduan | `/warga/pengaduan/:id` |
| Layanan surat | `/warga/surat` |
| Buat surat | `/warga/surat/buat` |
| Detail surat | `/warga/surat/:id` |
| Dashboard petugas | `/petugas` |
| Daftar tugas | `/petugas/tugas` |
| Detail tugas | `/petugas/tugas/:id` |
| Magic Link | `/tugas/:token` |
| Dashboard admin | `/admin` |
| Verifikasi admin | `/admin/verifikasi` |
| Detail verifikasi | `/admin/verifikasi/:id` |
| Pengaduan admin | `/admin/pengaduan` |
| Detail aduan admin | `/admin/pengaduan/:id` |
| Surat admin | `/admin/surat` |
| Detail surat admin | `/admin/surat/:id` |
| Data petugas | `/admin/petugas` |

---

# 21. Flow yang Masih Perlu Diputuskan

Sumber yang tersedia belum menetapkan secara lengkap:

- credential login,
- lupa password/reset password,
- mekanisme refresh session/token,
- aturan expiry Magic Link,
- provider WhatsApp,
- mekanisme tracking public tanpa login,
- jenis-jenis surat,
- field lengkap tiap jenis surat,
- SLA/estimasi layanan,
- aturan file upload final,
- notifikasi internal,
- aturan penghapusan/pembatalan pengaduan.

Bagian tersebut harus diputuskan sebelum `API.md`, `DATABASE.md`, dan implementation final dikunci.

---

# 22. Definition of Ready untuk Wireframe

Tahap wireframe dapat dimulai ketika:

- [x] Aktor utama sudah ditentukan.
- [x] Scope utama sudah ditentukan.
- [x] Sitemap tersedia.
- [x] Flow registrasi tersedia.
- [x] Flow verifikasi tersedia.
- [x] Flow pengaduan tersedia.
- [x] Flow assignment tersedia.
- [x] Flow petugas tersedia.
- [x] Flow surat tersedia.
- [x] Flow tracking tersedia.
- [ ] Business rule yang masih kosong sudah diputuskan.
- [ ] API contract sudah mulai didefinisikan.

