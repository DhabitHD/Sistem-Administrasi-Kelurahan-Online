import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ScrollToTop from '../components/common/ScrollToTop.jsx';
import PageMeta from '../components/common/PageMeta.jsx';

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx';
import WargaLayout from '../layouts/WargaLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminWarga from '../pages/admin/AdminWarga.jsx';
import AdminPengaduan from '../pages/admin/AdminPengaduan.jsx';
import AdminSurat from '../pages/admin/AdminSurat.jsx';
import AdminBerita from '../pages/admin/AdminBerita.jsx';
import AdminPengumuman from '../pages/admin/AdminPengumuman.jsx';
import AdminDokumen from '../pages/admin/AdminDokumen.jsx';
import AdminProfil from '../pages/admin/AdminProfil.jsx';
import AdminPerangkat from '../pages/admin/AdminPerangkat.jsx';
import AdminAdmins from '../pages/admin/AdminAdmins.jsx';
import AdminPetugas from '../pages/admin/AdminPetugas.jsx';
import AdminVideo from '../pages/admin/AdminVideo.jsx';
import AdminLayanan from '../pages/admin/AdminLayanan.jsx';
import AdminHero from '../pages/admin/AdminHero.jsx';

// Public Pages
import Beranda from '../pages/public/Beranda.jsx';
import Profil from '../pages/public/Profil.jsx';
import Pemerintahan from '../pages/public/Pemerintahan.jsx';
import BeritaList from '../pages/public/BeritaList.jsx';
import BeritaDetail from '../pages/public/BeritaDetail.jsx';
import PengumumanList from '../pages/public/PengumumanList.jsx';
import PengumumanDetail from '../pages/public/PengumumanDetail.jsx';
import LayananList from '../pages/public/LayananList.jsx';
import LayananDetail from '../pages/public/LayananDetail.jsx';
import PengaduanInfo from '../pages/public/PengaduanInfo.jsx';
import Pelacakan from '../pages/public/Pelacakan.jsx';
import Kontak from '../pages/public/Kontak.jsx';
import Cari from '../pages/public/Cari.jsx';
import ProfilSubPage from '../pages/public/ProfilSubPage.jsx';
import Kegiatan from '../pages/public/Kegiatan.jsx';
import Dokumen from '../pages/public/Dokumen.jsx';
import NotFound from '../pages/public/NotFound.jsx';
import TugasLaporan from '../pages/public/TugasLaporan.jsx';

// Auth Pages
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Verifikasi from '../pages/auth/Verifikasi.jsx';

// Warga Pages
import Dashboard from '../pages/warga/Dashboard.jsx';
import PengaduanBaru from '../pages/warga/PengaduanBaru.jsx';
import PengaduanWarga from '../pages/warga/PengaduanWarga.jsx';
import SuratBaru from '../pages/warga/SuratBaru.jsx';
import SuratWarga from '../pages/warga/SuratWarga.jsx';
import Riwayat from '../pages/warga/Riwayat.jsx';
import Notifikasi from '../pages/warga/Notifikasi.jsx';
import WargaProfil from '../pages/warga/WargaProfil.jsx';

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
    </BrowserRouter>
  );
}
