import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import { useBerita } from '../../services/contentStore.js';
import NewsCard from '../content/NewsCard.jsx';
import RevealOnScroll from '../common/RevealOnScroll.jsx';

export default function BeritaPreview() {
  const berita = useBerita();
  return (
    <section className="py-5">
      <RevealOnScroll>
      <div className="container panel-card">
        <div className="section-head">
          <div>
            <span className="eyebrow text-brand">INFORMASI TERBARU</span>
            <h2 className="section-title">Berita Terbaru</h2>
          </div>
          <Link to="/berita" className="text-brand fw-semibold text-decoration-none">
            Lihat Semua <AppIcon name="arrow-right" />
          </Link>
        </div>

        <div className="row g-4">
          {berita.slice(0, 3).map((item) => (
            <div className="col-md-4" key={item.slug}>
              <NewsCard item={item} />
            </div>
          ))}
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}
