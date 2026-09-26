import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import { useBerita } from '../../services/contentStore.js';
import RevealOnScroll from '../common/RevealOnScroll.jsx';

export default function KegiatanPreview() {
  const items = useBerita().filter((x) => ['Lingkungan','Kegiatan','Pemberdayaan'].includes(x.category)).slice(0, 3);
  return (
    <section className="py-5">
      <div className="container panel-card">
        <RevealOnScroll>
          <div className="section-head">
            <div>
              <span className="section-accent">KEGIATAN</span>
              <h2 className="section-title mt-3">Ikuti kegiatan Kelurahan Betet</h2>
            </div>
            <Link to="/kegiatan" className="text-brand fw-semibold text-decoration-none">Lihat semua kegiatan <AppIcon name="arrow-right" /></Link>
          </div>
        </RevealOnScroll>
        <div className="row g-4">
          {items.map((item, i) => (
            <div className="col-md-4" key={item.slug}>
              <RevealOnScroll className={`delay-${i + 1}`}>
                <article className="card border-0 h-100">
                  <img src={item.image} className="news-thumb w-100" alt="" />
                  <div className="card-body p-4">
                    <span className="eyebrow">{item.category}</span>
                    <h3 className="h5 mt-2">{item.title}</h3>
                    <p className="text-muted small mb-3">{item.date}</p>
                    <p className="small text-muted mb-0">{item.summary}</p>
                  </div>
                </article>
              </RevealOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
