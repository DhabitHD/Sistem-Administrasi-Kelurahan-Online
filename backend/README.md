# Kelurahan Betet API

Backend REST API (Laravel 13 + Sanctum) untuk website resmi Kelurahan Betet, Kecamatan Pesantren, Kota Kediri. Melayani aplikasi web publik dan dashboard admin, serta portal warga.

## Fitur

**Publik**
- Berita, pengumuman, layanan, dokumen, perangkat kelurahan, video
- Profil kelurahan (visi, misi, sambutan, struktur, kontak) dan hero slider
- Pencarian konten dan pencatatan kunjungan

**Warga (perlu login)**
- Registrasi dan autentikasi via token Sanctum
- Pengajuan pengaduan dengan kode pelacakan (`tracking/{code}`)
- Pengajuan surat keterangan (KK/KTP, domisili, usaha, tidak mampu, dll.)
- Update profil, notifikasi real-time status pengajuan

**Admin**
- Kelola pengaduan dan surat (setujui/tolak/pantau status)
- Kelola warga, akun admin, statistik dashboard
- CRUD konten: berita, pengumuman, layanan, dokumen, perangkat, video
- Kelola hero slider, profil, dan struktur kelurahan

## Tech Stack

- Laravel 13, PHP 8.3+
- Laravel Sanctum (autentikasi API token)
- SQLite (default) / MySQL
- Vite

## Instalasi

```bash
# 1. Install dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Konfigurasi database di .env, lalu migrasi + seed
php artisan migrate --seed

# 4. Jalankan server
php artisan serve
```

Alternatif satu perintah: `composer setup` (otomatis install, generate key, migrate, build aset).

## Akun Demo (hasil seed)

| Role | Kredensial |
|------|-----------|
| Admin | `admin@betet.id` / `admin1234` |
| Warga | NIK `3571********1234` / `demo1234` |

## Struktur API

Prefix: `/api`

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Registrasi warga |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout (auth) |
| GET | `/auth/me` | Data user saat ini (auth) |

### Publik
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/berita` `/berita/{slug}` | Daftar/detail berita |
| GET | `/pengumuman` `/pengumuman/{slug}` | Daftar/detail pengumuman |
| GET | `/layanan` `/layanan/{slug}` | Daftar/detail layanan |
| GET | `/dokumen` `/dokumen/{slug}` | Daftar/detail dokumen |
| GET | `/perangkat` | Perangkat kelurahan |
| GET | `/videos` | Video profil & kegiatan |
| GET | `/cari` | Pencarian konten |
| POST | `/visits` | Catat kunjungan |
| GET | `/hero` | Hero slider |
| GET | `/profil` | Profil kelurahan |
| GET | `/tracking/{code}` | Lacak pengajuan tanpa login |

### Warga (auth: `auth:sanctum`)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/POST | `/pengaduan` `/pengaduan/{id}` | Kelola pengaduan |
| GET/POST | `/surat` `/surat/{id}` | Kelola pengajuan surat |
| PATCH | `/warga/profil` | Update profil |
| GET | `/notifikasi` | Daftar notifikasi |
| POST | `/notifikasi/seen` | Tandai dibaca |
| POST | `/upload` | Upload file/gambar |

### Admin (auth: `auth:sanctum` + role admin)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET/PATCH | `/admin/warga` `/admin/warga/{nik}/status` | Kelola warga |
| GET/PATCH | `/admin/pengaduan` `/admin/pengaduan/{id}/status` | Kelola pengaduan |
| GET/PATCH | `/admin/surat` `/admin/surat/{id}/status` | Kelola surat |
| GET | `/admin/stats` | Statistik dashboard |
| CRUD | `/admin/admins` | Kelola akun admin |
| GET/PUT | `/admin/profil` `/admin/profil/{id}` | Kelola profil |
| CRUD | `/admin/hero` | Kelola hero slider |
| CRUD | `/admin/{kind}` | Konten dinamis: berita, pengumuman, layanan dokumen, perangkat, video |

## Pengujian

```bash
composer test
```

## Lisensi

MIT