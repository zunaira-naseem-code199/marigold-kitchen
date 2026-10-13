export function Loading({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-charcoal-soft" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-maroon/30 border-t-maroon" />
      <span>{label}…</span>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div role="alert" className="my-10 max-w-lg border border-red-300 bg-red-50 p-6">
      <p className="font-semibold text-red-800">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-maroon mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

// Left-aligned section heading. Only pass `eyebrow` when it carries real information (a day, a time).
export function SectionHeading({ eyebrow, title, intro, light = false }) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && <p className={`eyebrow mb-3 ${light ? '!text-marigold' : ''}`}>{eyebrow}</p>}
      <h2 className={`font-display text-3xl font-semibold leading-tight sm:text-4xl ${light ? '!text-cream' : ''}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-cream/85' : 'text-charcoal-soft'}`}>{intro}</p>}
    </div>
  );
}
