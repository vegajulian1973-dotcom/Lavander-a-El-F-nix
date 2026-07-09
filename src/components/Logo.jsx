// Componente Logo reutilizable
export function LogoSVG({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="38" fill="#0057b8" opacity="0.1" stroke="#0057b8" strokeWidth="2"/>
      <path d="M40 15C26.74 15 16 25.74 16 39C16 47.83 20.98 55.64 28.4 59.72L32 50H48L51.6 59.72C59.02 55.64 64 47.83 64 39C64 25.74 53.26 15 40 15Z" fill="#0057b8"/>
      <circle cx="32" cy="35" r="3" fill="white"/>
      <circle cx="48" cy="35" r="3" fill="white"/>
      <path d="M35 42H45M35 48H45" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
