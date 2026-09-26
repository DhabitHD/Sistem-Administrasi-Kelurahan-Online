import { Link } from 'react-router-dom';
import AppIcon from '../common/AppIcon.jsx';
import WaveDivider from '../common/WaveDivider.jsx';

const socialIcons = {
  instagram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5"></rect>
      <circle cx="12" cy="12" r="4"></circle>
      <circle cx="17.5" cy="6.5" r="1"></circle>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z"/>
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z"></path>
      <path d="m10 15 5-3-5-3z"></path>
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.47 0-2.92-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.98-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/>
    </svg>
  ),
};

const quickLinks = [
  ['/', 'Beranda'],
  ['/profil', 'Profil Kelurahan'],
  ['/pemerintahan', 'Pemerintahan'],
  ['/layanan', 'Pelayanan'],
  ['/berita', 'Berita'],
  ['/pengumuman', 'Pengumuman'],
  ['/pengaduan', 'Pengaduan'],
  ['/pelacakan', 'Pelacakan'],
  ['/kontak', 'Kontak'],
];

const externalLinks = [
  ['https://www.kedirikota.go.id/', 'Pemkot Kediri'],
  ['https://www.lapor.go.id/', 'SP4N-LAPOR!'],
  ['https://lapormbakwali.kedirikota.go.id/', 'Kediri 112'],
];

const mapSrc =
  'https://www.google.com/maps?q=-7.8506564,112.0434437&hl=id&z=17&output=embed';

export default function PublicFooter() {
  return (
    <footer className="site-footer">
      <WaveDivider className="wave-top footer-wave" fill="#2563EB" flip />
      <div className="footer-main">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="footer-brand d-flex align-items-center gap-3 mb-4">
                <img src="/assets/placeholders/logo-kelurahan.png" alt="Logo Kelurahan Betet" />
                <div>
                  <strong>Kelurahan Betet</strong>
                  <small>Kota Kediri</small>
                </div>
              </div>

              <p className="footer-desc mb-4">
                Portal informasi dan pelayanan publik Kelurahan Betet untuk membantu
                warga mendapatkan informasi, layanan, dan kanal pengaduan secara lebih
                mudah.
              </p>

              <div className="footer-collab">
                <div className="collab-label">Kolaborasi &amp; Mitra</div>
                <div className="collab-lockup">
                  <div className="partner">
                    <img className="collab-logo-betet" src="/assets/placeholders/logo-kelurahan.png" alt="Kelurahan Betet" />
                    <span className="small fw-semibold">Kelurahan Betet<br />Kota Kediri</span>
                  </div>
                  <span className="collab-x" aria-hidden="true">×</span>
                  <div className="partner">
                    <img
                      className="collab-unesa-mark collab-unesa-image"
                      src="/assets/placeholders/logo-unesa.png"
                      alt="Logo Universitas Negeri Surabaya (UNESA)"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span className="small fw-semibold">Universitas Negeri<br />Surabaya</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-2">
              <h3>Sitemap</h3>
              {quickLinks.map(([url, label]) => (
                <Link key={url} to={url} className="footer-link">{label}</Link>
              ))}
            </div>

            <div className="col-6 col-lg-2">
              <h3>External Links</h3>
              {externalLinks.map(([url, label]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="footer-link">
                  {label} <AppIcon name="box-arrow-up-right" className="ms-1 small" />
                </a>
              ))}
              <div className="mt-4 small text-white-50">
                Layanan kedaruratan kota dapat diakses melalui kanal resmi pemerintah.
              </div>
            </div>

            <div className="col-lg-4">
              <div className="footer-map-title">
                <AppIcon name="geo-alt-fill" className="text-brand" />
                <span>Lokasi Kantor</span>
              </div>
              <div className="footer-map-embed">
                <iframe
                  title="Peta lokasi Kantor Kelurahan Betet"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div className="footer-contact mt-3">
                <p><AppIcon name="geo-alt" /><span>Jl. Raya Betet Bawang 76, Kota Kediri, Jawa Timur</span></p>
                <p><AppIcon name="envelope" /><span>diskominfo@kedirikota.go.id</span></p>
                <p><AppIcon name="telephone" /><span>(0354) 682955</span></p>
                <p><AppIcon name="clock" /><span>Senin–Kamis 08.00–15.00 WIB · Jumat 07.00–14.00 WIB</span></p>
              </div>
              <div className="footer-socials" aria-label="Media sosial">
                <a href="https://www.instagram.com/KelurahanBetet" target="_blank" rel="noreferrer" aria-label="Instagram">{socialIcons.instagram}</a>
                <a href="https://x.com/KelurahanBetet" target="_blank" rel="noreferrer" aria-label="Twitter / X">{socialIcons.x}</a>
                <a href="https://www.youtube.com/@KelurahanBetet" target="_blank" rel="noreferrer" aria-label="YouTube">{socialIcons.youtube}</a>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" aria-label="WhatsApp">{socialIcons.whatsapp}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container d-flex flex-column flex-md-row justify-content-between gap-2">
          <small>© 2026 Kelurahan Betet, Kota Kediri. Seluruh hak dilindungi.</small>
          <small>Portal informasi publik · Dibangun untuk kebutuhan informasi dan pelayanan warga.</small>
        </div>
      </div>
    </footer>
  );
}
