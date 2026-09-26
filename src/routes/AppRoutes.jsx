import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ScrollToTop from '../components/common/ScrollToTop.jsx';
import PageMeta from '../components/common/PageMeta.jsx';
import AppIcon from '../components/common/AppIcon.jsx';

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx';
import WargaLayout from '../layouts/WargaLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const AdminWarga = lazy(() => import('../pages/admin/AdminWarga.jsx'));
const AdminPengaduan = lazy(() => import('../pages/admin/AdminPengaduan.jsx'));
const AdminSurat = lazy(() => import('../pages/admin/AdminSurat.jsx'));
const AdminBerita = lazy(() => import('../pages/admin/AdminBerita.jsx'));
const AdminPengumuman = lazy(() => import('../pages/admin/AdminPengumuman.jsx'));
const AdminDokumen = lazy(() => import('../pages/admin/AdminDokumen.jsx'));
const AdminProfil = lazy(() => import('../pages/admin/AdminProfil.jsx'));
const AdminPerangkat = lazy(() => import('../pages/admin/AdminPerangkat.jsx'));
const AdminAdmins = lazy(() => import('../pages/admin/AdminAdmins.jsx'));
const AdminPetugas = lazy(() => import('../pages/admin/AdminPetugas.jsx'));
const AdminVideo = lazy(() => import('../pages/admin/AdminVideo.jsx'));
const AdminLayanan = lazy(() => import('../pages/admin/AdminLayanan.jsx'));
const AdminHero = lazy(() => import('../pages/admin/AdminHero.jsx'));

