import { useEffect, useState } from 'react';
import AppIcon from './AppIcon.jsx';

export default function FloatingTools() {
  const [large, setLarge] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('a11y-large', large);
    return () => document.body.classList.remove('a11y-large');
  }, [large]);

  return (
    <>
      <button
        className={`floating-accessibility ${large ? 'active' : ''}`}
        type="button"
        aria-label={large ? 'Kecilkan ukuran teks' : 'Perbesar ukuran teks'}
        title="Perbesar ukuran teks"
        onClick={() => setLarge((v) => !v)}
      >
        <AppIcon name="a-large-small" size={22} />
      </button>
      <a className="floating-112" href="tel:112" aria-label="Hubungi Kediri 112" title="Kediri 112">
        <AppIcon name="chat-dots-fill" size={20} />
        <span>Kediri 112</span>
      </a>
    </>
  );
}