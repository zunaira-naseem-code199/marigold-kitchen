import { photos } from '../data/photos.js';

// Flat placeholder for food photography. Swap `src` for real photos when the client supplies them.
const palettes = [
  ['#6B1D2A', '#E8890C', '#FCE7A8'],
  ['#45101a', '#F6B21B', '#FAF3E3'],
  ['#8e2c3d', '#F6B21B', '#FCE7A8'],
  ['#2B2623', '#E8890C', '#F0E4C8'],
  ['#6B1D2A', '#c8571a', '#FAF3E3'],
];

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export default function FoodImage({ src, alt = '', label = '', seed = label || alt, className = '', rounded = 'rounded' }) {
  const finalSrc = src || photos[seed];
  if (finalSrc) {
    return <img src={finalSrc} alt={alt} loading="lazy" className={`h-full w-full object-cover ${rounded} ${className}`} />;
  }
  const h = hash(seed);
  const [bg, accent, light] = palettes[h % palettes.length];
  const garnish = h % 3;
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="400" height="300" fill={bg} />
        <circle cx="200" cy="150" r="104" fill={light} />
        <circle cx="200" cy="150" r="84" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="3 6" />
        <circle cx="200" cy="150" r="62" fill={accent} />
        {garnish === 0 && <g fill={bg}><circle cx="178" cy="132" r="9" /><circle cx="212" cy="124" r="6" /><circle cx="226" cy="164" r="8" /><circle cx="190" cy="172" r="5" /></g>}
        {garnish === 1 && <g stroke={bg} strokeWidth="5" strokeLinecap="round"><path d="M170 150 Q200 120 230 150" fill="none" /><path d="M175 170 Q200 148 225 170" fill="none" /></g>}
        {garnish === 2 && <g fill={light}><ellipse cx="190" cy="138" rx="14" ry="7" transform="rotate(-25 190 138)" /><ellipse cx="216" cy="160" rx="14" ry="7" transform="rotate(25 216 160)" /><circle cx="198" cy="170" r="5" /></g>}
      </svg>
      {label && (
        <span className="absolute bottom-2 left-2 bg-charcoal px-2 py-0.5 text-[11px] font-medium text-cream">
          {label}
        </span>
      )}
    </div>
  );
}