// Public Pages
const Beranda = lazy(() => import('../pages/public/Beranda.jsx'));
const Profil = lazy(() => import('../pages/public/Profil.jsx'));
const Pemerintahan = lazy(() => import('../pages/public/Pemerintahan.jsx'));
const BeritaList = lazy(() => import('../pages/public/BeritaList.jsx'));
const BeritaDetail = lazy(() => import('../pages/public/BeritaDetail.jsx'));
const PengumumanList = lazy(() => import('../pages/public/PengumumanList.jsx'));
const PengumumanDetail = lazy(() => import('../pages/public/PengumumanDetail.jsx'));
const LayananList = lazy(() => import('../pages/public/LayananList.jsx'));
const LayananDetail = lazy(() => import('../pages/public/LayananDetail.jsx'));
const PengaduanInfo = lazy(() => import('../pages/public/PengaduanInfo.jsx'));
const Pelacakan = lazy(() => import('../pages/public/Pelacakan.jsx'));
const Kontak = lazy(() => import('../pages/public/Kontak.jsx'));
const Cari = lazy(() => import('../pages/public/Cari.jsx'));
const ProfilSubPage = lazy(() => import('../pages/public/ProfilSubPage.jsx'));
const Kegiatan = lazy(() => import('../pages/public/Kegiatan.jsx'));
const Dokumen = lazy(() => import('../pages/public/Dokumen.jsx'));
const NotFound = lazy(() => import('../pages/public/NotFound.jsx'));
const TugasLaporan = lazy(() => import('../pages/public/TugasLaporan.jsx'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login.jsx'));
const Register = lazy(() => import('../pages/auth/Register.jsx'));
const Verifikasi = lazy(() => import('../pages/auth/Verifikasi.jsx'));

// Warga Pages
const Dashboard = lazy(() => import('../pages/warga/Dashboard.jsx'));
const PengaduanBaru = lazy(() => import('../pages/warga/PengaduanBaru.jsx'));
const PengaduanWarga = lazy(() => import('../pages/warga/PengaduanWarga.jsx'));
const SuratBaru = lazy(() => import('../pages/warga/SuratBaru.jsx'));
const SuratWarga = lazy(() => import('../pages/warga/SuratWarga.jsx'));
const Riwayat = lazy(() => import('../pages/warga/Riwayat.jsx'));
const Notifikasi = lazy(() => import('../pages/warga/Notifikasi.jsx'));
const WargaProfil = lazy(() => import('../pages/warga/WargaProfil.jsx'));

function RouteFallback() {
  return (
    <div className="container py-5 text-center" role="status" aria-live="polite">
      <div className="spinner-border text-brand" />
      <p className="text-muted small mt-3 mb-0">
        <AppIcon name="arrow-repeat" className="me-1" /> Memuat halaman…
      </p>
    </div>
  );
}

/**
 * Auth Guard — redirects unauthenticated users to /login
 */
function Guard() {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  return <WargaLayout />;
}

/**
 * Admin Guard — only for logged-in users with role admin
 */
function AdminGuard() {
  const { isLoggedIn, user } = useAuth();
  return isLoggedIn && user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" replace />;
}

/**
 * Guest Guard — redirects authenticated users away from login/register
 */
function GuestOnly({ children }) {
  const { isLoggedIn, user } = useAuth();
  return isLoggedIn ? <Navigate to={user?.role === 'admin' ? '/admin' : '/warga'} replace /> : children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageMeta />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
        {/* ── Public routes with navbar + footer ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/profil/:section" element={<ProfilSubPage />} />
          <Route path="/pemerintahan" element={<Pemerintahan />} />
          <Route path="/berita" element={<BeritaList />} />
          <Route path="/berita/:slug" element={<BeritaDetail />} />
          <Route path="/pengumuman" element={<PengumumanList />} />
          <Route path="/pengumuman/:slug" element={<PengumumanDetail />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/dokumen" element={<Dokumen />} />
          <Route path="/layanan" element={<LayananList />} />
          <Route path="/layanan/:slug" element={<LayananDetail />} />
          <Route path="/pengaduan" element={<PengaduanInfo />} />
          <Route path="/pelacakan" element={<Pelacakan />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/cari" element={<Cari />} />
          <Route
            path="/login"
            element={<GuestOnly><Login /></GuestOnly>}
          />
          <Route
            path="/register"
            element={<GuestOnly><Register /></GuestOnly>}
          />
          <Route path="/verifikasi" element={<Verifikasi />} />
          <Route path="/tugas/:token" element={<TugasLaporan />} />
        </Route>

        {/* ── Protected warga routes ── */}
        <Route element={<Guard />}>
          <Route path="/warga" element={<Dashboard />} />
          <Route path="/warga/surat-baru" element={<SuratBaru />} />
          <Route path="/warga/surat" element={<SuratWarga />} />
          <Route path="/warga/pengaduan-baru" element={<PengaduanBaru />} />
          <Route path="/warga/pengaduan" element={<PengaduanWarga />} />
          <Route path="/warga/riwayat" element={<Riwayat />} />
          <Route path="/warga/notifikasi" element={<Notifikasi />} />
          <Route path="/warga/profil" element={<WargaProfil />} />
        </Route>

        {/* ── Protected admin routes ── */}
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/warga" element={<AdminWarga />} />
          <Route path="/admin/pengaduan" element={<AdminPengaduan />} />
          <Route path="/admin/surat" element={<AdminSurat />} />
          <Route path="/admin/berita" element={<AdminBerita />} />
          <Route path="/admin/pengumuman" element={<AdminPengumuman />} />
          <Route path="/admin/dokumen" element={<AdminDokumen />} />
          <Route path="/admin/profil" element={<AdminProfil />} />
          <Route path="/admin/perangkat" element={<AdminPerangkat />} />
          <Route path="/admin/admins" element={<AdminAdmins />} />
          <Route path="/admin/petugas" element={<AdminPetugas />} />
          <Route path="/admin/video" element={<AdminVideo />} />
          <Route path="/admin/layanan" element={<AdminLayanan />} />
          <Route path="/admin/hero" element={<AdminHero />} />
        </Route>

        {/* ── Catch-all: custom 404 ── */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
