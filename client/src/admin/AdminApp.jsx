import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Seo from '../components/Seo.jsx';
import { Loading } from '../components/States.jsx';
import { MarigoldMark } from '../components/Pattern.jsx';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import AdminMenu from './AdminMenu.jsx';
import AdminEnquiries from './AdminEnquiries.jsx';

function Shell({ children }) {
  const { user, logout } = useAuth();
  const link = ({ isActive }) => `rounded px-4 py-2 text-sm font-semibold ${isActive ? 'bg-marigold text-maroon-dark' : 'text-cream hover:bg-white/10'}`;
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-maroon text-cream">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2.5">
            <MarigoldMark className="h-8 w-8" />
            <span className="font-display text-lg font-semibold">Marigold Admin</span>
          </div>
          <nav className="flex flex-wrap items-center gap-1" aria-label="Admin">
            <NavLink to="/admin" end className={link}>Bookings</NavLink>
            <NavLink to="/admin/menu" className={link}>Menu</NavLink>
            <NavLink to="/admin/enquiries" className={link}>Enquiries</NavLink>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-cream/75 sm:inline">{user.email}</span>
            <a href="/" className="underline underline-offset-4 hover:text-marigold">View site</a>
            <button type="button" onClick={logout} className="rounded border border-cream/50 px-4 py-1.5 font-semibold hover:bg-cream hover:text-maroon">Sign out</button>
          </div>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}

export default function AdminApp() {
  const { user, checking } = useAuth();

  if (checking) return <Loading label="Checking your session" />;
  if (!user) {
    return (
      <>
        <Seo title="Staff login" noindex />
        <Login />
      </>
    );
  }

  return (
    <Shell>
      <Seo title="Admin" noindex />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  );
}
