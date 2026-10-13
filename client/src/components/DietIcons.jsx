const tagInfo = {
  V: { label: 'Vegetarian', cls: 'bg-green-100 text-green-900 border-green-700/40' },
  VG: { label: 'Vegan', cls: 'bg-emerald-100 text-emerald-900 border-emerald-700/40' },
  GF: { label: 'Gluten free', cls: 'bg-amber-100 text-amber-900 border-amber-700/40' },
};

export function DietBadge({ tag }) {
  const info = tagInfo[tag];
  if (!info) return null;
  return (
    <span
      title={info.label}
      aria-label={info.label}
      className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-sm border px-1.5 text-[11px] font-bold ${info.cls}`}
    >
      {tag}
    </span>
  );
}

export function SpiceLevel({ level = 0 }) {
  if (!level) return null;
  const labels = ['', 'Mild', 'Medium', 'Hot'];
  return (
    <span className="inline-flex items-center gap-0.5" title={`${labels[level]} spice`} aria-label={`${labels[level]} spice`}>
      {Array.from({ length: level }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-red-700" fill="currentColor" aria-hidden="true">
          <path d="M12 2c1 3-1 4-1 6 0 1.5 1 2.5 2 2.5 1.600 0 2.500-1.400 2.200-3 2.300 2 3.800 4.600 3.800 7.500A7 7 0 0 1 12 22a7 7 0 0 1-7-7c0-3 1.500-5.300 3.500-7.200C9 9 10 10 10.500 10.500 10.500 7 11 4.500 12 2z" />
        </svg>
      ))}
    </span>
  );
}
