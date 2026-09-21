import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import RevealOnScroll from '../common/RevealOnScroll.jsx';

export default function ComplaintHighlight() {
  return (
    <section className="py-5 bg-blue-pattern">
      <div className="container position-relative z-1">
        <RevealOnScroll>
          <div className="complaint-banner">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <span className="eyebrow">KANAL PENGADUAN</span>
                <h2 className="h2 mt-2 mb-0 fw-bold">Ada kendala atau masalah di lingkungan?</h2>
                <p className="mb-0 mt-2">
                  Sampaikan laporan dengan alur yang jelas. Setelah login, warga dapat
                  menggunakan kanal pengaduan yang disiapkan untuk layanan digital.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/pengaduan" className="btn btn-white btn-lg px-4">
                  Pelajari Pengaduan <AppIcon name="arrow-up-right" className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
