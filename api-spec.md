# API Spec — Portal Kelurahan Betet

Base URL (dev): `http://kelurahan-betet-api.test/api`
Auth: `Authorization: Bearer <token>` (Sanctum). Token didapat dari `POST /api/auth/login`.

Format respon:
- Sukses: `{ "message": "...", "data": ... }` (data dapat berupa null)
- Error: `{ "message": "...", "errors": { field: ["..."] } }` (errors hanya utk 422)

Kode: `200` `201` `204` `400` `401` `403` `404` `422`.

Field umum:
- status user: `PENDING | VERIFIED | REJECTED`
- status pengaduan/surat: `DIAJUKAN | IN_PROGRESS | SIAP_DIAMBIL | CLOSED | DITOLAK` (SIAP_DIAMBIL hanya utk surat)
- role: `warga | admin`

---

## 1. Publik (tanpa auth)

### GET /api/berita
Query: `?page=1&per_page=9&q=` (opsional)
- Cari berdasarkan title/category.
Response `data`: `{ data: Berita[], meta: {...} }` — Laravel paginator.

### GET /api/berita/{slug}
Response `data`: Berita (lihat skema) + null bila tak ada.

### GET /api/pengumuman · GET /api/pengumuman/{slug}
Sama pola berita (tanpa category, dgn `image`).

### GET /api/layanan · GET /api/layanan/{slug}
Layanan: `{ id, slug, name, short, icon, requirements: string[], process }`.

### GET /api/cari?q=
Gabungan berita+pengumuman+layanan. Response:
`{ data: [{ type: "berita"|"pengumuman"|"layanan", item: {...} }] }`

### POST /api/visits
Tambah kunjungan hari ini (tanpa body). Response `{ data: { total } }`.

---

## 2. Auth (publik)

### POST /api/auth/register
Body: `nama, nik(16), kk(16), alamat, wa(9-15), email?, password(min6), ktp?` (ktp = dataURL gambar `data:image/*;base64,...` maks 500KB — server simpan ke `/storage/uploads/...`; atau path hasil upload bila sudah diunggah).
Validasi unik: nik, email.
Response `201`: `{ data: { nik } }`. User dibuat status `PENDING`, role `warga`.

### POST /api/auth/login
Body: `identity` (NIK atau email) + `password`.
- User tak ditemukan → `404 { message: "Akun tidak ditemukan..." }`
- Password salah → `401`
- status PENDING → `403 "Akun masih menunggu verifikasi."`
- status REJECTED → `403 "Akun Anda ditolak."`
- Sukses → `200 { data: { token, user } }` (token = Sanctum plain text 40 char)

### POST /api/auth/logout
Revoke token aktif. `204`.

### GET /api/auth/me
Response `data`: user.

---

## 3. Warga (auth:sanctum, role warga)

### GET /api/pengaduan
List pengaduan milik sendiri, terbaru dulu.
`data: [ { id, id_code, title, category, description, rt, rw, gmaps_link, photo, status, created_at } ]`

### POST /api/pengaduan
Body: `title, category, description, rt, rw, gmaps_link?, photos?` (rt/rw int 1–99; gmaps_link URL opsional; `photos` = array of path hasil upload / base64 dataURL, maks 5 — server detect prefix `data:`). `photo` (string) tetap diterima utk kompatibilitas.
Server generate `id_code` = `PGD-<angka urut global>`. Status awal `DIAJUKAN`, buat notifikasi warga.
Response `201`: pengaduan.

### GET /api/pengaduan/{id}
Data sendiri. `403` kalau milik user lain.

### GET /api/surat · POST /api/surat · GET /api/surat/{id}
POST body: `jenis, description, catatan?, attachments?` (`attachments` = array path/URL hasil upload, maks 5 — dokumen penunjang). `id_code` = `SK-<urutan>`. Sama pola pengaduan.

### PATCH /api/warga/profil
Body: `wa, email, alamat, avatar?`.
Response: user terbaru.

### GET /api/notifikasi
`data: [ { id, message, created_at, read_at } ]` terbaru dulu.

### POST /api/notifikasi/seen
Tandai semua terbaca. `204`.
Unread badge = `count(read_at IS NULL)` (frontend ambil dari `me`/user).

### GET /api/tracking/{kode}
Cari di complaints & letters (kasus kode di-upper-case). Response
`{ data: { kind: "Pengaduan"|"Surat", status, item: {...} } }`, `404` bila tak ada.
Catatan: field `token` selalu di-hidden dari respons (magic link tugas).

### GET /api/tugas/{token} · POST /api/tugas/{token}/laporan
Halaman tugas petugas via magic link (tanpa auth; token rahasia per pengaduan, dibuat `Str::random(40)` saat pengaduan dibuat / dipastikan di-isi saat plotting).
- `GET` → `{ data: complaint + petugas }` (tanpa `token`); `404` bila token tak dikenal.
- `POST` body `laporan` (wajib, string) + `laporan_fotos?` (array dataURL gambar jpeg/png/webp maks 500 KB, maks 3). Status otomatis `CLOSED`, notifikasi dikirim ke warga. `422` bila pengaduan sudah `CLOSED`/`DITOLAK`. Foto disimpan spt KTP (`anon_{time}_{uniq}.{ext}`, via `TugasController::storeFoto`).

---

