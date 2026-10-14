# SITEMAP.md — Website Kelurahan Betet Kota Kediri

**Information Architecture & Route Specification**

| Property | Specification |
|---|---|
| Product | Website Kelurahan Betet Kota Kediri |
| Frontend | React + Vite + Bootstrap |
| Backend | Laravel REST API |
| Primary Language | Bahasa Indonesia |
| Basis | PRD.md + DESIGN.md + DFD/Sequence Diagram yang tersedia |

---

# 1. Tujuan Sitemap

Sitemap mendefinisikan:

- struktur informasi website,
- pembagian halaman berdasarkan role,
- hubungan antarhalaman,
- route utama frontend React.

Sitemap tidak mendefinisikan struktur database atau endpoint Laravel. Itu akan dibuat dalam `DATABASE.md` dan `API.md`.

---

# 2. Struktur Utama

```text
Website Kelurahan Betet
│
├── PUBLIC
│   ├── Beranda
│   ├── Profil
│   ├── Pemerintahan
│   ├── Berita
│   ├── Pengumuman
│   ├── Layanan
│   ├── Pengaduan
│   ├── Pelacakan
│   └── Kontak
│
├── AUTHENTICATION
│   ├── Login
│   ├── Register
│   └── Status Verifikasi
│
├── WARGA
│   ├── Dashboard
│   ├── Profil
│   ├── Pengaduan
│   │   ├── Daftar
│   │   ├── Buat
│   │   └── Detail
│   ├── Layanan Surat
│   │   ├── Daftar
│   │   ├── Ajukan
│   │   └── Detail
│   └── Notifikasi
│
├── PETUGAS
│   ├── Dashboard
│   ├── Daftar Tugas
│   └── Detail Tugas
│
└── ADMIN
    ├── Dashboard
    ├── Verifikasi Warga
    ├── Pengaduan
    │   └── Detail / Assignment
    ├── Layanan Surat
    │   └── Detail / Process
    ├── Data Petugas
    └── Pengaturan / Data Administratif sesuai scope
```

---

# 3. Public Sitemap

## `/`

### Beranda

Tujuan:
- memperkenalkan Kelurahan Betet,
- memberikan akses cepat ke layanan,
- menampilkan informasi terbaru,
- menyediakan kontak dan informasi publik.

Konten utama:
- Hero.
- Layanan utama.
- Pengaduan.
- Berita/pengumuman.
- Ringkasan pelayanan.
- Kontak.
- Footer.

---

## `/profil`

### Profil Kelurahan

Konten:
- Tentang Kelurahan Betet.
- Informasi wilayah.
- Informasi pemerintahan sesuai data resmi.

---

## `/pemerintahan`

### Pemerintahan

Konten struktur pemerintahan atau informasi perangkat kelurahan yang memang disediakan sebagai konten publik.

> Detail isi belum ditentukan pada sumber yang diberikan.

---

## `/berita`

### Berita

Fitur:
- daftar berita,
- kategori jika tersedia,
- tanggal,
- ringkasan,
- detail berita.

### `/berita/:slug`

Detail berita.

---

## `/pengumuman`

### Pengumuman

Fitur:
- daftar pengumuman,
- tanggal,
- ringkasan,
- detail pengumuman.

### `/pengumuman/:slug`

Detail pengumuman.

---

## `/layanan`

### Daftar Layanan

Menampilkan jenis layanan administrasi yang tersedia.

### `/layanan/:slug`

Detail layanan:
- deskripsi,
- persyaratan,
- informasi proses,
- tombol pengajuan untuk warga yang sudah login.

> Persyaratan dan jenis surat harus berasal dari data resmi yang nanti dimasukkan ke sistem.

---

## `/pengaduan`

### Informasi Pengaduan

Halaman public yang menjelaskan:
- fungsi kanal pengaduan,
- langkah pengajuan,
- akses untuk membuat pengaduan.

Pengguna diarahkan login sebelum pengajuan.

---

## `/pelacakan`

### Pelacakan Layanan

Halaman untuk mengarahkan warga ke pelacakan status layanan.

> Detail mekanisme pelacakan publik belum didefinisikan secara lengkap pada sumber yang tersedia. Jangan menganggap nomor tiket publik sebagai final sebelum API dan business rule ditetapkan.

---

## `/kontak`

### Kontak

Konten:
- alamat,
- nomor kontak,
- jam pelayanan,
- kanal komunikasi resmi.

