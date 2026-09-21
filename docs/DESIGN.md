# DESIGN.md — Website Kelurahan Betet Kota Kediri

**Frontend UI/UX & Engineering Design Specification**

| Property | Specification |
|---|---|
| Product | Website Kelurahan Betet Kota Kediri |
| Frontend | React + Vite |
| UI Framework | Bootstrap |
| Backend Contract | Laravel REST API |
| Database | MySQL |
| Local Environment | Laragon |
| Language | Bahasa Indonesia |
| Design Priority | Clarity > Decoration |
| Responsive Strategy | Mobile-first |
| Design Status | Draft Final untuk implementasi frontend |

---

# 1. Design Direction

Website harus terasa seperti **portal layanan publik yang modern, terpercaya, tenang, dan mudah digunakan**, bukan template dashboard generik atau landing page bergaya promosi.

Karakter visual:

- Resmi tetapi tidak kaku.
- Modern tetapi tidak berlebihan.
- Informatif tetapi tidak padat.
- Ramah untuk warga yang tidak terbiasa dengan aplikasi.
- Konsisten antara website publik, dashboard warga, petugas, dan admin.

Prinsip utama:

```text
Clarity      > Decoration
Usability    > Animation
Accessibility > Visual Effects
Consistency  > Creativity
Content      > Ornament
```

---

# 2. Technology Foundation

## 2.1 Frontend

- React
- Vite
- React Router
- Bootstrap
- Bootstrap Icons atau icon library yang dipilih pada implementation stage
- Axios untuk komunikasi API
- CSS/SCSS custom untuk design layer

## 2.2 Backend

- Laravel REST API

## 2.3 Database

- MySQL

## 2.4 Local Development

- Laragon

---

# 3. Architecture

```text
┌─────────────────────────────────────────┐
│              PUBLIC / SPA               │
│                                         │
│       React + Vite + Bootstrap          │
│                                         │
│  Pages / Components / Layouts / Forms   │
└───────────────────┬─────────────────────┘
                    │
                    │ HTTP / JSON
                    ▼
┌─────────────────────────────────────────┐
│              LARAVEL API                │
│                                         │
│ Routes → Controllers → Services → ORM   │
│                         │               │
│                         ▼               │
│                       MySQL             │
└─────────────────────────────────────────┘
```

Frontend tidak boleh membaca database secara langsung.

---

# 4. Information Architecture

```text
PUBLIC
├── Beranda
├── Profil
├── Pemerintahan
├── Berita
├── Pengumuman
├── Layanan
├── Pengaduan
├── Pelacakan
└── Kontak

AUTH
├── Login
├── Register
└── Status Verifikasi

WARGA
├── Dashboard
├── Profil
├── Pengaduan
│   ├── Daftar
│   ├── Buat Pengaduan
│   └── Detail
├── Layanan Surat
│   ├── Daftar
│   ├── Ajukan
│   └── Detail
└── Notifikasi

PETUGAS
├── Dashboard
├── Daftar Tugas
└── Detail Tugas / Magic Link

ADMIN
├── Dashboard
├── Verifikasi Warga
├── Pengaduan
├── Detail Pengaduan
├── Layanan Surat
├── Detail Surat
├── Data Petugas
└── Pengaturan / data administratif sesuai scope
```

---

# 5. Layout System

## 5.1 Public Layout

Struktur:

```text
┌─────────────────────────────────────────────┐
│ Topbar / informasi singkat                  │
├─────────────────────────────────────────────┤
│ Logo Kelurahan │ Navigation │ CTA          │
├─────────────────────────────────────────────┤
│                                             │
│                  CONTENT                    │
│                                             │
├─────────────────────────────────────────────┤
│ Footer                                       │
└─────────────────────────────────────────────┘
```

Navbar harus tetap ringan. Jangan membuat semua fitur menjadi menu utama.

Menu utama yang disarankan:

```text
Beranda
Profil
Informasi
Layanan
Pengaduan
Pelacakan
```

CTA:

```text
Login / Dashboard
```

## 5.2 Dashboard Layout

```text
┌──────────────┬──────────────────────────────┐
│ Sidebar      │ Header                       │
│              ├──────────────────────────────┤
│ Menu         │                              │
│              │ Main Content                 │
│              │                              │
└──────────────┴──────────────────────────────┘
```

Pada mobile, sidebar berubah menjadi:
- Offcanvas.
- Drawer.
- Atau navigation sheet sesuai implementasi Bootstrap.

