import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { site, nav, hours } from '../data/site';
import { PatternDivider, MarigoldMark } from './Pattern';

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkCls = ({ isActive }) =>
    `rounded px-3 py-2 text-sm font-medium transition hover:text-marigold ${isActive ? 'text-marigold' : 'text-cream'}`;

  return (
    <header className="sticky top-0 z-40 bg-maroon text-cream">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded focus:bg-marigold focus:px-3 focus:py-1 focus:text-maroon-dark">
        Skip to content
      </a>
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Marigold Kitchen home">
          <MarigoldMark className="h-9 w-9" />
          <span className="font-display text-xl font-semibold tracking-wide text-cream">Marigold Kitchen</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkCls}>
              {n.label}
            </NavLink>
          ))}
          <Link to="/reservations" className="btn-primary ml-3 !min-h-[40px] !py-2">
            Reserve a table
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded border border-cream/40 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-cream/15 bg-maroon-dark md:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col gap-1 py-4">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `rounded-lg px-3 py-3 text-lg ${isActive ? 'bg-white/10 text-marigold' : 'text-cream'}`}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/reservations" className="btn-primary mt-3">
              Reserve a table
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative bg-maroon-dark pb-24 text-cream md:pb-0">
      <PatternDivider className="text-marigold/70" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <MarigoldMark className="h-9 w-9" />
            <p className="font-display text-xl font-semibold text-cream">Marigold Kitchen</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-cream/80">Regional South Asian cooking over coals, on Call Lane in Leeds.</p>
          <p className="mt-4 text-sm text-cream/80">Follow {site.instagram}</p>
        </div>

        <div>
          <h3 className="mb-3 font-display text-lg !text-marigold">Opening hours</h3>
          <dl className="space-y-1.5 text-sm">
            {hours.map((h) => (
              <div key={h.day}>
                <dt className="font-medium text-cream">{h.day}</dt>
                <dd className="text-cream/80">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h3 className="mb-3 font-display text-lg !text-marigold">Find us</h3>
          <address className="text-sm not-italic leading-relaxed text-cream/90">
            {site.address.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </address>
          <p className="mt-4 text-sm">
            <a className="underline decoration-marigold/60 underline-offset-4 hover:text-marigold" href={site.phoneHref}>
              {site.phone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a className="underline decoration-marigold/60 underline-offset-4 hover:text-marigold" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ul className="mt-5 space-y-1 text-sm text-cream/80">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-marigold">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/admin" className="text-cream/50 hover:text-marigold">
                Staff login
              </Link>
            </li>
          </ul>
        </div>

        {/* Map block */}
        <a
          href={site.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group relative block min-h-[200px] overflow-hidden rounded-2xl border border-cream/20 bg-maroon"
          aria-label="Open Marigold Kitchen in Google Maps (opens in a new tab)"
        >
          <svg viewBox="0 0 300 220" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="300" height="220" fill="#5a1723" />
            <g stroke="#8e2c3d" strokeWidth="10" fill="none" strokeLinecap="round">
              <path d="M-10 60 L120 90 L320 40" />
              <path d="M40 -10 L90 120 L70 240" />
              <path d="M180 -10 L170 110 L260 240" />
              <path d="M-10 170 L300 150" />
            </g>
            <g stroke="#6B1D2A" strokeWidth="5" fill="none"><path d="M0 120 L300 100" /><path d="M120 0 L130 220" /></g>
            <path d="M0 200 Q80 170 150 205 T300 190 V220 H0Z" fill="#3b0d16" />
          </svg>
          <div className="absolute left-[44%] top-[38%] -translate-x-1/2 -translate-y-full">
            <svg viewBox="0 0 24 32" className="h-10 w-8 " aria-hidden="true">
              <path d="M12 0C5.400 0 0 5.200 0 11.600 0 20 12 32 12 32s12-12 12-20.400C24 5.200 18.600 0 12 0z" fill="#F6B21B" />
              <circle cx="12" cy="11.500" r="4.500" fill="#6B1D2A" />
            </svg>
          </div>
          <span className="absolute bottom-3 left-3 right-3 rounded bg-cream px-4 py-2 text-center text-sm font-semibold text-maroon transition group-hover:bg-marigold">
            Get directions
          </span>
        </a>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Marigold Kitchen. Sample website for demonstration purposes.
      </div>
    </footer>
  );
}

function StickyReserve() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/reservations') || pathname.startsWith('/admin')) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-maroon/20 bg-cream p-3 md:hidden">
      <Link to="/reservations" className="btn-primary w-full">
        Reserve a table
      </Link>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <StickyReserve />
    </>
  );
}