Data final berasal dari pihak Kelurahan Betet.

---

# 4. Authentication Sitemap

## `/login`

Fungsi:
- login pengguna,
- validasi credential,
- redirect berdasarkan role.

---

## `/register`

Fungsi:
- input data warga,
- upload foto KTP,
- pengiriman registrasi.

---

## `/verifikasi`

### Status Verifikasi Akun

Menampilkan:
- menunggu verifikasi,
- akun terverifikasi,
- pendaftaran ditolak,
- alasan penolakan jika tersedia.

---

# 5. Warga Sitemap

Base route:

```text
/warga
```

---

## `/warga`

### Dashboard Warga

Isi:
- status akun,
- quick action,
- ringkasan pengaduan,
- ringkasan surat,
- aktivitas terbaru.

---

## `/warga/profil`

### Profil Warga

Fungsi:
- melihat data profil,
- memperbarui data yang memang diizinkan sistem.

> Field final profil belum ditentukan seluruhnya dalam sumber.

---

# 6. Warga — Pengaduan

## `/warga/pengaduan`

### Daftar Pengaduan

Menampilkan:
- nomor/ID,
- ringkasan,
- kategori,
- tanggal,
- status.

---

## `/warga/pengaduan/buat`

### Buat Pengaduan

Form:
- kategori,
- deskripsi,
- lokasi,
- koordinat,
- foto bukti.

Flow:
```text
Isi data
→ Tentukan lokasi
→ Upload bukti
→ Validasi
→ Review
→ Kirim
```

---

## `/warga/pengaduan/:id`

### Detail Pengaduan

Menampilkan:
- informasi pengaduan,
- status,
- timeline,
- lokasi,
- bukti,
- catatan yang memang boleh dilihat warga.

---

# 7. Warga — Layanan Surat

## `/warga/surat`

### Daftar Pengajuan Surat

Menampilkan:
- jenis surat,
- ID/nomor,
- tanggal,
- status.

---

## `/warga/surat/buat`

### Pengajuan Surat

Flow:

```text
Pilih jenis surat
→ Ambil data profil
→ Isi form
→ Upload lampiran
→ Validasi
→ Review
→ Ajukan
```

---

## `/warga/surat/:id`

### Detail Pengajuan Surat

Menampilkan:
- jenis surat,
- data pengajuan,
- status,
- nomor surat jika tersedia,
- alasan penolakan jika ditolak.

---

# 8. Warga — Notifikasi

## `/warga/notifikasi`

Menampilkan notifikasi yang relevan dengan akun warga.

> Kanal dan format notifikasi final harus mengikuti implementation/API design.

---

# 9. Petugas Sitemap

Base route:

```text
/petugas
```

---

## `/petugas`

### Dashboard Petugas

Isi:
- tugas baru,
- tugas aktif,
- tugas selesai,
- ringkasan aktivitas.

---

## `/petugas/tugas`

### Daftar Tugas

Menampilkan:
- ID pengaduan,
- kategori,
- lokasi,
- tanggal,
- status.

---

## `/petugas/tugas/:id`

### Detail Tugas

Menampilkan:
- detail laporan yang diperlukan,
- peta lokasi,
- bukti,
- form aksi,
- upload foto bukti,
- catatan.

---

# 10. Magic Link Sitemap

## `/tugas/:token`

Halaman khusus petugas lapangan yang dibuka dari WhatsApp.

### State valid

```text
Detail Laporan
→ Peta Lokasi
→ Form Aksi
→ Upload Bukti
→ Catatan
→ Kirim Penyelesaian
```

### State invalid/expired

```text
Akses tidak valid atau sudah kedaluwarsa.
```

Halaman ini harus berdiri sendiri dan tidak bergantung pada dashboard penuh.

---

# 11. Admin Sitemap

Base route:

```text
/admin
```

---

## `/admin`

### Dashboard Admin

Isi:
- statistik pengaduan,
- statistik surat,
- verifikasi warga,
- aktivitas terbaru,
- queue pekerjaan.

---

# 12. Admin — Verifikasi Warga

## `/admin/verifikasi`

### Daftar Verifikasi

Menampilkan:
- nama,
- NIK,
- tanggal daftar,
- status,
- action.

### `/admin/verifikasi/:id`

### Detail Verifikasi

Menampilkan:
- data warga,
- foto KTP,
- action setujui/tolak.

Jika ditolak:
- alasan penolakan wajib diisi.

---

