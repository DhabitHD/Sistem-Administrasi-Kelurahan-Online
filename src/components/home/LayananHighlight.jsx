import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import ServiceCard from '../content/ServiceCard.jsx';
import RevealOnScroll from '../common/RevealOnScroll.jsx';
import { useLayanan } from '../../services/contentStore.js';

export default function LayananHighlight() {
  const layanan = useLayanan();
  return (
    <section className="py-5 bg-pattern">
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

        {/* Cards */}
        <div className="row g-4 mt-1">
          {layanan.map((item) => (
            <div className="col-sm-6 col-lg-3" key={item.slug}>
              <ServiceCard item={item} />
            </div>
          ))}
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}