## 4. Admin (auth:sanctum, role admin)

### GET /api/admin/warga
Query `?status=&q=` (status PENDING/VERIFIED/REJECTED; q nama/nik/email).
`data: [ user ]`.

### PATCH /api/admin/warga/{nik}/status
Body: `status: VERIFIED|REJECTED`, `note?` (string, maks 1000 char — alasan tolok/catatan).
Server buat notifikasi utk user tsb (isi `note` bila ada; REJECTED pakai `note` sbg pesan) + log aktivitas.
Response `200` user.

### PATCH /api/admin/pengaduan/{id}/status · PATCH /api/admin/surat/{id}/status
Body: `status`.
Rules maju: utk pengaduan `DIAJUKAN→IN_PROGRESS→CLOSED`, boleh `DITOLAK`; utk surat `DIAJUKAN→IN_PROGRESS→SIAP_DIAMBIL→CLOSED`, boleh `DITOLAK`. Mundur/kembalinya sama → `422`.
Server buat notifikasi + log. Response pengaduan/surat.

### Petugas lapangan — GET/POST /api/admin/officers · PUT/DELETE /api/admin/officers/{id}
Data petugas kontak-saja (tidak ada akun login): `{ nama, wa, foto? }` (wa = nomor WhatsApp, foto = URL hasil upload, opsional). PUT tanpa `foto` mempertahankan foto lama. DELETE → `204` (`officer_id` di pengaduan terkait otomatis null).

### PATCH /api/admin/pengaduan/{id}/petugas
Body: `officer_id` (wajib, harus ada di `officers`).
Plotting petugas ke pengaduan. Status otomatis jadi `IN_PROGRESS`. Tolak (`422`) bila status `CLOSED`/`DITOLAK` atau petugas sama. Response `200 { data: { item, petugas, wa_link } }`.
- `wa_link` = URL `https://wa.me/<digits>?text=...` (angka `0` di depan diganti `62`) — detail pengaduan (id_code, judul, kategori, deskripsi, lokasi RT/RW, link peta, pelapor) ter-encode sebagai isi pesan, **plus magic link** `{frontend_url}/tugas/{token}` utk isi laporan penutupan. Frontend buka link ini utk "kirim otomatis" ke petugas.
- `magic_link` = URL penuh halaman tugas petugas.
Re-assign (ganti petugas) diperbolehkan kapan pun.

### POST /api/admin/pengaduan/{id}/tutup
Body: `laporan` (wajib, string) + `laporan_foto?`/`laporan_fotos?` (URL hasil upload `/api/upload` — admin sudah login).
Administrasi menutup pengaduan langsung: simpan `laporan`/`laporan_foto`/`laporan_fotos`, status otomatis `CLOSED`, notifikasi dikirim ke warga. `422` bila status sudah `CLOSED`/`DITOLAK`. Response pengaduan.

### CRUD konten — admin/berita · admin/pengumuman · admin/layanan · admin/dokumen · admin/perangkat
- `GET /api/admin/berita` (semua, tanpa paginate), `POST /api/admin/berita`, `GET /api/admin/berita/{slug}`, `PUT /api/admin/berita/{slug}`, `DELETE /api/admin/berita/{slug}`.
- Sama utk `pengumuman`, `layanan`, `dokumen`, dan `perangkat` (field sesuai skema di bawah).
- `dokumen`: `{ title, category[DOKUMEN|INFORMASI], desc, icon, file?, content[]?, date }`.
- `perangkat`: `{ role, name, photo?, order }`, slug = auto.
- Delete → `204`.

### GET /api/admin/stats
`data: { warga_total, warga_pending, pengaduan_total, pengaduan_aktif, surat_total, surat_aktif, berita_total, kunjungan_hari_ini }`

---

## 5. Upload

### POST /api/upload
Multipart: `file` (gambar jpeg/png/jpg/gif/webp, dokumen pdf/doc/docx, atau video mp4/webm/mov; max 50MB server; client mewajibkan 500KB utk KTP/avatar).
Response `201 { data: { path } }`, path = **URL absolut** `{APP_URL}/storage/uploads/<nama>` (disaji via route `web.php` `/storage/uploads/{file}`).
Validasi: ekstensi dari isi file (`guessExtension`). File disimpan `storage/app/public/uploads/{prefix}_{timestamp}_{uniq}.{ext}` (prefix = user-id login, `anon` saat belum login — dipakai register utk foto KTP).

---

## Skema JSON

```jsonc
user: {
  nik, name, email, kk, alamat, wa, role, status,
  avatar: path|null,       // /uploads/xxx
  created_at
}

berita: {
  slug, title, summary, content: [string], image, category, date
}
pengumuman: {
  slug, title, summary, content: [string], image, date
}
layanan: {
  slug, name, short, icon, requirements: [string], process
}
complaint: {
  id, id_code, title, category, description, rt, rw, gmaps_link, photo, photos: [URL]|null,
  status, created_at, laporan, laporan_foto, laporan_fotos: [URL]|null,
  petugas: { id, nama, wa, foto } | null   // admin list; diplot petugas
  // token: rahasia, tidak pernah diserialisasi
}
letter: {
  id, id_code, jenis, description, catatan, attachments: [URL]|null, status, created_at
}
```

Field tak dikirim server: `password`, `notifCount`, `activities` (diganti notifikasi + activity_logs).