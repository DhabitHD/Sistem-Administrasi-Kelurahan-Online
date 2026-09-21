import RevealOnScroll from '../common/RevealOnScroll.jsx';
import { useProfil } from '../../services/contentStore.js';

export default function SambutanLurah() {
  const profil = useProfil();
  const photo = profil?.foto_lurah || '/assets/placeholders/foto-lurah.jpg';
  const name = profil?.nama_lurah || 'Zainudin Budi Wibowo, S.E';
  const paras = (Array.isArray(profil?.sambutan) && profil.sambutan.length)
    ? profil.sambutan
    : [
        'Website ini menjadi salah satu media informasi dan pelayanan publik untuk membantu warga mendapatkan informasi dengan lebih cepat dan mudah.',
        'Kami mengajak seluruh warga untuk memanfaatkan kanal digital ini — mulai dari informasi kegiatan, pengaduan, hingga pengajuan surat.',
      ];
  return (
    <section className="py-5 section-bg-img">
      <RevealOnScroll>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Photo */}
          <div className="col-lg-5">
            <img
              src={photo}
              className="img-fluid rounded-3 shadow-sm"
              alt="Foto Lurah Betet"
              style={{ maxHeight: 460, objectFit: 'cover', width: '100%' }}
            />
          </div>

          {/* Content */}
          <div className="col-lg-7">
            <span className="eyebrow text-brand">SAMBUTAN KEPALA KELURAHAN</span>
            <h2 className="section-title">
              Selamat datang di website Kelurahan Betet
            </h2>
            <p>
              {paras[0]}
            </p>
            <p className="mb-1">
              {paras.slice(1).join(' ')}
            </p>
            <p className="mb-1 fw-bold">{name}</p>
            <small className="text-muted">Lurah Betet</small>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}
