import { useVideo } from '../../services/contentStore.js';
import { isYoutube, embedFromUrl } from '../../services/video.js';
import RevealOnScroll from '../common/RevealOnScroll.jsx';

export default function VideoPreview() {
  const videos = useVideo();

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-5">
      <RevealOnScroll>
      <div className="container panel-card">
        <div className="text-center mx-auto" style={{ maxWidth: 640, marginBottom: '2.5rem' }}>
          <span className="eyebrow text-brand">MULTIMEDIA</span>
          <h2 className="section-title mt-2">Video Kegiatan Kelurahan</h2>
          <p className="text-muted mb-0">Dokumentasi kegiatan dan informasi kelurahan dalam bentuk video.</p>
        </div>

        <div className="row g-4 mt-1">
          {videos.map((v) => (
            <div className="col-md-6 col-lg-6" key={v.slug}>
              <div className="dashboard-card p-3 h-100">
                {isYoutube(v.video) ? (
                  <iframe
                    title={v.title}
                    src={embedFromUrl(v.video)}
                    className="w-100 rounded"
                    style={{ aspectRatio: '16 / 9' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                ) : (
                  <video src={v.video} controls className="w-100 rounded" style={{ aspectRatio: '16 / 9' }}></video>
                )}
                <h3 className="h5 mt-3 mb-1">{v.title}</h3>
                {v.desc && <p className="text-muted small mb-0">{v.desc}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}