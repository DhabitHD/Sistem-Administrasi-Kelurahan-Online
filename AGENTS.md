# AGENTS.md

Frontend portal Kelurahan Betet (React + Vite + Bootstrap 5). Backend: Laravel 13 + MySQL (`C:\laragon\www\kelurahan-betet-api`, DB `kelurahan_betet`, auth Sanctum token). Kontrak API: `api-spec.md` di root.

## Perintah
- Backend: `php artisan serve --port=8000` (di folder backend; MySQL harus jalan lewat Laragon).
- Dev: `npm run dev` (Vite proxy `/api` → `http://127.0.0.1:8000`).
- Build-check: `npm run build` (wajib setelah perubahan nyata; ini satu-satunya verifikasi — tidak ada lint/test)
- Seeder demo: `php artisan db:seed --force` (idempotent). Refresh total: `php artisan migrate:fresh --seed`.

## Struktur
- `src/main.jsx` — entry: import Bootstrap CSS/JS + bootstrap-icons + `styles/app.css`, bungkus `<AuthProvider>`.
- `src/routes/AppRoutes.jsx` — semua route. Route publik ada di bawah `<PublicLayout>`, route warga (wajib login) di bawah `<Guard>`. `PageMeta` (auto `<title>`/meta description per route) + `ScrollToTop` dirender di dalam `<BrowserRouter>`. Route `*` → halaman `NotFound`.
- Halaman baru: buat di `src/pages/{public,warga,auth}/`, import + daftarkan di `AppRoutes.jsx`.
- Data konten: `src/data/` (berita, layanan, pengumuman). Gambar: `public/assets/placeholders/`.
- Styling: Bootstrap terpasang; class custom di `src/styles/app.css`. Reuse class yang ada: `btn-brand`, `dashboard-card`, `side-card`, `empty-state`, `doc-icon`, `service-icon`, `page-header`, component `StatusBadge`.
- Halaman daftar (Berita/Layanan/Pengumuman/Kegiatan) punya input pencarian lokal — tambah filter serupa kalau ada daftar baru.
- `Dokumen.jsx` "mengunduh" dokumen via Blob yang di-generate (simulasi); ganti dengan sumber file asli saat backend ada.

## API layer — penting
- Semua data dari Laravel API (`C:\laragon\www\kelurahan-betet-api`, MySQL `kelurahan_betet`). Kontrak lengkap: `api-spec.md`.
- `src/services/api.js` — axios instance (baseURL `/api`, Vite proxy ke `127.0.0.1:8000`). Interceptor sisip token `betet_token` (Sanctum, localStorage), unwrap `data.data`, 401 → buang sesi. Helper `uploadFile(dataURL/File)`.
- `src/contexts/AuthContext.jsx` expose: `user, isLoggedIn, login, logout, register, updateUser, refreshUser`. User + token disimpan localStorage (`betet_token`, `betet_user`); mount → refresh `GET /auth/me`.
- Demo (via seeder): warga `3571********1234`/`demo1234`, admin `admin@betet.id`/`admin1234`. Login redirect sesuai `role`.
- `src/services/store.js` — bungkus API: pengaduan/surat/profil/notifikasi (warga), list & set-status warga/pengaduan/surat (admin), hooks `useComplaints`/`useLetters`/`useNotifications`, `uploadDataUrl`, `fetchTracking`, `trackVisit`.
- `src/services/contentStore.js` — cache berita/pengumuman/layanan; hooks `useBerita`/`usePengumuman`/`useLayanan` fetch ke API + pub/sub refresh (CRUD admin otomatis meng-update UI). **Jangan** import `src/data/*` untuk tampilan.
- Status string: `PENDING|VERIFIED|REJECTED` (akun), `DIAJUKAN|IN_PROGRESS|SIAP_DIAMBIL|CLOSED|DITOLAK` (item). `StatusBadge` sudah map semua.
- ID kode `PGD-XXX`/`SK-XXX` dibuat server (lih. `WargaController::nextCode`).
- Foto (KTP/avatar/bukti pengaduan): upload multipart → server balas URL `/storage/uploads/...`. Client batasi 500KB sebelum kirim.
- Notifikasi & kunjungan: dari server; badge sidebar = `user.notif_unread`.

## Konvensi / gotcha
- Bahasa antarmuka: Indonesia. Kode: string capital untuk status (`PENDING`, `VERIFIED`, `DIAJUKAN`, `SIAP_DIAMBIL`, `IN_PROGRESS`, `CLOSED`, `DITOLAK`).
- Berita, pengumuman, & layanan dibaca dari `src/services/contentStore.js` (cache modul, fetch API; not seed). Admin mengelolanya via `AdminBerita`/`AdminPengumuman`/`AdminLayanan`. **Jangan** import langsung dari `src/data/` untuk tampilan — kalau tidak, edit admin tak terlihat.
- Pencarian global: input di navbar → route `/cari` (`Cari.jsx`) yang menggabungkan berita/pengumuman/layanan dari contentStore.
- Ikon: pakai `lucide-react` via component `AppIcon` (`name` kebab, map di `src/components/common/AppIcon.jsx`). **Jangan pakai `bi bi-*` lagi** — boostrap-icons sudah tidak diimport. Brand icon (IG/TikTok/YT) cuma ada di footer sebagai SVG inline.
- Ikon animasi (opsional): `LottieIcon` (`src/components/common/LottieIcon.jsx`). Konvensi: taruh Lottie JSON di `public/assets/icons/layanan/<slug>.json` → otomatis animasi di kartu layanan; kalau file belum ada, fallback ke `AppIcon`. Sample/acuan format: `public/assets/icons/layanan/_contoh.json`.
- Font: `--font-body:'Sora'`, `--font-display:'Bricolage Grotesque'` (Google Fonts di `index.html`).
- Animasi halus ada di blok "Motion polish" (`app.css`): `.reveal` spring+blur, `.bg-pattern::after` float, `.section-title::after` grow, `.btn-brand::after` shine, stagger hero. Hormati `prefers-reduced-motion`.
- Warna brand: biru terang ala Astra (`--color-brand:#2563EB`, light `#60A5FA`, dark `#1E40AF`) di atas backdrop putih/abu lembut. Jangan re-introduce merah/hijau.
- Background "anti-polos": class `bg-pattern` (dot-grid + glow blob) & `.bg-blob`; wave SVG di bottom hero (`hero-wave`). Tambah ke section baru supaya konsisten dengan ala astra.co.id.
- Hero homepage = carousel gambar geser (`hero-carousel` → `hero-track`/`hero-slide`) + swipe pointer events; tambah slide di array `slides` pada `HeroSection.jsx`.
- `StatusBadge` pakai dot (`status-dot`), bukan ikon.
- Foto pejabat di `Pemerintahan.jsx` dari `i.pravatar.cc` (placeholder, fallback inisial saat offline).
- `PageMeta` (auto `<title>`/meta description per route) + `ScrollToTop` dirender di dalam `<BrowserRouter>` di `AppRoutes.jsx`. Route `*` → halaman `NotFound`.
- `StatusBadge` punya map status — add status baru ke sana kalau dipakai.
- `.env` set `VITE_API_BASE_URL=/api` (Vite proxy `/api` → `http://127.0.0.1:8000`). Ganti backend target di `vite.config.js` kalau port/domain berubah.