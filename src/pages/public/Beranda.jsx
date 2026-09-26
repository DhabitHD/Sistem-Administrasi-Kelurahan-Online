import HeroSection from '../../components/home/HeroSection.jsx';
import LayananHighlight from '../../components/home/LayananHighlight.jsx';
import SambutanLurah from '../../components/home/SambutanLurah.jsx';
import VisiMisi from '../../components/home/VisiMisi.jsx';
import BeritaPreview from '../../components/home/BeritaPreview.jsx';
import PengumumanPreview from '../../components/home/PengumumanPreview.jsx';
import WebsiteFeatures from '../../components/home/WebsiteFeatures.jsx';
import KegiatanPreview from '../../components/home/KegiatanPreview.jsx';
import VideoPreview from '../../components/home/VideoPreview.jsx';
import ComplaintHighlight from '../../components/home/ComplaintHighlight.jsx';
import { useProfil } from '../../services/contentStore.js';

export default function Beranda() {
  const c = useProfil();
  const alamat = c?.kontak_alamat || 'Jl. Raya Betet Bawang 76, Kota Kediri';
  const telp = c?.kontak_telp || '(0354) 682955';
  const jam = c?.kontak_jam || 'Senin–Kamis 08.00–15.00 WIB · Jumat 07.00–14.00 WIB';
  return (
    <>
      <HeroSection />
      <LayananHighlight />
      <ComplaintHighlight />
      <SambutanLurah />
      <VisiMisi />
      <BeritaPreview />
      <PengumumanPreview />
      <KegiatanPreview />
      <VideoPreview />
      <WebsiteFeatures />

      {/* ── Ringkasan Pelayanan & Kontak ── */}
      <section className="py-5 home-service-summary">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="info-strip">
                <span className="eyebrow text-brand">RINGKASAN PELAYANAN</span>
                <h2 className="h4 mt-2">Pelayanan langsung &amp; digital</h2>
                <p className="text-muted mb-0">
                  Layanan administrasi dilayani langsung di kantor kelurahan pada jam
                  kerja. Warga terdaftar dapat mengajukan surat secara online melalui
                  portal warga.
                </p>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="contact-mini">
                <div>
                  <span className="eyebrow text-brand">KONTAK KELURAHAN</span>
                  <h2 className="h4 mt-2">Mudah dihubungi</h2>
                  <p className="mb-1">{alamat}</p>
                  <p className="mb-0 text-muted">
                    {telp} · {jam}
                  </p>
                </div>
                <a href={`tel:+${telp.replace(/\D/g, '')}`} className="btn btn-brand">
                  Hubungi
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
