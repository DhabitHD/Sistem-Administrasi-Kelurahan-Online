# PRD — Website Kelurahan Betet Kota Kediri

**Product Requirements Document**

| Property | Specification |
|---|---|
| Product | Website Kelurahan Betet Kota Kediri |
| Product Type | Portal informasi kelurahan + layanan publik digital |
| Primary Frontend | React + Vite + Bootstrap |
| Backend | Laravel REST API |
| Database | MySQL |
| Local Environment | Laragon |
| Main Users | Warga, Petugas, Admin |
| Language | Bahasa Indonesia |
| Document Status | Draft Final untuk tahap desain & development |
| Source Basis | DFD dan Sequence Diagram yang disediakan pengguna |

---

## 1. Ringkasan Produk

Website Kelurahan Betet Kota Kediri dirancang sebagai portal resmi kelurahan yang menggabungkan:

1. Informasi publik kelurahan.
2. Akun warga.
3. Layanan surat administrasi.
4. Pengaduan masyarakat.
5. Pelacakan status layanan.
6. Dashboard petugas.
7. Dashboard admin.
8. Notifikasi dan alur penugasan petugas melalui WhatsApp/Magic Link.

PRD ini menggunakan dokumen alur yang tersedia sebagai dasar requirement. Bagian yang belum ditentukan oleh diagram diberi status **Usulan/Keputusan Desain** agar dapat diputuskan sebelum implementasi.

---

# 2. Latar Belakang

Website tidak hanya berfungsi sebagai media informasi, tetapi juga sebagai pintu masuk layanan digital warga.

Dari alur yang tersedia, sistem sudah mencakup proses pendaftaran dan verifikasi akun warga, pengajuan pengaduan, penugasan pengaduan kepada petugas, pengiriman tugas melalui WhatsApp, pelacakan pengaduan dan surat, pengajuan surat administrasi, proses surat oleh admin, serta penutupan tiket pengaduan.

Tujuan produk adalah menyediakan alur layanan yang dapat dilacak dari pengajuan sampai penyelesaian, sekaligus menyediakan kanal informasi publik kelurahan.

---

# 3. Tujuan Produk

## 3.1 Tujuan Utama

- Menyediakan portal informasi resmi Kelurahan Betet.
- Memudahkan warga mengajukan layanan administrasi secara digital.
- Memudahkan warga membuat pengaduan dengan lokasi dan bukti.
- Memberikan status layanan yang dapat dipantau warga.
- Membantu admin mengelola akun warga, pengaduan, surat, dan petugas.
- Membantu petugas menerima dan menangani tugas lapangan.
- Mencatat status dan progres layanan secara terstruktur.

## 3.2 Tujuan UX

- Warga dapat memahami langkah layanan tanpa bantuan teknis.
- Status pengajuan selalu terlihat jelas.
- Form yang panjang dibagi menjadi bagian yang mudah dipahami.
- Informasi publik mudah ditemukan.
- Dashboard dibedakan berdasarkan kebutuhan tiap role.

---

# 4. Target Pengguna

## 4.1 Warga

Kebutuhan:

- Membuat akun.
- Mengirim data dan KTP untuk verifikasi.
- Login setelah akun diverifikasi.
- Mengajukan surat administrasi.
- Mengajukan pengaduan.
- Menyertakan lokasi dan foto bukti untuk pengaduan.
- Melihat riwayat dan status layanan.
- Menerima informasi hasil proses layanan.

## 4.2 Petugas Lapangan

Kebutuhan:

- Menerima tugas pengaduan.
- Membuka detail tugas.
- Melihat lokasi pada peta.
- Mengisi tindakan/hasil pekerjaan.
- Mengunggah foto bukti.
- Menambahkan catatan.
- Menutup atau menyelesaikan tugas sesuai alur sistem.

## 4.3 Admin

Kebutuhan:

