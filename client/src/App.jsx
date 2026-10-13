import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { Loading } from './components/States.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Reservations from './pages/Reservations.jsx';
import PrivateDining from './pages/PrivateDining.jsx';
import Gallery from './pages/Gallery.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

// The admin area is code-split so public visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="private-dining" element={<PrivateDining />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<Loading label="Loading dashboard" />}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
