import { Link, useParams } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useBerita, useContentLoaded } from '../../services/contentStore.js';

export default function BeritaDetail() {
  const { slug } = useParams();
  const list = useBerita();
  const loaded = useContentLoaded('berita');
  const item = list.find((x) => x.slug === slug);

  /* Distinguish "the fetch has not landed yet" from "no such article" — the cache
     starts empty, so a direct hit on a shared link used to show the not-found
     screen first and then swap it for the article. */
  if (!item && !loaded) {
    return (
      <div className="container py-5" role="status" aria-live="polite">
        <div className="panel-card p-5 text-center">
          <div className="spinner-border text-brand" />
          <p className="text-muted small mt-3 mb-0">Memuat berita…</p>
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

  const paragraphs = Array.isArray(item.content) ? item.content : [];

  return (
    <article className="container py-5 article-page panel-card">
      <Link to="/berita" className="text-brand text-decoration-none">
        <AppIcon name="arrow-left" /> Kembali ke Berita
      </Link>

      <div className="mt-4">
        <small className="text-brand fw-semibold">
          {item.category} · {item.date}
        </small>
        <h1 className="display-5 fw-bold mt-2">{item.title}</h1>
        <p className="lead text-muted">{item.summary}</p>
        {item.image && <img src={item.image} className="article-cover" alt={item.title} loading="lazy" />}
        {paragraphs.map((paragraph, i) => (
          <p className="fs-5" key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
