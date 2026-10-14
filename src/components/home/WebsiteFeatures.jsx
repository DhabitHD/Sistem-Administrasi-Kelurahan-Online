import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import RevealOnScroll from '../common/RevealOnScroll.jsx';
import { useVideo } from '../../services/contentStore.js';
import { safeUrl } from '../../services/files.jsx';

const docs = [
  ['file-earmark-text', 'Profil Kelurahan Betet', 'Dokumen profil untuk mengenal wilayah dan layanan kelurahan.'],
  ['map', 'Potensi Kelurahan Betet', 'Informasi potensi wilayah, masyarakat, dan lingkungan.'],
  ['people', 'Kelompok Informasi Masyarakat', 'Ruang informasi dan komunikasi warga.'],
];

export default function WebsiteFeatures() {
  const videos = useVideo();
  const list = Array.isArray(videos) ? videos : [];
  const [picker, setPicker] = useState(false);
  const play = (v) => {
    setPicker(false);
    /* v.video is admin-entered free text. window.open('javascript:...') would run in
       our own origin, so refuse anything that is not plain http(s). */
    const href = safeUrl(v?.video);
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  };
  return (
    <>
      <section className="py-5">
        <div className="container">
          <RevealOnScroll>
            <div className="section-head">
              <div>
                <span className="section-accent">Eksplorasi Website</span>
                <h2 className="section-title mt-3">Informasi kelurahan lebih lengkap</h2>
                <p className="text-muted mb-0">Navigasi dan konten dibuat lebih dekat dengan struktur website Kelurahan Betet saat ini.</p>
              </div>
              <Link to="/profil" className="text-brand fw-semibold text-decoration-none">Lihat Profil <AppIcon name="arrow-right" /></Link>
            </div>
          </RevealOnScroll>

          <div className="row g-4 feature-grid">
            <div className="col-lg-5">
              <RevealOnScroll className="h-100">
                <div className="feature-card h-100 p-0 overflow-hidden">
                  <img src="/assets/placeholders/struktur-pemerintahan.jpg" alt="Ilustrasi struktur pemerintahan" className="w-100" loading="lazy" decoding="async" style={{height:'220px',objectFit:'cover'}} />
                  <div className="p-4">
                    <span className="eyebrow">PEMERINTAHAN</span>
                    <h3 className="h4 mt-2">Struktur organisasi yang mudah dipahami</h3>
                    <p className="text-muted">Lihat susunan perangkat kelurahan dan informasi jabatan secara lebih terstruktur.</p>
                    <Link to="/profil/struktur-organisasi" className="btn btn-outline-brand">Buka Struktur Organisasi</Link>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
            <div className="col-lg-7">
              <div className="row g-4 h-100">
                {docs.map(([icon,title,desc], i) => (
                  <div className={i === 2 ? 'col-md-12' : 'col-md-6'} key={title}>
                    <RevealOnScroll className="h-100">
                      <div className="feature-card h-100">
                        <div className="doc-icon mb-3"><AppIcon name={icon} size={20} /></div>
                        <h3 className="h5">{title}</h3>
                        <p className="small text-muted">{desc}</p>
                        <Link to="/dokumen" className="small fw-semibold text-brand text-decoration-none">Lihat dokumen <AppIcon name="arrow-right" /></Link>
                      </div>
                    </RevealOnScroll>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="video-profile-section text-white">
        <div className="container position-relative z-1">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <RevealOnScroll>
                <span className="section-accent" style={{background:'rgba(255,255,255,.14)',color:'#fff'}}>Video Profile</span>
                <h2 className="display-6 fw-bold mt-3">Kenali Kelurahan Betet lebih dekat</h2>
                <p className="lead mb-0">Putar video profil kelurahan untuk mengenal suasana dan layanan Kelurahan Betet.</p>
              </RevealOnScroll>
            </div>
            <div className="col-lg-4 text-lg-end">
              <RevealOnScroll>
                <div className="position-relative d-inline-block">
                  <button className="btn btn-white btn-lg px-4" type="button" onClick={() => setPicker((v) => !v)}>
                    Tonton Video Profil
                  </button>
                  {picker && (
                    <>
                      <div
                        className="video-picker-backdrop"
                        onClick={() => setPicker(false)}
                        aria-hidden="true"
                      ></div>
                      <div className="video-picker" role="menu" aria-label="Pilih video">
                        <div className="video-picker-label">Pilih video untuk ditonton</div>
                        {list.length === 0 && <div className="video-picker-empty">Belum ada video.</div>}
                        {list.map((v) => (
                          <button
                            key={v.slug}
                            type="button"
                            role="menuitem"
                            className="video-picker-item"
                            onClick={() => play(v)}
                          >
                            <AppIcon name="play" size={15} className="me-2" />
                            {v.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
