import { PatternDivider } from './Pattern.jsx';

// Left-aligned page header: headline on the left, one short line of intro on the right.
export default function PageHeader({ title, intro }) {
  return (
    <section className="bg-maroon text-cream">
      <div className="container-page grid gap-6 py-12 md:grid-cols-12 md:items-end md:py-16">
        <h1 className="font-display text-5xl font-semibold leading-[1.05] !text-cream sm:text-6xl md:col-span-7">{title}</h1>
        {intro && <p className="max-w-md text-lg leading-relaxed text-cream/85 md:col-span-5">{intro}</p>}
      </div>
      <PatternDivider className="text-marigold/70" />
    </section>
  );
}