- Memverifikasi akun warga.
- Mengelola data petugas.
- Melihat dan mengelola pengaduan.
- Menugaskan pengaduan ke petugas.
- Mengelola proses surat.
- Melihat data dan status layanan.
- Mengelola informasi administratif yang memang masuk scope sistem.

---

# 5. Scope Produk

## 5.1 Public Website

### Beranda
- Hero/informasi utama kelurahan.
- Ringkasan layanan.
- Informasi terbaru.
- Call-to-action layanan.
- Kontak dan informasi kelurahan.

### Profil
- Profil Kelurahan Betet.
- Struktur/pemerintahan.
- Informasi wilayah yang disepakati dalam konten final.

### Informasi
- Berita.
- Pengumuman.
- Informasi layanan.

### Layanan
- Daftar layanan administrasi.
- Penjelasan persyaratan.
- Akses pengajuan.
- Pelacakan layanan.

### Pengaduan
- Penjelasan kanal pengaduan.
- Akses pengajuan setelah login.

### Kontak
- Alamat.
- Kontak resmi.
- Jam pelayanan.
- Kanal komunikasi resmi.

> **Usulan/Keputusan Desain:** daftar konten public di atas dapat disesuaikan setelah data resmi Kelurahan Betet tersedia.

---

# 6. Scope Sistem Warga

## 6.1 Registrasi Akun

Berdasarkan sequence diagram pendaftaran:

1. Warga membuka halaman pendaftaran.
2. Warga mengisi data registrasi.
3. Warga mengunggah foto KTP.
4. Sistem memproses registrasi.
5. Sistem mengecek NIK.
6. Jika valid dan belum terdaftar, data disimpan.
7. Sistem menampilkan pesan bahwa pendaftaran berhasil dan warga diminta mengecek status berkala.
8. Jika NIK sudah terdaftar atau data tidak valid, sistem menampilkan error.

Referensi alur: Sequence Diagram Pendaftaran Akun Warga.

## 6.2 Verifikasi Akun

1. Admin membuka halaman verifikasi.
2. Sistem menampilkan daftar user yang menunggu verifikasi.
3. Admin memilih user.
4. Admin meninjau data/KTP.
5. Admin dapat menyetujui atau menolak.
6. Persetujuan mengubah status menjadi `VERIFIED`.
7. Penolakan mengubah status menjadi `REJECTED` dan membutuhkan alasan.
8. Sistem menampilkan pesan hasil tindakan.

Referensi alur: Sequence Diagram Verifikasi Akun Warga.

## 6.3 Login

**Usulan/Keputusan Desain:**
- Login tersedia setelah akun berstatus `VERIFIED`.
- Role menentukan dashboard dan permission.
- Autentikasi API menggunakan Laravel dan mekanisme autentikasi SPA yang dipilih pada tahap technical design.

---

# 7. Scope Pengaduan

## 7.1 Pengajuan Pengaduan

Berdasarkan sequence diagram:

Data utama:
- Kategori.
- Deskripsi.
- Koordinat lokasi.
- Foto bukti.

Alur:
1. Warga membuka menu pengaduan.
2. Sistem menampilkan form pengaduan dan peta geo-tagging.
3. Warga mengisi kategori dan deskripsi.
4. Warga menentukan lokasi.
5. Warga mengunggah foto bukti.
6. Sistem memvalidasi input dan format foto.
7. Jika valid, pengaduan disimpan dengan status awal `PENDING`.
8. Sistem mengembalikan ID pengaduan dan pesan berhasil.
9. Jika tidak valid, sistem menampilkan error.

Referensi alur: Sequence Diagram Pengajuan Pengaduan.

## 7.2 Penugasan Pengaduan

Berdasarkan sequence diagram plotting:

