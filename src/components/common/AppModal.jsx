import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Overlay for every lightbox/dialog in the app.
 *
 * The hand-rolled version each page shipped was a div with role="presentation",
 * which meant: screen readers announced nothing when it opened, Escape did not
 * close it, Tab walked straight out of the overlay into the page behind it, and
 * the background scrolled underneath. A keyboard user could only dismiss a
 * dialog by Tab-ing blindly to find the "Tutup" button. This adds the dialog
 * contract: role/aria-modal, Escape, a Tab trap, focus restore and a scroll lock.
 *
 * Reuses the existing ktp-lightbox class names, so no CSS change is needed.
 */
export default function AppModal({ onClose, label, children }) {
  const boxRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    restoreRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    boxRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = Array.from(boxRef.current?.querySelectorAll(FOCUSABLE) || []);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="ktp-lightbox" onClick={onClose} role="presentation">
      <div
        className="ktp-lightbox-box"
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
