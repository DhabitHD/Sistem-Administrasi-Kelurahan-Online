import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';

export default function AnnouncementCard({ item }) {
  return (
    <Link
      to={`/pengumuman/${item.slug}`}
      className="announcement-row text-decoration-none"
    >
      <div className="announce-icon">
        <AppIcon name="megaphone" />
      </div>
      <div>
        <div className="fw-semibold text-dark">{item.title}</div>
        <small className="text-muted">{item.date}</small>
        <div className="small text-muted mt-1">{item.summary}</div>
      </div>
      <AppIcon name="arrow-right" className="ms-auto text-brand" />
    </Link>
  );
}
