import { Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';

const profileLinks = [
  ['/profil/sejarah', 'Sejarah', 'Cerita asal-usul Kelurahan Betet dan sejarah lokal wilayah.'],
  ['/profil/visi-misi', 'Visi & Misi', 'Arah pelayanan dan pembangunan kelurahan.'],
  ['/profil/struktur-organisasi', 'Struktur Organisasi', 'Susunan perangkat dan jabatan pemerintahan kelurahan.'],
  ['/profil/demografi', 'Demografi', 'Gambaran geografis dan data wilayah.'],
];

export default function Profil() {
  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">PROFIL KELURAHAN</span>
        <h1 className="mt-3">Mengenal Kelurahan Betet</h1>
        <p className="lead">Portal profil, sejarah, pemerintahan, dan informasi wilayah Kelurahan Betet, Kecamatan Pesantren, Kota Kediri.</p>
      </div>

      <div className="row g-5 align-items-start">
        <div className="col-lg-7">
          <img src="/assets/placeholders/struktur-pemerintahan.jpg" className="img-fluid rounded-4 mb-4 w-100" alt="Ilustrasi Kelurahan Betet" style={{maxHeight:420,objectFit:'cover'}} />
          <span className="eyebrow">TENTANG KELURAHAN</span>
          <h2 className="h2 mt-2">Informasi publik dalam satu tempat</h2>
          <p className="lh-lg">Kelurahan Betet berada di Kecamatan Pesantren, Kota Kediri, Jawa Timur. Website ini menggabungkan informasi publik, berita, pengumuman, pelayanan, dan kanal komunikasi agar warga lebih mudah memperoleh informasi.</p>
          <div className="row g-3 mt-3">
            <div className="col-sm-6"><div className="simple-box"><small className="text-muted d-block">Kecamatan</small><strong>Pesantren</strong></div></div>
            <div className="col-sm-6"><div className="simple-box"><small className="text-muted d-block">Kota</small><strong>Kediri, Jawa Timur</strong></div></div>
            <div className="col-sm-6"><div className="simple-box"><small className="text-muted d-block">Alamat kantor</small><strong>Jl. Raya Betet Bawang 76</strong></div></div>
            <div className="col-sm-6"><div className="simple-box"><small className="text-muted d-block">Telepon</small><strong>(0354) 682955</strong></div></div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="side-card">
            <span className="eyebrow">JELAJAHI PROFIL</span>
            <h2 className="h4 mt-2">Informasi utama</h2>
            <div className="list-group list-group-flush mt-3">
              {profileLinks.map(([to, title, desc]) => (
                <Link key={to} to={to} className="list-group-item list-group-item-action px-0 py-3 border-0">
                  <div className="d-flex gap-3">
                    <div className="doc-icon flex-shrink-0"><AppIcon name="arrow-up-right" /></div>
                    <div><strong className="d-block">{title}</strong><small className="text-muted">{desc}</small></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="side-card mt-4">
            <h3 className="h5">Pemerintahan</h3>
            <p className="text-muted">Lihat perangkat dan struktur organisasi Kelurahan Betet.</p>
            <Link to="/pemerintahan" className="btn btn-outline-brand">Buka Pemerintahan</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
