import { Link, useParams } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useBerita } from '../../services/contentStore.js';

export default function BeritaDetail() {
  const { slug } = useParams();
  const item = useBerita().find((x) => x.slug === slug);

  if (!item) {
    return (
      <div className="container py-5">
        <div className="empty-state">
          <div className="service-icon mx-auto">
            <AppIcon name="exclamation-triangle" />
          </div>
          <h1 className="h2 mt-3">Berita tidak ditemukan</h1>
          <p className="text-muted">
            Artikel yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link to="/berita" className="btn btn-brand mt-3">
            Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container py-5 article-page">
      <Link to="/berita" className="text-brand text-decoration-none">
        <AppIcon name="arrow-left" /> Kembali ke Berita
      </Link>

      <div className="mt-4">
        <small className="text-brand fw-semibold">
          {item.category} · {item.date}
        </small>
        <h1 className="display-5 fw-bold mt-2">{item.title}</h1>
        <p className="lead text-muted">{item.summary}</p>
        <img src={item.image} className="article-cover" alt={item.title} />
        {item.content.map((paragraph, i) => (
          <p className="fs-5" key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
