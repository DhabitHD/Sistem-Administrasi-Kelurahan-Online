import AppIcon from '../../components/common/AppIcon.jsx';
import { useProfil } from '../../services/contentStore.js';
import { telHref } from '../../services/files.jsx';
const mapSrc =
  'https://www.google.com/maps?q=-7.8506564,112.0434437&hl=id&z=17&output=embed';

export default function Kontak() {
  const c = useProfil();
  const alamat = c?.kontak_alamat || 'Jl. Raya Betet Bawang 76, Kota Kediri, Jawa Timur';
  const telp = c?.kontak_telp || '(0354) 682955';
  const email = c?.kontak_email || 'diskominfo@kedirikota.go.id';
  const jam = c?.kontak_jam || 'Senin–Kamis 08.00–15.00 WIB · Jumat 07.00–14.00 WIB';
  return (
    <div className="container py-5">
      <div className="page-header">
        <span className="section-accent">KONTAK</span>
        <h1 className="mt-3">Hubungi Kelurahan Betet</h1>
        <p className="lead">Temukan alamat kantor, jam pelayanan, dan lokasi Kelurahan Betet di Kota Kediri.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="side-card h-100">
            <span className="eyebrow">INFORMASI KANTOR</span>
            <h2 className="h4 mt-2">Kantor Kelurahan Betet</h2>

            <div className="d-flex gap-3 py-3 border-bottom">
              <div className="doc-icon flex-shrink-0"><AppIcon name="geo-alt-fill" /></div>
              <div><strong className="d-block">Alamat</strong><span className="text-muted">{alamat}</span></div>
            </div>
            <div className="d-flex gap-3 py-3 border-bottom">
              <div className="doc-icon flex-shrink-0"><AppIcon name="telephone-fill" /></div>
              <div><strong className="d-block">Telepon</strong>{telHref(telp)
                ? <a href={telHref(telp)} className="text-brand text-decoration-none">{telp}</a>
                : <span className="text-muted">{telp}</span>}</div>
            </div>
            <div className="d-flex gap-3 py-3 border-bottom">
              <div className="doc-icon flex-shrink-0"><AppIcon name="envelope-fill" /></div>
              <div><strong className="d-block">Email</strong><a href={`mailto:${email}`} className="text-brand text-decoration-none">{email}</a></div>
            </div>
            <div className="d-flex gap-3 py-3">
              <div className="doc-icon flex-shrink-0"><AppIcon name="clock-fill" /></div>
              <div><strong className="d-block">Jam pelayanan</strong><span className="text-muted">{jam}</span></div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="contact-map-embed h-100">
            <iframe
              title="Lokasi Kantor Kelurahan Betet di Google Maps"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{minHeight:'460px'}}
            ></iframe>
          </div>
          <div className="d-flex justify-content-between align-items-center gap-3 mt-3 flex-wrap">
            <small className="text-muted">Peta terhubung ke Google Maps berdasarkan alamat kantor yang dipublikasikan.</small>
            <a className="btn btn-outline-brand" target="_blank" rel="noreferrer"
              href="https://www.google.com/maps?q=-7.8506564,112.0434437">
              Buka di Google Maps <AppIcon name="box-arrow-up-right" className="ms-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
