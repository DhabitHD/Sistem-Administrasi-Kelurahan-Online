import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import { usePengumuman } from '../../services/contentStore.js';
import AnnouncementCard from '../content/AnnouncementCard.jsx';
import RevealOnScroll from '../common/RevealOnScroll.jsx';

export default function PengumumanPreview() {
  const pengumuman = usePengumuman();
  return (
    <section className="py-5 section-bg-img">
      <RevealOnScroll>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow text-brand">PENGUMUMAN</span>
            <h2 className="section-title">Informasi Penting</h2>
          </div>
          <Link to="/pengumuman" className="text-brand fw-semibold text-decoration-none">
            Lihat Semua <AppIcon name="arrow-right" />
          </Link>
        </div>

        <div className="row g-4">
          {/* Announcement list */}
          <div className="col-lg-8">
            {pengumuman.slice(0, 3).map((item) => (
              <AnnouncementCard key={item.slug} item={item} />
            ))}
          </div>

          {/* CTA card */}
          <div className="col-lg-4">
            <div className="callout-card">
              <AppIcon name="chat-square-text" size={26} className="text-brand" />
              <h3 className="h5 mt-3">Butuh bantuan?</h3>
              <p className="text-muted">
                Gunakan kanal pengaduan untuk menyampaikan laporan terkait
                layanan atau lingkungan.
              </p>
              <Link to="/pengaduan" className="btn btn-brand">
                Buat Pengaduan
              </Link>
            </div>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}