---

# 6. Responsive Breakpoints

Gunakan breakpoint Bootstrap sebagai dasar.

Strategi:

## Mobile
- Satu kolom.
- CTA besar.
- Form full width.
- Card tidak terlalu banyak.
- Tabel berubah menjadi card/list bila diperlukan.
- Map diberi tinggi yang cukup.
- Sidebar menjadi offcanvas.

## Tablet
- Dua kolom untuk konten yang sesuai.
- Dashboard mulai menggunakan grid statistik.

## Desktop
- Container terkontrol.
- Dashboard dapat menggunakan sidebar tetap.
- Tabel dan panel informasi dapat berdampingan.

Jangan hanya mengecilkan layout desktop. Setiap halaman harus mempunyai perilaku mobile yang dirancang.

---

# 7. Visual Design System

## 7.1 Color Roles

Palet final harus menggunakan warna yang berperan sebagai **system token**, bukan warna acak per halaman.

```css
:root {
  --color-primary: #0f172a;
  --color-brand: #2563eb;
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
  --color-background: #f8fafc;

  --color-surface: #ffffff;
  --color-surface-muted: #f1f5f9;
  --color-border: #e2e8f0;

  --color-text: #0f172a;
  --color-text-muted: #64748b;
}
```

Penggunaan:

| Token | Kegunaan |
|---|---|
| Primary | Header, dark surface, teks utama tertentu |
| Brand | CTA, link aktif, primary action |
| Success | Berhasil, status positif |
| Warning | Menunggu/proses |
| Danger | Error, penolakan |
| Background | Background aplikasi |
| Surface | Card dan panel |
| Border | Pemisah |
| Text | Teks utama |
| Text Muted | Teks sekunder |

Catatan: jangan menjadikan warna sebagai satu-satunya penanda status.

---

# 8. Typography

Gunakan satu keluarga font utama agar website terasa konsisten.

Rekomendasi:

```text
Font:
Inter / system-ui / sans-serif
```

Hierarchy:

```text
Display
H1
H2
H3
H4
Body
Small
Caption
```

Aturan:
- H1 maksimal satu fokus utama per halaman.
- Body text nyaman dibaca.
- Hindari terlalu banyak ukuran font.
- Metadata menggunakan ukuran lebih kecil dan muted color.

---

# 9. Spacing

Gunakan sistem spacing Bootstrap sebagai baseline.

Prioritas:
- Section publik menggunakan vertical spacing yang lega.
- Form menggunakan jarak antar field yang konsisten.
- Card tidak terlalu rapat.
- Dashboard menggunakan gap seragam.

Jangan membuat setiap elemen memiliki padding berbeda tanpa alasan.

---

# 10. Border Radius & Shadow

Gunakan radius moderat.

```text
Small:
4–6px

Default:
8–12px

Large:
16px
```

Shadow:
- Sangat ringan untuk card.
- Lebih kuat hanya untuk modal/dropdown.
- Hindari shadow besar pada semua komponen.

Tujuannya membuat UI terasa modern tetapi tetap seperti aplikasi layanan publik.

---

# 11. Component System

## Navigation
- Navbar
- Mobile Navigation
- Breadcrumb

## Content
- Section Header
- Card
- Info Card
- News Card
- Service Card

## Form
- Text Input
- Select
- Textarea
- File Upload
- Date Input
- Validation Message
- Password Input

## Feedback
- Alert
- Toast
- Modal
- Confirmation Dialog
- Empty State
- Loading State
- Error State

## Data
- Table
- Pagination
- Search
- Filter
- Status Badge
- Timeline

## Dashboard
- Statistic Card
- Activity List
- Recent Complaint
- Recent Letter
- Quick Action

---

# 12. Status Design

Status harus menggunakan kombinasi:

```text
Badge color
+
Label text
+
Icon bila perlu
```

Contoh:

```text
PENDING
Menunggu

IN_PROGRESS
Sedang Diproses

CLOSED
Selesai

DIAJUKAN
Diajukan

SIAP_DIAMBIL
Siap Diambil

DITOLAK
Ditolak
```

Jangan hanya menggunakan:
- hijau,
- kuning,
- merah

tanpa teks.

---

# 13. Public Pages

## 13.1 Beranda

Tujuan: warga memahami fungsi website dalam beberapa detik.

Struktur:

```text
Hero
↓
Layanan Utama
↓
Akses Pengaduan
↓
Informasi / Berita
↓
Pengumuman
↓
Ringkasan pelayanan
↓
Kontak Kelurahan
↓
Footer
```

