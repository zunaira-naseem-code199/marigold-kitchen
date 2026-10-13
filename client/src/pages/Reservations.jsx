import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Seo from '../components/Seo.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { site } from '../data/site';

const isoDate = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d);
const prettyDate = (s) =>
  new Date(`${s}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

const blank = { name: '', email: '', phone: '', notes: '' };

export default function Reservations() {
  const today = useMemo(() => isoDate(new Date()), []);
  const maxDate = useMemo(() => isoDate(new Date(Date.now() + 90 * 86400000)), []);

  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState(null); // null = not loaded
  const [closedReason, setClosedReason] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (!date) return undefined;
    let cancelled = false;
    setSlotsLoading(true);
    setTime('');
    setClosedReason('');
    api
      .availability(date)
      .then((r) => {
        if (cancelled) return;
        setSlots(r.slots);
        setClosedReason(r.closed ? r.reason : '');
      })
      .catch((e) => !cancelled && (setSlots([]), setClosedReason(e.message)))
      .finally(() => !cancelled && setSlotsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [date]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!date) e.date = 'Please choose a date';
    if (!time) e.time = 'Please choose a time';
    if (form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!/^[+()\d][\d\s()+-]{6,19}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      const res = await api.reserve({ ...form, date, time, partySize: Number(partySize) });
      setConfirmation(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
      setServerError(err.message);
      // Refresh slots in case someone else took the last table
      if (err.status === 409) api.availability(date).then((r) => setSlots(r.slots)).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <section className="container-page max-w-2xl py-16">
        <Seo title="Booking received" noindex path="/reservations" />
        <div className="border-t-4 border-marigold bg-white p-8 sm:p-12" role="status">
          <h1 className="font-display text-3xl font-semibold">Table requested, {confirmation.name.split(' ')[0]}</h1>
          <p className="mt-3 text-charcoal-soft">{confirmation.emailSent ? <>A confirmation email is on its way to <strong>{confirmation.email}</strong>.</> : <>Keep your reference below. We'll confirm by phone or email.</>}</p>
          <dl className="mt-8 grid max-w-sm gap-3 bg-cream p-5 text-left text-sm">
            <div className="flex justify-between"><dt className="text-charcoal-soft">Date</dt><dd className="font-semibold">{prettyDate(confirmation.date)}</dd></div>
            <div className="flex justify-between"><dt className="text-charcoal-soft">Time</dt><dd className="font-semibold">{confirmation.time}</dd></div>
            <div className="flex justify-between"><dt className="text-charcoal-soft">Guests</dt><dd className="font-semibold">{confirmation.partySize}</dd></div>
            <div className="flex justify-between"><dt className="text-charcoal-soft">Reference</dt><dd className="font-semibold">{confirmation.reference}</dd></div>
          </dl>
          <p className="mt-6 text-sm text-charcoal-soft">Need to change something? Call <a className="font-semibold text-maroon underline" href={site.phoneHref}>{site.phone}</a> and quote your reference.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="btn-maroon">Back to home</Link>
            <button type="button" onClick={() => { setConfirmation(null); setForm(blank); setTime(''); setDate(''); setSlots(null); }} className="btn-secondary">Make another booking</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo title="Reserve a table" description="Book a table at Marigold Kitchen in Leeds for dinner or weekend brunch." path="/reservations" />
      <PageHeader
        title="Reserve a table"
        intro={<>Pick a date and a time and we'll hold your table. Nine or more? Send a <Link to="/private-dining" className="underline decoration-marigold underline-offset-4">private dining enquiry</Link>.</>}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-3">
        <form onSubmit={submit} noValidate className="space-y-8 lg:col-span-2" aria-label="Reservation form">
          {serverError && <div role="alert" className="rounded border border-red-300 bg-red-50 p-4 font-medium text-red-800">{serverError}</div>}

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 font-display text-xl font-semibold text-maroon">1. When and how many?</legend>
            <div>
              <label htmlFor="date" className="label">Date</label>
              <input id="date" type="date" className="field" min={today} max={maxDate} value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-err' : undefined} />
              {errors.date && <p id="date-err" className="error-text">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="party" className="label">Party size</label>
              <select id="party" className="field" value={partySize} onChange={(e) => setPartySize(e.target.value)}>
                {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
              </select>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-display text-xl font-semibold text-maroon">2. Choose a time</legend>
            {!date && <p className="rounded bg-cream-dark p-4 text-sm text-charcoal-soft">Select a date to see available times.</p>}
            {date && slotsLoading && <p className="text-sm text-charcoal-soft" role="status">Checking availability…</p>}
            {date && !slotsLoading && closedReason && <p className="rounded bg-amber-50 p-4 text-sm font-medium text-amber-900" role="status">{closedReason}. Please pick another date.</p>}
            {date && !slotsLoading && !closedReason && slots && slots.length === 0 && <p className="text-sm text-charcoal-soft">No times left on this date.</p>}
            {date && !slotsLoading && slots && slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5" role="radiogroup" aria-label="Available times">
                {slots.map((s) => {
                  const full = s.remaining < Number(partySize);
                  return (
                    <button
                      key={s.time}
                      type="button"
                      role="radio"
                      aria-checked={time === s.time}
                      disabled={full}
                      onClick={() => setTime(s.time)}
                      className={`min-h-[44px] rounded border text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:border-charcoal/10 disabled:bg-charcoal/5 disabled:text-charcoal/40 disabled:line-through ${
                        time === s.time ? 'border-maroon bg-maroon text-cream' : 'border-maroon/30 bg-white text-maroon hover:bg-marigold-soft'
                      }`}
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
            {errors.time && <p className="error-text">{errors.time}</p>}
          </fieldset>

          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 font-display text-xl font-semibold text-maroon">3. Your details</legend>
            <div>
              <label htmlFor="name" className="label">Full name</label>
              <input id="name" className="field" autoComplete="name" value={form.name} onChange={update('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone</label>
              <input id="phone" type="tel" className="field" autoComplete="tel" value={form.phone} onChange={update('phone')} aria-invalid={!!errors.phone} />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="label">Email</label>
              <input id="email" type="email" className="field" autoComplete="email" value={form.email} onChange={update('email')} aria-invalid={!!errors.email} />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="label">Special requests <span className="font-normal text-charcoal-soft">(allergies, celebrations, high chairs)</span></label>
              <textarea id="notes" rows="3" maxLength="600" className="field" value={form.notes} onChange={update('notes')} />
            </div>
          </fieldset>

          <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>
            {submitting ? 'Reserving…' : 'Request my table'}
          </button>
        </form>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border border-maroon/20 bg-white p-6">
            <h2 className="font-display text-xl font-semibold">Large groups</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">Online bookings are for up to 8 guests. For 9 or more we can set up the private dining room. A £15 per person deposit secures group bookings, refundable up to 72 hours before.</p>
            <Link to="/private-dining" className="btn-secondary mt-4 w-full">Private dining enquiry</Link>
          </div>
          <div className="bg-cream-dark p-6 text-sm leading-relaxed text-charcoal-soft">
            <h2 className="mb-2 font-display text-xl font-semibold text-maroon">Good to know</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tables are held for 15 minutes after your booking time.</li>
              <li>Dining slots are 90 minutes for parties up to 4, 2 hours for larger tables.</li>
              <li>Prefer to talk? Call <a className="font-semibold text-maroon underline" href={site.phoneHref}>{site.phone}</a>.</li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}