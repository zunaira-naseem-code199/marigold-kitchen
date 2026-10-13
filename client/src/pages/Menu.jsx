import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import Seo from '../components/Seo.jsx';
import { Loading, ErrorBox } from '../components/States.jsx';
import { DietBadge, SpiceLevel } from '../components/DietIcons.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { formatPrice } from '../data/site';

const categories = ['Starters', 'Mains', 'Tandoor & Grill', 'Desserts', 'Drinks'];
const filters = [
  { tag: 'V', label: 'Vegetarian' },
  { tag: 'VG', label: 'Vegan' },
  { tag: 'GF', label: 'Gluten free' },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [activeTags, setActiveTags] = useState([]);

  const load = () => {
    setStatus('loading');
    api
      .menu()
      .then((data) => {
        setItems(data);
        setStatus('ready');
      })
      .catch((e) => {
        setError(e.message);
        setStatus('error');
      });
  };
  useEffect(load, []);

  const visible = useMemo(
    () =>
      items.filter(
        (i) =>
          i.category === category &&
          activeTags.every((t) => (t === 'V' ? i.dietaryTags.includes('V') || i.dietaryTags.includes('VG') : i.dietaryTags.includes(t)))
      ),
    [items, category, activeTags]
  );

  const toggleTag = (tag) => setActiveTags((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  return (
    <>
      <Seo title="Menu" description="Starters, mains, tandoor and grill, desserts and drinks. South Asian dishes with vegetarian, vegan and gluten-free options." path="/menu" />

      <PageHeader title="Menu" intro="Dishes are made to share. Ask us about spice levels and allergens." />

      {/* Sticky category tabs (stays visible under the header while scrolling on mobile) */}
      <div className="sticky top-16 z-20 border-b border-maroon/15 bg-cream">
        <div className="container-page">
          <div role="tablist" aria-label="Menu categories" className="-mx-5 flex gap-2 overflow-x-auto px-5 py-3 sm:mx-0 sm:px-0">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                id={`tab-${c}`}
                aria-selected={category === c}
                aria-controls="menu-panel"
                onClick={() => setCategory(c)}
                className={`min-h-[44px] shrink-0 rounded border px-5 text-sm font-semibold transition-colors ${
                  category === c ? 'border-maroon bg-maroon text-cream' : 'border-maroon/30 text-maroon hover:bg-maroon/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container-page py-10" id="menu-panel" role="tabpanel" aria-labelledby={`tab-${category}`}>
        <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Dietary filters">
          <span className="mr-1 text-sm font-medium text-charcoal-soft">Filter:</span>
          {filters.map((f) => (
            <button
              key={f.tag}
              type="button"
              aria-pressed={activeTags.includes(f.tag)}
              onClick={() => toggleTag(f.tag)}
              className={`min-h-[40px] rounded border px-4 text-sm font-medium transition-colors ${
                activeTags.includes(f.tag) ? 'border-maroon bg-marigold text-maroon-dark' : 'border-charcoal/25 bg-white hover:border-maroon'
              }`}
            >
              {f.label}
            </button>
          ))}
          {activeTags.length > 0 && (
            <button type="button" onClick={() => setActiveTags([])} className="text-sm font-medium text-maroon underline underline-offset-4">
              Clear
            </button>
          )}
        </div>

        {status === 'loading' && <Loading label="Loading the menu" />}
        {status === 'error' && <ErrorBox message={error} onRetry={load} />}
        {status === 'ready' && visible.length === 0 && (
          <p className="py-12 text-charcoal-soft">No dishes match those filters in {category}. Try clearing a filter.</p>
        )}

        {status === 'ready' && visible.length > 0 && (
          <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
            {visible.map((item) => (
              <li key={item._id} className="border-b border-dashed border-maroon/25 pb-6">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-xl font-semibold">{item.name}</h3>
                  <span className="mb-1 flex-1 border-b border-dotted border-charcoal/30" aria-hidden="true" />
                  <span className="font-display text-lg font-semibold text-maroon">{formatPrice(item.price)}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal-soft">{item.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  {item.dietaryTags.map((t) => <DietBadge key={t} tag={t} />)}
                  <SpiceLevel level={item.spiceLevel} />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 max-w-2xl border-t border-maroon/20 pt-5 text-sm text-charcoal-soft">
          <strong className="text-charcoal">Key:</strong> V vegetarian &middot; VG vegan &middot; GF gluten free &middot; flames show spice level. Please tell us about any allergies before ordering. A discretionary 12.5% service charge is added to tables of 6 or more.
        </div>
      </section>
    </>
  );
}