Hero tidak boleh memenuhi satu layar dengan dekorasi berlebihan.

CTA utama:

```text
Lihat Layanan
Ajukan Pengaduan
```

## 13.2 Profil

Gunakan struktur editorial:

```text
Page Header
↓
Tentang Kelurahan
↓
Informasi Wilayah
↓
Pemerintahan
↓
Kontak
```

## 13.3 Berita / Pengumuman

Gunakan:
- daftar card,
- tanggal,
- kategori,
- judul,
- ringkasan.

Detail menggunakan layout artikel yang fokus pada isi.

## 13.4 Layanan

Setiap layanan menggunakan card:

```text
Icon
Nama Layanan
Deskripsi singkat
Persyaratan ringkas
CTA
```

---

# 14. Authentication Pages

## 14.1 Login

Fokus:
- NIK/email sesuai sistem final.
- Password.
- Remember/session behavior sesuai backend.
- Link registrasi.
- Pesan error yang jelas.

Jangan memenuhi halaman login dengan ilustrasi besar.

## 14.2 Register

Berdasarkan sequence:

```text
Data warga
+
Foto KTP
↓
Validasi
↓
Pendaftaran
```

UX:
- Form dibagi menjadi kelompok yang masuk akal.
- Field wajib diberi tanda.
- Upload KTP mempunyai preview.
- Error ditampilkan dekat field.
- Sebelum submit, tampilkan ringkasan bila data cukup panjang.
- Setelah berhasil, tampilkan status menunggu verifikasi.

Pesan sukses:

```text
Pendaftaran berhasil.
Silakan cek status verifikasi akun secara berkala.
```

## 14.3 Verification Status

Tampilkan state:

```text
Menunggu Verifikasi
Verifikasi Berhasil
Pendaftaran Ditolak
```

Untuk `REJECTED`, alasan harus terlihat jelas.

---

# 15. Warga Dashboard

Dashboard bukan tempat untuk menampilkan semua data sekaligus.

Prioritas:

```text
Greeting
↓
Status akun
↓
Quick Actions
├── Ajukan Surat
└── Buat Pengaduan
↓
Ringkasan Pengaduan
↓
Ringkasan Surat
↓
Aktivitas Terbaru
```

Quick action maksimal beberapa tindakan penting agar tidak terasa penuh.

---

# 16. Pengaduan UI

## 16.1 Daftar Pengaduan

Kolom desktop:

```text
Nomor
Judul / Ringkasan
Kategori
Tanggal
Status
Action
```

Mobile:
- ubah menjadi card/list.

## 16.2 Form Pengaduan

Struktur:

```text
1. Informasi Pengaduan
   - Kategori
   - Deskripsi

2. Lokasi
   - Peta
   - Pin lokasi
   - Koordinat

3. Bukti
   - Upload foto
   - Preview

4. Review
   - Ringkasan data

5. Submit
```

Peta menjadi bagian inti karena sumber alur menyebut form pengaduan dan geo-tagging.

Gunakan peta sebagai alat bantu penentuan lokasi, bukan dekorasi.

---

# 17. Tracking Pengaduan

Gunakan timeline horizontal pada desktop atau vertical pada mobile.

Contoh:

```text
Pengaduan Dikirim
      │
      ●
      │
Pengaduan Ditugaskan
      │
      ●
      │
Petugas Menangani
      │
      ●
      │
Pengaduan Ditutup
```

Setiap event dapat menampilkan:
- tanggal/waktu,
- status,
- catatan,
- bukti foto jika tersedia.

---

# 18. Layanan Surat UI

## 18.1 Daftar Layanan

Card per jenis surat:

```text
Nama surat
Deskripsi
Persyaratan
Estimasi proses (jika resmi tersedia)
[Ajukan]
```

Jangan menampilkan estimasi jika belum ada data resmi.

## 18.2 Form Surat

Flow:

```text
Pilih jenis surat
↓
Data profil otomatis
↓
Lengkapi formulir
↓
Upload lampiran
↓
Review
↓
Ajukan
```

Data profil dapat digunakan untuk autofill sesuai sequence diagram.

---

# 19. Detail Surat

Status:

```text
DIAJUKAN
    ↓
SIAP DIAMBIL
```

atau:

```text
DIAJUKAN
    ↓
DITOLAK
```

Jika ditolak:

```text
Status: Ditolak

Alasan:
[alasan penolakan]
```