# 13. Admin — Pengaduan

## `/admin/pengaduan`

### Daftar Pengaduan

Filter yang disiapkan:
- status,
- kategori,
- tanggal,
- petugas.

---

## `/admin/pengaduan/:id`

### Detail Pengaduan

Bagian:
- informasi aduan,
- lokasi/peta,
- bukti,
- timeline,
- petugas,
- tindakan admin.

---

## Assignment Petugas

Bisa dilakukan dari detail pengaduan atau modal:

```text
Pilih Pengaduan
→ Pilih Petugas
→ Konfirmasi
→ Assign
→ Update status
```

---

# 14. Admin — Layanan Surat

## `/admin/surat`

### Daftar Permohonan

Menampilkan:
- ID/nomor,
- pemohon,
- jenis surat,
- tanggal,
- status.

---

## `/admin/surat/:id`

### Detail Permohonan

Menampilkan:
- data pemohon,
- form,
- lampiran,
- status,
- action.

Action:
- proses & cetak,
- tolak.

Penolakan membutuhkan alasan.

---

# 15. Admin — Data Petugas

## `/admin/petugas`

### Daftar Petugas

Menampilkan:
- nama,
- nomor WhatsApp,
- status,
- action.

---

## `/admin/petugas/tambah`

### Tambah Petugas

Field berdasarkan sequence:
- nama,
- nomor WhatsApp.

Validasi nomor WhatsApp mengikuti aturan backend.

---

# 16. Route Access Matrix

| Route | Public | Warga | Petugas | Admin |
|---|:---:|:---:|:---:|:---:|
| `/` | ✓ | ✓ | ✓ | ✓ |
| `/profil` | ✓ | ✓ | ✓ | ✓ |
| `/pemerintahan` | ✓ | ✓ | ✓ | ✓ |
| `/berita` | ✓ | ✓ | ✓ | ✓ |
| `/pengumuman` | ✓ | ✓ | ✓ | ✓ |
| `/layanan` | ✓ | ✓ | ✓ | ✓ |
| `/pengaduan` | ✓ | ✓ | ✓ | ✓ |
| `/pelacakan` | ✓ | ✓ | ✓ | ✓ |
| `/kontak` | ✓ | ✓ | ✓ | ✓ |
| `/login` | ✓ | - | - | - |
| `/register` | ✓ | - | - | - |
| `/verifikasi` | ✓* | ✓* | - | - |
| `/warga/*` | - | ✓ | - | - |
| `/petugas/*` | - | - | ✓ | - |
| `/tugas/:token` | - | - | ✓** | - |
| `/admin/*` | - | - | - | ✓ |

`*` status verifikasi hanya untuk alur pengguna yang sedang melakukan/menunggu verifikasi.

`**` akses menggunakan token tugas sesuai mekanisme Magic Link. Mekanisme final tetap harus ditentukan pada API/security design.

---

# 17. Navigation Rules

## Public Navbar

```text
Logo
Beranda
Profil
Informasi
Layanan
Pengaduan
Pelacakan
Kontak
Login / Dashboard
```

## Warga Sidebar

```text
Dashboard
Pengaduan
Layanan Surat
Riwayat / Tracking
Notifikasi
Profil
Logout
```

## Petugas Sidebar

```text
Dashboard
Tugas
Riwayat Tugas
Profil / sesuai scope
Logout
```

## Admin Sidebar

```text
Dashboard
Verifikasi Warga
Pengaduan
Layanan Surat
Data Petugas
Pengaturan / sesuai scope
Logout
```

---

# 18. URL Naming Rules

Gunakan:
- lowercase,
- kata dipisahkan `/`,
- ID resource menggunakan parameter,
- slug untuk konten public.

Contoh:

```text
/warga/pengaduan/123
/admin/pengaduan/123
/berita/peresmian-layanan
/tugas/secure-token
```

Hindari route seperti:

```text
/getDataAduan
/adminPage2
/page123
```

---

# 19. Catatan Sitemap

Sitemap ini merupakan struktur frontend berdasarkan PRD dan DESIGN.

Hal-hal berikut belum dikunci oleh sumber:
- seluruh halaman konten administratif publik,
- jenis surat yang tersedia,
- field lengkap setiap surat,
- detail mekanisme pelacakan publik,
- provider WhatsApp,
- detail pengaturan admin.

Bagian tersebut tidak boleh dianggap sebagai requirement final sebelum ditetapkan pada dokumen lanjutan.