1. Admin membuka daftar pengaduan.
2. Sistem mengambil pengaduan berstatus pending.
3. Admin memilih pengaduan.
4. Admin memilih petugas.
5. Admin menekan Assign Petugas.
6. Sistem menyimpan petugas yang ditugaskan.
7. Status pengaduan diperbarui menjadi `IN_PROGRESS`.
8. Sistem menampilkan hasil penugasan.

Referensi alur: Sequence Diagram Plotting Pengaduan ke Petugas.

## 7.3 Notifikasi WhatsApp dan Magic Link

Berdasarkan sequence diagram:

1. Sistem mengirim pesan WhatsApp kepada petugas.
2. Pesan berisi detail tugas, link maps, dan Magic Link.
3. Petugas membuka pesan.
4. Petugas membuka Magic Link.
5. Sistem memvalidasi token.
6. Jika valid, sistem menampilkan detail laporan, peta lokasi, dan form aksi.
7. Jika invalid/kadaluarsa, sistem menampilkan pesan akses tidak valid atau kadaluarsa.

Referensi alur: Sequence Diagram Terima WA Tugas & Link Lokasi.

> **Usulan/Keputusan Teknis:** provider/API WhatsApp belum ditentukan dalam sumber yang diberikan. Pemilihan provider dilakukan pada tahap technical design.

## 7.4 Penutupan Pengaduan

Sistem mendukung dua jalur penutupan:

### Petugas
- Membuka tugas melalui Magic Link.
- Upload foto bukti.
- Mengisi catatan.
- Mengirim penyelesaian.
- Status pengaduan diubah menjadi `CLOSED`.

### Admin
- Membuka data pengaduan di dashboard.
- Meninjau penutupan.
- Mengirim tindakan penutupan.
- Status diubah menjadi `CLOSED`.

Sistem menampilkan pesan bahwa tiket telah ditutup.

Referensi alur: Sequence Diagram Penutupan Tiket Pengaduan.

---

# 8. Scope Layanan Surat

## 8.1 Pengajuan Surat oleh Warga

Berdasarkan sequence diagram:

1. Warga membuka menu layanan surat.
2. Warga memilih jenis surat.
3. Sistem mengambil data profil warga.
4. Data profil dapat digunakan sebagai autofill pada form.
5. Warga melengkapi form.
6. Warga mengunggah lampiran yang diperlukan.
7. Sistem memvalidasi kelengkapan dan format berkas.
8. Jika valid, permohonan disimpan dengan status `DIAJUKAN`.
9. Sistem menampilkan pesan berhasil dan ID surat.
10. Jika tidak valid, sistem menampilkan error.

Referensi alur: Sequence Diagram Ajukan Surat.

## 8.2 Proses Surat oleh Admin

Admin:
1. Membuka daftar permohonan.
2. Sistem menampilkan surat berstatus diajukan.
3. Admin memilih surat.
4. Admin meninjau berkas.
5. Jika berkas lengkap dan valid, admin memproses dan mencetak surat.
6. Sistem menghasilkan dokumen yang dapat ditampilkan/dicetak.
7. Status surat diubah menjadi `SIAP_DIAMBIL`.
8. Sistem dapat mengirim WhatsApp kepada warga.
9. Jika berkas tidak lengkap/tidak memenuhi syarat, admin dapat menolak.
10. Admin memasukkan alasan penolakan.
11. Status surat menjadi `DITOLAK`.
12. Sistem dapat mengirim WhatsApp berisi alasan penolakan.

Referensi alur: Sequence Diagram Proses Surat.

---

# 9. Pelacakan Status

Menu riwayat layanan warga menyediakan dua kelompok informasi:

## 9.1 Riwayat Pengaduan

Data yang ditampilkan:
- Daftar pengaduan.
- Status.
- Timeline progres.
- Foto bukti.
- Catatan petugas.

## 9.2 Riwayat Surat

Data yang ditampilkan:
- Jenis/daftar surat.
- Status.
- Nomor surat.
- Alasan penolakan jika ada.

Referensi alur: Sequence Diagram Pelacakan Status Laporan & Surat.