Nomor surat ditampilkan jika status/data sudah tersedia.

---

# 20. Petugas Dashboard

Prioritas dashboard:

```text
Tugas Aktif
↓
Tugas Baru
↓
Tugas Selesai
↓
Daftar Tugas
```

Card tugas:

```text
Nomor Pengaduan
Kategori
Lokasi
Tanggal
Status
Buka Tugas
```

Jangan menampilkan data pribadi warga lebih banyak daripada yang diperlukan petugas.

---

# 21. Magic Link Page

Halaman harus sangat sederhana karena dapat dibuka dari WhatsApp.

State valid:

```text
Header
↓
Detail Laporan
↓
Peta Lokasi
↓
Form Aksi
↓
Upload Bukti
↓
Catatan
↓
Selesaikan
```

State invalid/expired:

```text
Ikon status
Akses tidak valid atau sudah kedaluwarsa.
Silakan gunakan link tugas terbaru.
```

Jangan menampilkan dashboard penuh pada halaman Magic Link.

---

# 22. Admin Dashboard

Admin membutuhkan information density lebih tinggi dibanding warga, tetapi tetap terstruktur.

Layout:

```text
Sidebar
Header
↓
Statistic Cards
↓
Pengaduan Menunggu
↓
Permohonan Surat
↓
Verifikasi Warga
↓
Aktivitas Terbaru
```

Statistic cards:
- Pengaduan pending.
- Pengaduan aktif.
- Surat diajukan.
- Verifikasi warga.

Statistik tambahan hanya ditambahkan bila memang dibutuhkan.

---

# 23. Admin — Verifikasi Warga

Table:

```text
Nama
NIK
Tanggal Daftar
Status
Action
```

Detail verification:

```text
Data Warga
+
Preview KTP
+
Action
```

Action:

```text
Setujui
Tolak
```

Tolak harus meminta alasan.

Jangan tampilkan preview KTP dalam ukuran kecil yang menyulitkan pemeriksaan.

---

# 24. Admin — Pengaduan

Table:

```text
ID
Kategori
Tanggal
Status
Petugas
Action
```

Filter:
- Status.
- Kategori.
- Tanggal.
- Petugas.

Detail:

```text
Informasi Aduan
↓
Peta
↓
Bukti
↓
Timeline
↓
Petugas
↓
Action
```

Assign Petugas:

```text
Pilih Pengaduan
↓
Pilih Petugas
↓
Konfirmasi
↓
Simpan
```

Setelah berhasil, tampilkan feedback yang jelas.

---

# 25. Admin — Surat

Table:

```text
Nomor / ID
Pemohon
Jenis Surat
Tanggal
Status
Action
```

Detail:

```text
Data Pemohon
↓
Data Form
↓
Lampiran
↓
Action
```

Action:

```text
Proses & Cetak
Tolak
```

Untuk penolakan:
- wajib alasan,
- tampilkan confirmation,
- tampilkan hasil setelah submit.

---

# 26. Admin — Data Petugas

Form:

```text
Nama
Nomor WhatsApp
Status
```

Validasi:
- Nama wajib.
- Nomor WhatsApp mengikuti format yang ditetapkan backend.

Setelah berhasil:

```text
Data petugas berhasil ditambahkan.
```

---

# 27. Form UX

Semua form harus mempunyai:

```text
Label
Input
Hint (bila perlu)
Validation
Error
Loading
Success / Failure
```

Jangan hanya mengandalkan placeholder sebagai label.

Untuk form upload:
- tampilkan nama file,
- ukuran,
- preview jika gambar,
- action hapus/ganti.

---

# 28. Loading State

Gunakan:
- Skeleton untuk halaman data.
- Spinner hanya untuk action singkat.
- Disable button saat request berlangsung.

Contoh:

```text
[Mengirim...]
```

bukan button tetap aktif saat request berjalan.

---

# 29. Empty State

Contoh:

```text
Belum ada pengaduan
Anda belum mempunyai pengaduan.
[Buat Pengaduan]
```

Empty state harus memberi konteks dan action bila memang ada.

---

# 30. Error State

Gunakan pesan yang dapat dipahami warga.

Hindari:

```text
500 Internal Server Error
```

di UI pengguna.

Gunakan:

```text
Data belum dapat dimuat.
Silakan coba lagi.
[Coba Lagi]
```

Detail teknis hanya dicatat pada logging/development.

---

# 31. Toast & Notification

