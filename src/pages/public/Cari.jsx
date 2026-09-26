import { useSearchParams, Link } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon.jsx';
import { useBerita, usePengumuman, useLayanan, useDokumen, usePerangkat, useVideo } from '../../services/contentStore.js';
import NewsCard from '../../components/content/NewsCard.jsx';
import AnnouncementCard from '../../components/content/AnnouncementCard.jsx';
import ServiceCard from '../../components/content/ServiceCard.jsx';

const match = (text, q) => (text || '').toLowerCase().includes(q);

export default function Cari() {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const query = q.toLowerCase();

  const allBerita = useBerita();
  const allPengumuman = usePengumuman();
  const allLayanan = useLayanan();
  const allDokumen = useDokumen();
  const allPerangkat = usePerangkat();
  const allVideo = useVideo();
  const berita = query ? allBerita.filter((b) => match(`${b.title} ${b.summary} ${b.category}`, query)) : [];
  const pengumuman = query ? allPengumuman.filter((p) => match(`${p.title} ${p.summary}`, query)) : [];
  const layanan = query ? allLayanan.filter((l) => match(`${l.name} ${l.short}`, query)) : [];
  const dokumen = query ? allDokumen.filter((d) => match(`${d.title} ${d.desc} ${d.category}`, query)) : [];
  const perangkat = query ? allPerangkat.filter((p) => match(`${p.name} ${p.role}`, query)) : [];
  const video = query ? allVideo.filter((v) => match(`${v.title} ${v.desc}`, query)) : [];
  const total = berita.length + pengumuman.length + layanan.length + dokumen.length + perangkat.length + video.length;

  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="eyebrow text-brand">PENCARIAN</span>
        <h1>Hasil pencarian</h1>
        <p className="lead">Menampilkan hasil untuk {q ? <>“<strong>{q}</strong>”</> : 'semua konten'}.</p>
        {/* Client-side navigation, not a native GET form. <form action="/cari">
           reloaded the whole document, discarding the content cache and
           re-running every /api request on each search. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const next = new FormData(e.currentTarget).get('q') || '';
            setParams(next.trim() ? { q: next.trim() } : {}, { replace: true });
          }}
          className="d-flex gap-2 flex-column flex-sm-row mt-3"
          style={{ maxWidth: 560 }}
        >
          {/* key={q}: the input is uncontrolled, so Back/Forward between two
              /cari?q= values left the old text in the box while the results
              showed the new query. Remounting on q change keeps them in sync. */}
          <input key={q} name="q" defaultValue={q} className="form-control form-control-lg" placeholder="Cari di seluruh situs…" aria-label="Cari di seluruh situs" />
          <button className="btn btn-brand btn-lg flex-shrink-0" type="submit">
            Cari <AppIcon name="search" className="ms-1" />
          </button>
        </form>
      </div>

      {total === 0 && q ? (
        <div className="empty-state" aria-live="polite">
          <div className="service-icon mx-auto"><AppIcon name="search" size={26} /></div>
          <h2 className="h5 mt-3">Tidak ada hasil</h2>
          <p className="text-muted mb-0">Coba kata kunci lain atau telusuri menu di atas.</p>
        </div>
      ) : total === 0 ? (
        <div className="empty-state">
          <div className="service-icon mx-auto"><AppIcon name="search" size={26} /></div>
          <h2 className="h5 mt-3">Ketik kata kunci</h2>
          <p className="text-muted mb-0">Cari berita, pengumuman, atau layanan kelurahan.</p>
          <Link to="/" className="btn btn-outline-brand mt-3">Kembali ke Beranda</Link>
        </div>
      ) : (
        <>
          {pengumuman.length > 0 && (
            <section className="mb-5">
              <h2 className="h4 mb-3">Pengumuman <small className="text-muted">({pengumuman.length})</small></h2>
              <div className="col-lg-8 ps-0">
                {pengumuman.map((item) => <AnnouncementCard item={item} key={item.slug} />)}
              </div>
            </section>
          )}

          {berita.length > 0 && (
            <section className="mb-5">
              <h2 className="h4 mb-3">Berita <small className="text-muted">({berita.length})</small></h2>
              <div className="row g-4">
                {berita.map((item) => (
                  <div className="col-md-6 col-lg-4" key={item.slug}><NewsCard item={item} /></div>
                ))}
              </div>
            </section>
          )}

          {layanan.length > 0 && (
            <section className="mb-5">
              <h2 className="h4 mb-3">Layanan <small className="text-muted">({layanan.length})</small></h2>
              <div className="row g-4">
                {layanan.map((item) => (
                  <div className="col-sm-6 col-lg-3" key={item.slug}><ServiceCard item={item} /></div>
                ))}
              </div>
            </section>
          )}

          {dokumen.length > 0 && (
            <section className="mb-5">
              <h2 className="h4 mb-3">Dokumen / Informasi Publik <small className="text-muted">({dokumen.length})</small></h2>
              <div className="col-lg-8 ps-0">
                {dokumen.map((d) => (
                  <Link to="/dokumen" key={d.slug} className="d-block text-decoration-none mb-3">
                    <div className="side-card py-3">
                      <div className="d-flex gap-3 align-items-start">
                        <div className="doc-icon flex-shrink-0"><AppIcon name={d.icon || 'file-earmark-text'} size={16} /></div>
                        <div>
                          <strong className="text-brand d-block">{d.title}</strong>
                          <small className="text-muted">{d.desc}</small>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {perangkat.length > 0 && (
            <section className="mb-5">
              <h2 className="h4 mb-3">Perangkat Kelurahan <small className="text-muted">({perangkat.length})</small></h2>
              <div className="col-lg-8 ps-0">
                {perangkat.map((p) => (
                  <Link to="/pemerintahan" key={p.slug} className="d-block text-decoration-none mb-2">
                    <div className="side-card py-3">
                      <small className="text-brand fw-semibold d-block">{p.role}</small>
                      <strong className="d-block">{p.name}</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {video.length > 0 && (
            <section>
              <h2 className="h4 mb-3">Video <small className="text-muted">({video.length})</small></h2>
              <div className="col-lg-8 ps-0">
                {video.map((v) => (
                  <div className="side-card py-3 mb-2" key={v.slug}>
                    <div className="d-flex gap-3 align-items-center">
                      <div className="doc-icon flex-shrink-0"><AppIcon name="play" size={16} /></div>
                      <div>
                        <strong className="d-block">{v.title}</strong>
                        {v.desc && <small className="text-muted">{v.desc}</small>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}