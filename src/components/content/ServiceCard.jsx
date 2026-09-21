import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import LottieIcon from '../common/LottieIcon.jsx';

export default function ServiceCard({ item }) {
  return (
    <article className="service-card h-100">
      <div className="service-icon">
        <LottieIcon
          src={`/assets/icons/layanan/${item.slug}.json`}
          size={46}
          fallback={<AppIcon name={item.icon} size={24} strokeWidth={1.75} />}
        />
      </div>
      <h3 className="h5 mt-3">{item.name}</h3>
      <p className="text-muted small mb-4">{item.short}</p>
      <Link
        to={`/layanan/${item.slug}`}
        className="stretched-link text-brand text-decoration-none"
      >
        Lihat Detail <AppIcon name="arrow-right" className="ms-1" />
      </Link>
    </article>
  );
}