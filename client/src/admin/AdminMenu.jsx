import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox } from '../components/States.jsx';
import { DietBadge } from '../components/DietIcons.jsx';
import { formatPrice } from '../data/site';

const categories = ['Starters', 'Mains', 'Tandoor & Grill', 'Desserts', 'Drinks'];
const tagOptions = ['V', 'VG', 'GF'];
const empty = { name: '', description: '', price: '', category: 'Starters', dietaryTags: [], spiceLevel: 0, image: '', isAvailable: true, isFeatured: false, sortOrder: 0 };

function ItemForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...empty, ...initial });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTag = (t) => set('dietaryTags', form.dietaryTags.includes(t) ? form.dietaryTags.filter((x) => x !== t) : [...form.dietaryTags, t]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSave({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        dietaryTags: form.dietaryTags,
        spiceLevel: Number(form.spiceLevel),
        image: form.image || '',
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        sortOrder: Number(form.sortOrder) || 0,
      });
    } catch (err) {
      setError(Object.values(err.fieldErrors || {})[0] || err.message);
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={initial?._id ? 'Edit menu item' : 'Add menu item'} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
      <form onSubmit={submit} className="my-8 w-full max-w-xl space-y-4 rounded-3xl bg-cream p-6">
        <h2 className="font-display text-2xl font-semibold">{initial?._id ? 'Edit dish' : 'Add a dish'}</h2>
        {error && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-800">{error}</p>}
        <div>
          <label htmlFor="m-name" className="label">Name</label>
          <input id="m-name" required className="field" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label htmlFor="m-desc" className="label">Description</label>
          <textarea id="m-desc" required rows="3" className="field" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="m-price" className="label">Price (£)</label>
            <input id="m-price" required type="number" min="0" step="0.1" className="field" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div>
            <label htmlFor="m-cat" className="label">Category</label>
            <select id="m-cat" className="field" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="m-spice" className="label">Spice</label>
            <select id="m-spice" className="field" value={form.spiceLevel} onChange={(e) => set('spiceLevel', e.target.value)}>
              <option value="0">None</option><option value="1">Mild</option><option value="2">Medium</option><option value="3">Hot</option>
            </select>
          </div>
        </div>
        <fieldset>
          <legend className="label">Dietary tags</legend>
          <div className="flex gap-4">
            {tagOptions.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.dietaryTags.includes(t)} onChange={() => toggleTag(t)} className="h-4 w-4 accent-maroon" />{t}</label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="m-img" className="label">Image URL <span className="font-normal text-charcoal-soft">(optional)</span></label>
          <input id="m-img" className="field" value={form.image} onChange={(e) => set('image', e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isAvailable} onChange={(e) => set('isAvailable', e.target.checked)} className="h-4 w-4 accent-maroon" />Available</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="h-4 w-4 accent-maroon" />Featured on home page</label>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={busy} className="btn-maroon">{busy ? 'Saving…' : 'Save dish'}</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // item | 'new' | null
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const load = () => {
    setStatus('loading');
    api.adminMenu().then((d) => { setItems(d); setStatus('ready'); }).catch((e) => { setError(e.message); setStatus('error'); });
  };
  useEffect(load, []);

  const shown = useMemo(
    () => items.filter((i) => (category === 'All' || i.category === category) && i.name.toLowerCase().includes(query.toLowerCase())),
    [items, category, query]
  );

  const toggleAvailability = async (item) => {
    const next = !item.isAvailable;
    setItems((list) => list.map((i) => (i._id === item._id ? { ...i, isAvailable: next } : i))); // optimistic
    try {
      await api.patchMenuItem(item._id, { isAvailable: next });
    } catch (e) {
      setItems((list) => list.map((i) => (i._id === item._id ? { ...i, isAvailable: item.isAvailable } : i)));
      window.alert(e.message);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.name}" permanently?`)) return;
    try {
      await api.deleteMenuItem(item._id);
      setItems((list) => list.filter((i) => i._id !== item._id));
    } catch (e) {
      window.alert(e.message);
    }
  };

  const save = async (payload) => {
    if (editing === 'new') {
      const created = await api.createMenuItem(payload);
      setItems((l) => [...l, created]);
    } else {
      const updated = await api.updateMenuItem(editing._id, payload);
      setItems((l) => l.map((i) => (i._id === updated._id ? updated : i)));
    }
    setEditing(null);
  };

  if (status === 'loading') return <Loading label="Loading menu" />;
  if (status === 'error') return <ErrorBox message={error} onRetry={load} />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Menu management</h1>
        <div className="flex flex-wrap items-end gap-3">
          <input aria-label="Search dishes" placeholder="Search…" className="field !w-48 !py-2" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select aria-label="Filter by category" className="field !w-44 !py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>{categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button type="button" className="btn-maroon" onClick={() => setEditing('new')}>+ Add dish</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white p-2 sm:p-4">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-maroon/20 text-xs uppercase tracking-wider text-charcoal-soft">
            <tr><th className="p-3">Dish</th><th>Category</th><th>Price</th><th>Tags</th><th>Available</th><th className="pr-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {shown.map((i) => (
              <tr key={i._id} className={`border-b border-dashed border-maroon/15 ${i.isAvailable ? '' : 'bg-charcoal/5 text-charcoal/60'}`}>
                <td className="p-3">
                  <p className="font-semibold">{i.name} {i.isFeatured && <span className="ml-1 rounded bg-marigold-soft px-2 py-0.5 text-[10px] font-bold text-maroon">FEATURED</span>}</p>
                  <p className="max-w-xs truncate text-xs text-charcoal-soft">{i.description}</p>
                </td>
                <td>{i.category}</td>
                <td>{formatPrice(i.price)}</td>
                <td><div className="flex gap-1">{i.dietaryTags.map((t) => <DietBadge key={t} tag={t} />)}</div></td>
                <td>
                  <button type="button" role="switch" aria-checked={i.isAvailable} aria-label={`${i.name} available`} onClick={() => toggleAvailability(i)} className={`relative h-6 w-11 rounded-full transition ${i.isAvailable ? 'bg-maroon' : 'bg-charcoal/30'}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${i.isAvailable ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="pr-3 text-right">
                  <button type="button" onClick={() => setEditing(i)} className="mr-2 text-xs font-semibold text-maroon underline underline-offset-4">Edit</button>
                  <button type="button" onClick={() => remove(i)} className="text-xs font-semibold text-red-700 underline underline-offset-4">Delete</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-charcoal-soft">No dishes found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <ItemForm initial={editing === 'new' ? null : editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  );
}
