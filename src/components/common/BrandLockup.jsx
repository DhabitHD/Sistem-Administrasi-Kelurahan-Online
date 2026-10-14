/**
 * Blok brand logo yang dipakai navbar & footer — satu sumber kebenaran
 * supaya tampilan logo tidak pernah beda antar keduanya:
 *   Logo Kota Kediri (brand-mark) + teks (brand-copy) + logo Kediri Mapan
 *   di atas chip putih (brand-mapan-chip) agar logo teal tetap terbaca jelas.
 */
export default function BrandLockup({ className = '' }) {
  return (
    <span className={`brand-lockup d-flex align-items-center gap-3 ${className}`}>
      <span className="brand-mark">
        <img src="/assets/placeholders/Logo-Kediri.png" alt="Logo Kota Kediri" />
      </span>
      <span className="brand-copy">
        <strong>Kelurahan Betet</strong>
        <small>Kota Kediri</small>
      </span>
      <span className="brand-mapan-chip">
        <img src="/assets/placeholders/Kediri-Mapan.png" alt="Logo Kediri Mapan" />
      </span>
    </span>
  );
}
