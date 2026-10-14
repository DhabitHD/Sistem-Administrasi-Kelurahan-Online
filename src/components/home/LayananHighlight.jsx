import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import ServiceCard from '../content/ServiceCard.jsx';
import RevealOnScroll from '../common/RevealOnScroll.jsx';
import { useLayanan } from '../../services/contentStore.js';

export default function LayananHighlight() {
  const layanan = useLayanan();
  return (
    <section className="py-5">
      <RevealOnScroll>
      <div className="container">
        {/* Section header */}
        <div className="section-head">
          <div>
            <span className="eyebrow text-brand">LAYANAN KAMI</span>
            <h2 className="section-title">Layanan Unggulan</h2>
            <p className="text-muted mb-0">
              Akses layanan administrasi kelurahan dengan informasi yang jelas dan
              mudah dipahami.
            </p>
          </div>
          <Link to="/layanan" className="text-brand text-decoration-none fw-semibold">
            Lihat Semua Layanan <AppIcon name="arrow-right" />
          </Link>
        </div>

        {/* Kontainer dua kolom: gambar kiri, daftar layanan kanan */}
        <div className="row g-4 mt-1 align-items-stretch">
          <div className="col-lg-5">
            <figure className="layanan-figure mb-0">
              <img
                src="/assets/placeholders/Mobil-kelurahan.jpeg"
                alt="Mobil layanan Kelurahan Betet"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="layanan-figure-caption">
                <strong>Layanan mobil kelurahan</strong>
                <span>Administrasi jemput bola ke lingkungan Anda</span>
              </figcaption>
            </figure>
          </div>
          <div className="col-lg-7">
            <div className="row g-4">
              {layanan.slice(0, 4).map((item) => (
                <div className="col-sm-6" key={item.slug}>
                  <ServiceCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}
