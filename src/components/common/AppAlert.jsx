/**
 * Reusable alert banner wrapping Bootstrap's alert component.
 */
export default function AppAlert({ children, type = 'success' }) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {children}
    </div>
  );
}
