import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <section className="container-page py-20">
      <Seo title="Page not found" noindex />
      <h1 className="font-display text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 max-w-md text-charcoal-soft">That address doesn't lead anywhere. Try the menu or head back to the start.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="btn-maroon">Home</Link>
        <Link to="/menu" className="btn-secondary">Menu</Link>
      </div>
    </section>
  );
}
