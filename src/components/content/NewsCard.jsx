import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';

export default function NewsCard({ item }) {
  return (
    <article className="card border-0 shadow-sm h-100 overflow-hidden">
      <img src={item.image} className="card-img-top news-thumb" alt={item.title} loading="lazy" decoding="async" />
      <div className="card-body p-4">
        <small className="text-brand fw-semibold">
          {item.category} · {item.date}
        </small>
        <h3 className="h5 mt-2">{item.title}</h3>
        <p className="text-muted small">{item.summary}</p>
        <Link to={`/berita/${item.slug}`} className="text-brand text-decoration-none">
          Baca selengkapnya <AppIcon name="arrow-right" />
        </Link>
      </div>
    </article>
  );
}
