import { useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox } from '../components/States.jsx';

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const load = () => {
    setStatus('loading');
    api.adminEnquiries().then((d) => { setItems(d); setStatus('ready'); }).catch((e) => { setError(e.message); setStatus('error'); });
  };
  useEffect(load, []);

  const setEnquiryStatus = async (id, next) => {
    try {
      const updated = await api.setEnquiryStatus(id, next);
      setItems((l) => l.map((e) => (e._id === id ? updated : e)));
    } catch (e) {
      window.alert(e.message);
    }
  };

  if (status === 'loading') return <Loading label="Loading enquiries" />;
  if (status === 'error') return <ErrorBox message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold">Private dining enquiries</h1>
      {items.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-charcoal-soft">No enquiries yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((e) => (
            <li key={e._id} className="rounded-3xl bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">{e.name}{e.company && <span className="text-base font-normal text-charcoal-soft"> &middot; {e.company}</span>}</h2>
                  <p className="mt-1 text-sm text-charcoal-soft">
                    <a className="underline" href={`mailto:${e.email}`}>{e.email}</a> &middot; <a className="underline" href={`tel:${e.phone}`}>{e.phone}</a>
                  </p>
                </div>
                <div>
                  <label htmlFor={`s-${e._id}`} className="sr-only">Status</label>
                  <select id={`s-${e._id}`} className="field !w-40 !py-2 text-sm" value={e.status} onChange={(ev) => setEnquiryStatus(e._id, ev.target.value)}>
                    <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <p className="mt-3 text-sm"><strong>{e.eventType}</strong> &middot; {e.guestCount} guests &middot; {e.date || 'Flexible date'}</p>
              {e.message && <p className="mt-2 rounded-xl bg-cream p-4 text-sm text-charcoal-soft">{e.message}</p>}
              <p className="mt-3 text-xs text-charcoal-soft">Received {new Date(e.createdAt).toLocaleString('en-GB')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
