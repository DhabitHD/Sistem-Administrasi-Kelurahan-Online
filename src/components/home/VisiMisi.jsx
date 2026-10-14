import RevealOnScroll from '../common/RevealOnScroll.jsx';
import { useProfil } from '../../services/contentStore.js';

const defaultVisi =
  'Mewujudkan Kelurahan Betet yang maju, mandiri, tertib, dan sejahtera dengan pelayanan publik yang mudah diakses serta partisipasi masyarakat yang kuat.';
const defaultMisi = [
  'Meningkatkan kualitas pelayanan publik.',
  'Memperkuat keterbukaan informasi.',
  'Mendorong pemberdayaan masyarakat.',
  'Menjaga lingkungan yang aman, bersih, dan nyaman.',
  'Mengembangkan potensi wilayah dan kolaborasi warga.',
];

export default function VisiMisi() {
  const profil = useProfil();
  const visi = profil?.visi || defaultVisi;
  const misi = Array.isArray(profil?.misi) && profil.misi.length ? profil.misi : defaultMisi;
  return (
    <section className="py-5">
      <RevealOnScroll>
      <div className="container panel-card">
        <div className="section-head mx-auto text-center" style={{ maxWidth: 640 }}>
          <h2 className="section-title mb-0">Visi &amp; Misi</h2>
        </div>

        <div className="row g-4 mt-1 align-items-stretch">
          {/* VISI — 1 bagian, kartu sorot indigo lembut */}
          <div className="col-lg-3">
            <div className="vm-card vm-visi-card h-100">
              <span className="vm-label">VISI</span>
              <p className="vm-visi-text mb-0">{visi}</p>
            </div>
          </div>

          {/* MISI — 3 bagian, daftar bernomor grid 2 kolom */}
          <div className="col-lg-9">
            <div className="vm-card vm-misi-card h-100">
              <span className="vm-label">MISI</span>
              <ol className="vm-misi-grid mb-0">
                {misi.map((m, i) => (
                  <li key={i}>
                    <span className="vm-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="vm-misi-text">{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}