Gunakan Toast untuk:
- data berhasil disimpan,
- status berhasil diubah,
- action singkat.

Gunakan Alert/Inline Error untuk:
- kesalahan input,
- kesalahan validasi,
- pesan yang perlu tetap terlihat.

---

# 32. Accessibility

Target:
- label form benar.
- focus state jelas.
- keyboard navigation.
- button mempunyai nama yang jelas.
- icon-only button mempunyai aria-label.
- jangan mengandalkan warna saja.
- link dapat dikenali.
- ukuran target sentuh mobile memadai.

---

# 33. Animation

Animation harus minimal.

Boleh:
- fade ringan,
- collapse,
- modal,
- progress transition,
- hover sederhana.

Hindari:
- parallax berat,
- animasi semua card,
- scroll effect berlebihan,
- background bergerak,
- glassmorphism berlebihan.

Website kelurahan adalah aplikasi pelayanan publik. Interaksi harus terasa cepat dan dapat diprediksi.

---

# 34. Bootstrap Usage Rules

Bootstrap digunakan sebagai foundation, bukan sebagai tampilan final.

Gunakan:
- Grid.
- Container.
- Flex utilities.
- Spacing utilities.
- Form system.
- Modal.
- Offcanvas.
- Dropdown.
- Table.
- Pagination.
- Toast.
- Alert.

Custom layer:
- Typography refinement.
- Color token.
- Card appearance.
- Navbar.
- Dashboard sidebar.
- Status badge.
- Empty state.
- Timeline.
- Service card.

Hindari membiarkan seluruh website terlihat seperti contoh default Bootstrap.

---

# 35. Component Naming

Gunakan naming yang jelas dan konsisten.

Contoh:

```text
components/
├── common/
│   ├── AppButton.jsx
│   ├── AppModal.jsx
│   ├── AppAlert.jsx
│   └── StatusBadge.jsx
│
├── layout/
│   ├── PublicNavbar.jsx
│   ├── PublicFooter.jsx
│   ├── DashboardSidebar.jsx
│   └── DashboardHeader.jsx
│
├── complaint/
│   ├── ComplaintForm.jsx
│   ├── ComplaintCard.jsx
│   ├── ComplaintTimeline.jsx
│   └── ComplaintMap.jsx
│
├── letter/
│   ├── LetterForm.jsx
│   ├── LetterCard.jsx
│   └── LetterStatus.jsx
│
└── admin/
    ├── UserVerificationTable.jsx
    ├── OfficerTable.jsx
    └── ComplaintAssignmentModal.jsx
```

---

# 36. Suggested React Structure

```text
frontend/
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── warga/
│   │   ├── petugas/
│   │   └── admin/
│   │
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── contexts/
│   ├── utils/
│   ├── styles/
│   │   ├── _variables.scss
│   │   ├── _components.scss
│   │   └── app.scss
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── vite.config.js
```

---

# 37. Route Strategy

Contoh struktur route:

```text
/
 /profil
 /pemerintahan
 /berita
 /pengumuman
 /layanan
 /pengaduan
 /pelacakan
 /kontak

 /login
 /register
 /verifikasi

 /warga
 /warga/pengaduan
 /warga/pengaduan/buat
 /warga/pengaduan/:id
 /warga/surat
 /warga/surat/buat
 /warga/surat/:id
 /warga/profil

 /petugas
 /petugas/tugas
 /petugas/tugas/:id

 /tugas/:token

 /admin
 /admin/verifikasi
 /admin/pengaduan
 /admin/pengaduan/:id
 /admin/surat
 /admin/surat/:id
 /admin/petugas
```

Route final wajib mengikuti kontrak API dan authorization backend.

---

# 38. API Consumption Layer

React tidak menulis request API langsung di setiap component.

Gunakan service layer:

```text
services/
├── authService.js
├── complaintService.js
├── letterService.js
├── userService.js
├── officerService.js
└── notificationService.js
```

Contoh konsep:

```js
export async function getComplaints(params) {
  return api.get('/complaints', { params });
}
```

Component bertugas mengatur UI, bukan detail HTTP.

---

# 39. State Strategy

Pisahkan:

### UI State
Contoh:
- modal terbuka/tutup,
- selected row,
- filter lokal.

### Server State
Contoh:
- daftar pengaduan,
- detail surat,
- profile,
- dashboard statistics.

### Auth State
Contoh:
- user,
- role,
- authentication status.

Implementasi library state management dapat dipilih setelah kebutuhan final ditetapkan.

---

