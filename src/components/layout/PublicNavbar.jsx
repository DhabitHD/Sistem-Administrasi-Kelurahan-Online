import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import AppIcon from '../common/AppIcon.jsx';

export default function PublicNavbar() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const searchSubmit = (e) => {
    e.preventDefault();
    const q = search.trim();
    if (q) navigate(`/cari?q=${encodeURIComponent(q)}`);
  };

  const nav = (to, label) => (
    <NavLink
      end={to === '/'}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      to={to}
    >
      {label}
    </NavLink>
  );

  const navClass = [
    'navbar navbar-expand-lg public-nav',
    isHome
      ? `public-nav-transparent position-absolute top-0 start-0 w-100 ${scrolled ? 'nav-scrolled' : ''}`
      : 'public-nav-solid sticky-top w-100',
  ].join(' ');

  return (
    <nav className={navClass}>
      <div className="container-fluid px-3 px-lg-5">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-3 text-white">
          <span className="brand-mark">
            <img src="/assets/placeholders/logo-kelurahan.png" alt="Logo Kelurahan Betet" />
          </span>
          <span className="brand-copy">
            <strong>Kelurahan Betet</strong>
            <small>Kota Kediri</small>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#publicNav"
          aria-controls="publicNav"
          aria-expanded="false"
          aria-label="Buka navigasi"
        >
          <span className="navbar-toggler-icon navbar-toggler-icon-light"></span>
        </button>

        <div className="collapse navbar-collapse" id="publicNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2 py-3 py-lg-0">
            <form className="nav-search ms-lg-1" onSubmit={searchSubmit} role="search">
              <AppIcon name="search" size={16} />
              <input
                className="nav-search-input"
                placeholder="Cari konten…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari konten di seluruh situs"
              />
            </form>

            {nav('/', 'Beranda')}

            <div className="nav-item dropdown">
              <button className="nav-link dropdown-toggle bg-transparent border-0" data-bs-toggle="dropdown" type="button">
                Profil
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profil">Tentang Kelurahan</Link></li>
                <li><Link className="dropdown-item" to="/profil/sejarah">Sejarah</Link></li>
                <li><Link className="dropdown-item" to="/profil/visi-misi">Visi &amp; Misi</Link></li>
                <li><Link className="dropdown-item" to="/profil/struktur-organisasi">Struktur Organisasi</Link></li>
                <li><Link className="dropdown-item" to="/profil/demografi">Demografi</Link></li>
              </ul>
            </div>

            <div className="nav-item dropdown">
              <button className="nav-link dropdown-toggle bg-transparent border-0" data-bs-toggle="dropdown" type="button">
                Informasi
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/berita">Berita</Link></li>
                <li><Link className="dropdown-item" to="/pengumuman">Pengumuman</Link></li>
                <li><Link className="dropdown-item" to="/kegiatan">Kegiatan Kelurahan</Link></li>
                <li><Link className="dropdown-item" to="/dokumen">Dokumen Publik</Link></li>
              </ul>
            </div>

            {nav('/pemerintahan', 'Pemerintahan')}
            {nav('/layanan', 'Pelayanan')}
            {nav('/pengaduan', 'Pengaduan')}
            {nav('/pelacakan', 'Pelacakan')}
            {nav('/kontak', 'Kontak')}

            <Link
              to={isLoggedIn ? '/warga' : '/login'}
              className="btn btn-brand nav-login ms-lg-2 px-4"
            >
              <AppIcon name={isLoggedIn ? 'grid-1x2' : 'person-circle'} className="me-1" size={17} />
              {isLoggedIn ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
