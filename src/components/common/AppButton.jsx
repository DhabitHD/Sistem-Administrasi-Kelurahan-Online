import { Link } from 'react-router-dom';

/**
 * Versatile button that renders as a <Link> when `to` is provided,
 * otherwise renders a standard <button>.
 */
export default function AppButton({
  to,
  children,
  variant = 'brand',
  outline = false,
  type = 'button',
  onClick,
  className = '',
}) {
  const cls = `btn ${outline ? 'btn-outline-' : 'btn-'}${variant} ${className}`.trim();

  return to ? (
    <Link className={cls} to={to}>{children}</Link>
  ) : (
    <button type={type} className={cls} onClick={onClick}>{children}</button>
  );
}
