import { Link, useParams } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { usePengumuman, useContentLoaded } from '../../services/contentStore.js';

export default function PengumumanDetail() {
  const { slug } = useParams();
  const list = usePengumuman();
  const loaded = useContentLoaded('pengumuman');
  const item = list.find((x) => x.slug === slug);

  if (!item && !loaded) {
    return (
      <div className="container py-5" role="status" aria-live="polite">
        <div className="panel-card p-5 text-center">
          <div className="spinner-border text-brand" />
          <p className="text-muted small mt-3 mb-0">Memuat pengumuman…</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-5">
        <div className="empty-state">
          <div className="service-icon mx-auto">
            <AppIcon name="exclamation-triangle" />
          </div>
          <h1 className="h2 mt-3">Pengumuman tidak ditemukan</h1>
          <p className="text-muted">
            Pengumuman yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link to="/pengumuman" className="btn btn-brand mt-3">
            Kembali ke Pengumuman
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = Array.isArray(item.content) ? item.content : [];

  return (
    <article className="container py-5 article-page panel-card">
      <Link to="/pengumuman" className="text-brand text-decoration-none">
        <AppIcon name="arrow-left" /> Kembali ke Pengumuman
      </Link>

      <small className="d-block text-brand fw-semibold mt-4">{item.date}</small>
      <h1 className="display-6 fw-bold mt-2">{item.title}</h1>
      <p className="lead text-muted">{item.summary}</p>
      {item.image && <img src={item.image} className="article-cover" alt={item.title} loading="lazy" />}
      {paragraphs.map((paragraph, i) => (
        <p className="fs-5" key={i}>{paragraph}</p>
      ))}
    </article>
  );
}