---

# 10. Data Petugas

Berdasarkan sequence diagram kelola data petugas:

1. Admin membuka menu data petugas.
2. Sistem menampilkan daftar petugas.
3. Admin memasukkan nama dan nomor WhatsApp.
4. Sistem memvalidasi format nomor WhatsApp.
5. Data disimpan.
6. Role dibuat sebagai `PETUGAS`.
7. Sistem menampilkan pesan data petugas berhasil ditambahkan.
8. Jika data tidak valid, sistem menampilkan error.

Referensi alur: Sequence Diagram Kelola Data Petugas.

---

# 11. Status Utama

## 11.1 Status Akun

| Status | Makna |
|---|---|
| `PENDING` | Menunggu verifikasi |
| `VERIFIED` | Akun sudah disetujui |
| `REJECTED` | Akun ditolak |

## 11.2 Status Pengaduan

Yang terdokumentasi secara eksplisit:
- `PENDING`
- `IN_PROGRESS`
- `CLOSED`

Urutan atau status antara yang tidak terlihat pada sequence diagram perlu ditetapkan sebelum backend final.

## 11.3 Status Surat

Yang terdokumentasi:
- `DIAJUKAN`
- `SIAP_DIAMBIL`
- `DITOLAK`

---

# 12. Role & Permission

| Fitur | Warga | Petugas | Admin |
|---|:---:|:---:|:---:|
| Melihat website publik | ✓ | ✓ | ✓ |
| Registrasi | ✓ | - | - |
| Mengelola profil sendiri | ✓ | - | - |
| Mengajukan surat | ✓ | - | - |
| Melihat surat sendiri | ✓ | - | ✓ |
| Mengajukan pengaduan | ✓ | - | - |
| Melihat pengaduan sendiri | ✓ | - | ✓ |
| Menangani tugas pengaduan | - | ✓ | ✓ |
| Assign petugas | - | - | ✓ |
| Verifikasi warga | - | - | ✓ |
| Kelola data petugas | - | - | ✓ |
| Proses surat | - | - | ✓ |
| Menutup tiket melalui dashboard | - | - | ✓ |

> Tabel permission ini adalah penyelarasan produk berdasarkan aktor pada sequence diagram dan perlu menjadi dasar authorization Laravel.

---

# 13. Functional Requirements

## FR-01 — Registrasi
Sistem harus menerima data warga dan foto KTP untuk proses pendaftaran.

## FR-02 — Validasi NIK
Sistem harus memeriksa NIK sebelum membuat akun.

## FR-03 — Verifikasi Warga
Admin harus dapat menyetujui atau menolak pendaftaran.

## FR-04 — Pengaduan
Warga harus dapat mengirim pengaduan dengan kategori, deskripsi, lokasi, koordinat, dan foto.

## FR-05 — Penugasan
Admin harus dapat menugaskan pengaduan kepada petugas.

## FR-06 — Tugas Lapangan
Petugas harus dapat membuka detail tugas melalui akses yang dikirimkan sistem.

## FR-07 — Bukti Penyelesaian
Petugas harus dapat mengunggah foto bukti dan catatan.

## FR-08 — Surat Administrasi
Warga harus dapat mengajukan surat berdasarkan jenis surat yang tersedia.

## FR-09 — Pemrosesan Surat
Admin harus dapat memproses atau menolak pengajuan surat.

## FR-10 — Tracking
Warga harus dapat melihat riwayat dan status pengaduan maupun surat.

## FR-11 — Notifikasi
Sistem dapat mengirim notifikasi WhatsApp sesuai alur yang dirancang.

## FR-12 — Authorization
Akses API harus dibatasi berdasarkan autentikasi dan role.

---

# 14. Non-Functional Requirements

## Performance
- Halaman publik harus ringan.
- Daftar data menggunakan pagination untuk dataset besar.
- File upload divalidasi sebelum dikirim ke server.

