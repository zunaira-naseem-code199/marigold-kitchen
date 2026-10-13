import { useId } from 'react';

// Block-print inspired repeating strip. Used only as a divider under page headers and above the footer.
// Colour follows `currentColor`.
export function PatternDivider({ className = '' }) {
  const id = useId();
  return (
    <svg className={`block h-5 w-full ${className}`} aria-hidden="true" role="presentation">
      <defs>
        <pattern id={id} width="44" height="20" patternUnits="userSpaceOnUse">
          <path d="M22 2 L30 10 L22 18 L14 10 Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="22" cy="10" r="2.2" fill="currentColor" />
          <path d="M0 10 H9 M35 10 H44" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="4" cy="3" r="1.2" fill="currentColor" />
          <circle cx="40" cy="17" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function MarigoldMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="-32 -32 64 64" className={className} aria-hidden="true">
      <g fill="#F6B21B">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <ellipse key={a} cx="0" cy="-15" rx="6" ry="9" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r="7" fill="#E8890C" />
    </svg>
  );
}
