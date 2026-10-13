import { useState } from 'react';
import { api } from '../api';
import Seo from '../components/Seo.jsx';
import FoodImage from '../components/FoodImage.jsx';
import { PatternDivider } from '../components/Pattern.jsx';
import { SectionHeading } from '../components/States.jsx';

const eventTypes = ['Birthday', 'Anniversary', 'Corporate dinner', 'Team celebration', 'Wedding party', 'Other'];

const setMenus = [
  { name: 'The Sharing Feast', price: '£38', note: 'per person, min. 10 guests', items: ['Papad & chutneys', 'Choice of 3 starters to share', 'Choice of 3 mains with rice and naan', 'Seasonal dessert platter'] },
  { name: 'The Marigold Banquet', price: '£52', note: 'per person, min. 10 guests', items: ['Canapé on arrival', 'Tandoor grill platter', 'Slow-cooked lamb or Keralan prawns', 'Dal makhani, greens and biryani', 'Kulfi and gulab jamun'], },
  { name: 'Plant-Led Feast', price: '£36', note: 'per person, fully vegan', items: ['Beetroot tikki and aubergine chaat', 'Mushroom and chestnut korma', 'Tandoori cauliflower steak', 'Mango shrikhand'] },
];

const blank = { name: '', email: '', phone: '', company: '', eventType: '', guestCount: '', date: '', message: '' };

export default function PrivateDining() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!/^[+()\d][\d\s()+-]{6,19}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number';
    if (!form.eventType) e.eventType = 'Please choose an event type';
    if (!form.guestCount || Number(form.guestCount) < 1) e.guestCount = 'How many guests?';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    try {
      await api.enquire({ ...form, guestCount: Number(form.guestCount) });
      setSent(true);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Private Dining & Events" description="Private dining room in Leeds for up to 36 seated guests. Set menus for birthdays, corporate dinners and parties." path="/private-dining" />

      <section className="bg-maroon text-cream">
        <div className="container-page grid gap-10 py-14 md:grid-cols-12 md:items-end md:py-16">
          <div className="md:col-span-7">
            <h1 className="font-display text-5xl font-semibold leading-[1.05] !text-cream sm:text-6xl">The Saffron Room</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/90">A private room above the restaurant with its own bar and a view into the tandoor kitchen. Seats 36, or 60 standing.</p>
            <a href="#enquire" className="btn-primary mt-7">Send an enquiry</a>
          </div>
          <div className="md:col-span-5">
            <FoodImage label="Photo: The Saffron Room" seed="saffron-room" className="aspect-[4/3] w-full" />
          </div>
        </div>
        <PatternDivider className="text-marigold/70" />
      </section>

      <section className="container-page py-16">
        <SectionHeading title="Set menus" intro="Menus are for the whole table. We adjust spice, dietary needs and drinks with you." />
        <div className="grid gap-10 md:grid-cols-3">
          {setMenus.map((m) => (
            <article key={m.name} className="border-t-2 border-maroon pt-5">
              <h3 className="font-display text-2xl font-semibold">{m.name}</h3>
              <p className="mt-1 font-display text-2xl text-maroon">{m.price} <span className="font-sans text-sm text-charcoal-soft">{m.note}</span></p>
              <ul className="mt-4 space-y-1.5 text-sm text-charcoal-soft">
                {m.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream-dark py-16" id="enquire">
        <div className="container-page max-w-3xl">
          <SectionHeading title="Tell us about your occasion" intro="We reply within one working day with availability and a proposal." />

          {sent ? (
            <div role="status" className="border-t-4 border-marigold bg-white p-8">
              <h3 className="font-display text-2xl font-semibold">Enquiry received</h3>
              <p className="mt-3 text-charcoal-soft">A confirmation is on its way to your inbox. We'll reply within one working day.</p>
              <button type="button" className="btn-secondary mt-6" onClick={() => { setSent(false); setForm(blank); }}>Send another enquiry</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 bg-white p-6 sm:grid-cols-2 sm:p-8" aria-label="Private dining enquiry form">
              {serverError && <div role="alert" className="rounded border border-red-300 bg-red-50 p-4 font-medium text-red-800 sm:col-span-2">{serverError}</div>}
              <div>
                <label htmlFor="pd-name" className="label">Full name</label>
                <input id="pd-name" className="field" autoComplete="name" value={form.name} onChange={update('name')} aria-invalid={!!errors.name} />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="pd-company" className="label">Company <span className="font-normal text-charcoal-soft">(optional)</span></label>
                <input id="pd-company" className="field" autoComplete="organization" value={form.company} onChange={update('company')} />
              </div>
              <div>
                <label htmlFor="pd-email" className="label">Email</label>
                <input id="pd-email" type="email" className="field" autoComplete="email" value={form.email} onChange={update('email')} aria-invalid={!!errors.email} />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="pd-phone" className="label">Phone</label>
                <input id="pd-phone" type="tel" className="field" autoComplete="tel" value={form.phone} onChange={update('phone')} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="pd-type" className="label">Event type</label>
                <select id="pd-type" className="field" value={form.eventType} onChange={update('eventType')} aria-invalid={!!errors.eventType}>
                  <option value="">Choose…</option>
                  {eventTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.eventType && <p className="error-text">{errors.eventType}</p>}
              </div>
              <div>
                <label htmlFor="pd-guests" className="label">Number of guests</label>
                <input id="pd-guests" type="number" min="1" max="200" className="field" value={form.guestCount} onChange={update('guestCount')} aria-invalid={!!errors.guestCount} />
                {errors.guestCount && <p className="error-text">{errors.guestCount}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pd-date" className="label">Preferred date <span className="font-normal text-charcoal-soft">(optional)</span></label>
                <input id="pd-date" type="date" className="field" value={form.date} onChange={update('date')} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="pd-msg" className="label">Anything we should know?</label>
                <textarea id="pd-msg" rows="4" maxLength="1500" className="field" value={form.message} onChange={update('message')} />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting}>{submitting ? 'Sending…' : 'Send enquiry'}</button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