## Security
- Password tidak boleh disimpan dalam bentuk plaintext.
- Endpoint admin dan petugas harus dilindungi authorization.
- Akses Magic Link harus menggunakan token yang dapat kedaluwarsa.
- Upload file harus divalidasi tipe dan ukurannya.
- Data warga dan KTP harus dibatasi aksesnya.
- Log aktivitas sensitif perlu dipertimbangkan.

## Accessibility
- Form memiliki label yang jelas.
- Status tidak hanya dibedakan berdasarkan warna.
- Kontras teks harus memadai.
- Navigasi keyboard tetap berfungsi.

## Responsive
Target:
- Mobile.
- Tablet.
- Desktop.

Prioritas pengalaman warga: **mobile-first**.

---

# 15. Requirement File Upload

Batas ukuran/file type dari sumber yang tersedia belum ditetapkan secara eksplisit dalam diagram sequence yang diberikan.

**Keputusan:** aturan ukuran dan format file harus ditentukan pada Technical Design/API Specification sebelum implementasi.

---

# 16. API Direction

Frontend React tidak mengakses database secara langsung.

```text
React
  ↓ HTTP/JSON
Laravel API
  ↓
Service / Controller
  ↓
Eloquent
  ↓
MySQL
```

Endpoint dan struktur response akan didefinisikan pada `API.md`.

---

# 17. Struktur Sistem yang Diusulkan

```text
kelurahan-betet/
│
├── frontend/
│   ├── React
│   ├── Vite
│   └── Bootstrap
│
├── backend/
│   └── Laravel REST API
│
└── database/
    └── MySQL
```

Laragon digunakan untuk kebutuhan local development pada Windows.

---

# 18. Success Criteria

Produk dianggap siap untuk tahap MVP apabila:

- Warga dapat mendaftar.
- Admin dapat memverifikasi warga.
- Warga dapat login setelah diverifikasi.
- Warga dapat mengajukan pengaduan.
- Admin dapat menugaskan petugas.
- Petugas dapat menerima/membuka tugas.
- Petugas dapat mengirim bukti dan catatan.
- Warga dapat melihat perkembangan pengaduan.
- Warga dapat mengajukan surat.
- Admin dapat memproses atau menolak surat.
- Warga dapat melihat status surat.
- Permission tiap role bekerja sesuai desain.

---

# 19. Out of Scope untuk MVP

Bagian berikut belum didukung secara eksplisit oleh sumber yang diberikan dan sebaiknya tidak dianggap requirement wajib sebelum diputuskan:

- Pembayaran online.
- Tanda tangan elektronik tersertifikasi.
- Integrasi Dukcapil secara langsung.
- Integrasi sistem pemerintahan eksternal.
- Mobile app native Android/iOS.
- Chat real-time warga dengan petugas.
- AI untuk klasifikasi pengaduan.
- Dashboard GIS tingkat lanjut.

---

# 20. Catatan Konsistensi Istilah

Dokumen sequence yang diberikan masih memiliki istilah “Desa” pada beberapa bagian pesan/alur.

Untuk produk **Kelurahan Betet Kota Kediri**, standar istilah UI yang diusulkan adalah:

| Istilah Lama pada Diagram | Istilah Produk |
|---|---|
| Desa | Kelurahan |
| Kantor Desa | Kantor Kelurahan |
| Admin Desa | Admin Kelurahan |
| Warga Desa | Warga Kelurahan |

Perubahan ini adalah keputusan terminologi produk, bukan perubahan logika alur.

---

# 21. Tahap Berikutnya

Setelah PRD disetujui:

1. `SITEMAP.md`
2. `USER-FLOW.md`
3. `DESIGN.md`
4. `DATABASE.md`
5. `API.md`
6. Setup backend Laravel
7. Setup frontend React + Vite + Bootstrap
8. Implementasi dan integrasi