# 40. Security UX

Frontend:
- jangan menyimpan data sensitif lebih lama dari kebutuhan.
- jangan menampilkan KTP di public page.
- jangan memperlihatkan data warga ke role yang tidak membutuhkan.
- tampilkan confirmation untuk action destruktif.
- route berdasarkan role.

Backend tetap menjadi sumber otorisasi utama. Frontend guard bukan pengganti authorization Laravel.

---

# 41. Sensitive Data

Data berikut dianggap sensitif dalam UI:

- NIK.
- Foto KTP.
- Nomor WhatsApp.
- Data pribadi warga.
- Token Magic Link.

Aturan desain:
- NIK dapat dimasking pada list.
- KTP hanya tampil pada halaman yang berhak.
- Token Magic Link tidak ditampilkan sebagai teks mentah.
- Jangan masukkan data sensitif ke URL kecuali mekanisme tersebut memang diperlukan dan aman.

---

# 42. Content Guidelines

Gunakan bahasa sederhana.

Contoh:

```text
Tidak:
"Silakan melakukan submit pengaduan"

Gunakan:
"Kirim Pengaduan"
```

Tidak:
```text
"Terjadi error ketika melakukan proses request"
```

Gunakan:
```text
"Pengaduan belum dapat dikirim. Coba lagi."
```

Status harus konsisten di seluruh aplikasi.

---

# 43. Mobile Priority

Fitur yang paling penting untuk warga:

```text
Login
↓
Ajukan Surat
↓
Buat Pengaduan
↓
Lacak Status
```

Setiap flow tersebut harus dapat digunakan dengan satu tangan pada layar mobile sejauh memungkinkan.

---

# 44. Definition of Done — Frontend

Satu halaman dianggap selesai apabila:

- Responsive.
- Loading state tersedia.
- Empty state tersedia jika relevan.
- Error state tersedia.
- Form validation tersedia jika ada form.
- Keyboard accessible.
- API loading/error ditangani.
- Tidak ada hardcoded data yang seharusnya berasal dari API.
- Tidak ada route yang dapat diakses role yang salah.
- Konsisten dengan design tokens.
- Tidak menggunakan animation yang tidak diperlukan.

---

# 45. Design Anti-Slop Rules

Website tidak boleh menggunakan pola desain otomatis yang terlalu generik.

Hindari:
- hero dengan gradient besar tanpa tujuan,
- terlalu banyak glassmorphism,
- kartu dengan shadow tebal di semua tempat,
- icon besar di setiap card,
- angka statistik hanya sebagai dekorasi,
- rounded corner berlebihan,
- terlalu banyak warna,
- animasi yang tidak berkaitan dengan task,
- dashboard penuh grafik tetapi tidak membantu pekerjaan.

Gunakan hierarchy berdasarkan kebutuhan pengguna.

Untuk warga:
```text
Layanan
→ Action
→ Status
→ Informasi
```

Untuk petugas:
```text
Tugas
→ Lokasi
→ Action
→ Bukti
```

Untuk admin:
```text
Overview
→ Queue
→ Review
→ Action
```

---

# 46. Acceptance Checklist UI

## Public
- [ ] Navbar responsive.
- [ ] Beranda memiliki CTA jelas.
- [ ] Informasi mudah dipindai.
- [ ] Footer berisi kontak.
- [ ] Semua halaman memiliki loading/error yang layak jika memakai data API.

## Warga
- [ ] Register.
- [ ] Status verifikasi.
- [ ] Login.
- [ ] Dashboard.
- [ ] Pengaduan.
- [ ] Surat.
- [ ] Tracking.

## Petugas
- [ ] Dashboard.
- [ ] Daftar tugas.
- [ ] Magic Link.
- [ ] Peta.
- [ ] Upload bukti.
- [ ] Catatan.

## Admin
- [ ] Dashboard.
- [ ] Verifikasi warga.
- [ ] Pengaduan.
- [ ] Assignment petugas.
- [ ] Surat.
- [ ] Data petugas.

---

# 47. Dokumen Lanjutan

Setelah PRD dan DESIGN.md, dokumen berikutnya yang sebaiknya dibuat:

```text
docs/
├── PRD.md
├── DESIGN.md
├── SITEMAP.md
├── USER-FLOW.md
├── DATABASE.md
├── API.md
├── AUTH.md
└── DEPLOYMENT.md
```

`DATABASE.md` dan `API.md` baru dikunci setelah entity, status, dan business rule final disepakati.

