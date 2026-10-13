import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import { Loading, ErrorBox } from '../components/States.jsx';

const statusStyle = {
  pending: 'bg-amber-100 text-amber-900',
  confirmed: 'bg-green-100 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
};

const prettyDate = (s) => new Date(`${s}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <p className="text-sm text-charcoal-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-maroon">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [date, setDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async (forDate) => {
    setStatus('loading');
    try {
      const s = await api.stats();
      setStats(s);
      const d = forDate || s.today;
      setDate(d);
      setBookings(await api.adminReservations(`?date=${d}`));
      setStatus('ready');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeDate = async (d) => {
    if (!d) return;
    setDate(d);
    try {
      setBookings(await api.adminReservations(`?date=${d}`));
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  };

  const setBookingStatus = async (id, next) => {
    if (next === 'cancelled' && !window.confirm('Cancel this booking and email the guest?')) return;
    setBusyId(id);
    try {
      const updated = await api.setReservationStatus(id, next);
      setBookings((list) => list.map((b) => (b._id === id ? updated : b)));
      api.stats().then(setStats).catch(() => {});
    } catch (e) {
      window.alert(e.message);
    } finally {
      setBusyId('');
    }
  };

  if (status === 'loading' && !stats) return <Loading label="Loading bookings" />;
  if (status === 'error') return <ErrorBox message={error} onRetry={() => load(date)} />;

  const shown = bookings.filter((b) => filter === 'all' || b.status === filter);
  const covers = bookings.filter((b) => b.status !== 'cancelled').reduce((n, b) => n + b.partySize, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Bookings today" value={stats.bookingsToday} />
        <StatCard label="Covers today" value={stats.coversToday} />
        <StatCard label="Awaiting confirmation" value={stats.pending} />
        <StatCard label="New enquiries" value={stats.newEnquiries} />
      </div>

      <section className="rounded-3xl bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">{date === stats.today ? "Today's bookings" : 'Bookings'}</h1>
            <p className="text-sm text-charcoal-soft">{prettyDate(date)} &middot; {covers} covers</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="d" className="label !mb-1">Date</label>
              <input id="d" type="date" className="field !py-2" value={date} onChange={(e) => changeDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="f" className="label !mb-1">Status</label>
              <select id="f" className="field !py-2" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {shown.length === 0 ? (
          <p className="rounded-xl bg-cream p-6 text-center text-charcoal-soft">No bookings for this day.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-maroon/20 text-xs uppercase tracking-wider text-charcoal-soft">
                <tr>
                  <th className="py-2 pr-3">Time</th><th className="pr-3">Guest</th><th className="pr-3">Party</th><th className="pr-3">Notes</th><th className="pr-3">Status</th><th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((b) => (
                  <tr key={b._id} className="border-b border-dashed border-maroon/15 align-top">
                    <td className="py-3 pr-3 font-semibold">{b.time}</td>
                    <td className="pr-3">
                      <p className="font-semibold">{b.name}</p>
                      <p className="text-xs text-charcoal-soft">{b.phone}<br />{b.email}</p>
                      <p className="text-xs text-charcoal-soft">{b.reference}</p>
                    </td>
                    <td className="pr-3">{b.partySize}</td>
                    <td className="max-w-[220px] pr-3 text-charcoal-soft">{b.notes || '-'}</td>
                    <td className="pr-3"><span className={`rounded px-2.5 py-1 text-xs font-semibold capitalize ${statusStyle[b.status]}`}>{b.status}</span></td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {b.status !== 'confirmed' && (
                          <button type="button" disabled={busyId === b._id} onClick={() => setBookingStatus(b._id, 'confirmed')} className="rounded bg-maroon px-3 py-1.5 text-xs font-semibold text-cream hover:bg-maroon-light disabled:opacity-50">Confirm</button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button type="button" disabled={busyId === b._id} onClick={() => setBookingStatus(b._id, 'cancelled')} className="rounded border border-red-700 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50">Cancel</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
