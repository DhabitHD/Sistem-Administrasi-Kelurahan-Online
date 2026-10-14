export default function WaveDivider({ fill = '#0056b3', flip = false, className = '', height = 64 }) {
  return (
    <div
      className={`wave-divider ${flip ? 'wave-flip' : ''} ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill={fill} fillOpacity="1" d="M0,160L80,176C160,192,320,224,480,213.3C640,203,800,149,960,133.3C1120,117,1280,139,1360,149.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </div>
  );
}