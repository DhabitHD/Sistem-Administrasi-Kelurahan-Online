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
          <span className="eyebrow text-brand">ARAH PEMBANGUNAN</span>
          <h2 className="section-title">Visi &amp; Misi</h2>
        </div>

        <div className="vm-layout mx-auto mt-4" style={{ maxWidth: 900 }}>
          <div className="vm-row" style={{ paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-border)' }}>
            <span className="vm-label">VISI</span>
            <p className="mb-0">
              {visi}
            </p>
          </div>

          <div className="vm-row mt-4">
            <span className="vm-label">MISI</span>
            <ol className="vm-misi mb-0">
              {misi.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      </RevealOnScroll>
    </section>
  );
}