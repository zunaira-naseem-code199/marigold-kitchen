import { useCallback, useEffect, useRef, useState } from 'react';
import Seo from '../components/Seo.jsx';
import FoodImage from '../components/FoodImage.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { photos as photoMap } from '../data/photos.js';

// Replace `src` with real photography when available. Heights vary to create the masonry rhythm.
const allPhotos = [
  { label: 'Coal-fired tandoor', h: 'aspect-[3/4]' },
  { label: 'Lamb nihari', h: 'aspect-square' },
  { label: 'The Saffron Room', h: 'aspect-[4/3]' },
  { label: 'Chai service', h: 'aspect-[3/5]' },
  { label: 'Paneer tikka bao', h: 'aspect-square' },
  { label: 'Marigold Spritz', h: 'aspect-[3/4]' },
  { label: 'Dining room at dusk', h: 'aspect-[4/3]' },
  { label: 'Dal makhani', h: 'aspect-[4/5]' },
  { label: 'Kulfi with rose petals', h: 'aspect-square' },
  { label: 'Spice wall', h: 'aspect-[3/4]' },
  { label: 'Chef Anika at the pass', h: 'aspect-[4/3]' },
  { label: 'Sunday brunch spread', h: 'aspect-[4/5]' },
];

// Only show tiles that have a real photo; empty entries in data/photos.js are skipped.
const photos = allPhotos.filter((p) => photoMap[p.label]);

function Lightbox({ index, onClose, onNavigate }) {
  const closeRef = useRef(null);
  const photo = photos[index];

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Photo: ${photo.label}`} className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-maroon">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate(-1); }} aria-label="Previous photo" className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-maroon sm:left-6">&#8249;</button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onNavigate(1); }} aria-label="Next photo" className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-maroon sm:right-6">&#8250;</button>
      <figure className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <FoodImage label="" alt={photo.label} seed={photo.label} className="aspect-[4/3] w-full" />
        <figcaption className="mt-3 text-center text-cream">{photo.label} <span className="text-cream/60">({index + 1} / {photos.length})</span></figcaption>
      </figure>
    </div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const navigate = useCallback((dir) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)), []);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <Seo title="Gallery" description="A look inside Marigold Kitchen: the tandoor, the dishes, the dining room and the people behind the pass." path="/gallery" />
      <PageHeader title="A taste of the room" intro="The tandoor, the dishes and the dining room on Call Lane." />

      <section className="container-page py-12">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((p, i) => (
            <li key={p.label}>
              <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${p.label}`} className="group block w-full overflow-hidden rounded-2xl">
                <FoodImage label={p.label} seed={p.label} className="aspect-[4/3] w-full" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {open !== null && <Lightbox index={open} onClose={close} onNavigate={navigate} />}
    </>
  );
}