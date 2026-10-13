import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Seo from '../components/Seo.jsx';
import FoodImage from '../components/FoodImage.jsx';
import { PatternDivider } from '../components/Pattern.jsx';
import { SectionHeading } from '../components/States.jsx';
import { DietBadge, SpiceLevel } from '../components/DietIcons.jsx';
import { formatPrice } from '../data/site';

const fallbackFeatured = [
  { _id: 'f1', name: 'Butter Chicken', description: 'Tandoor-roasted chicken thigh in a velvety tomato and fenugreek butter sauce.', price: 18.5, dietaryTags: ['GF'], spiceLevel: 1 },
  { _id: 'f2', name: 'Slow-Braised Lamb Nihari', description: 'Twelve-hour shin of lamb, bone-marrow gravy, ginger and warm kulcha.', price: 22.5, dietaryTags: [], spiceLevel: 2 },
  { _id: 'f3', name: 'Saffron & Cardamom Kulfi', description: 'Dense, creamy kulfi with pistachio brittle and rose petals.', price: 8, dietaryTags: ['V', 'GF'], spiceLevel: 0 },
];

const instaTiles = ['Tandoor flames', 'Saffron rice', 'Chai pour', 'Dining room', 'Kulfi', 'Spice market'];

function Hero() {
  return (
    <section className="bg-maroon text-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12 md:items-end md:py-20">
        <div className="md:col-span-7">
          <p className="eyebrow mb-4 !text-marigold">Call Lane, Leeds</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] !text-cream sm:text-6xl">
            Regional South Asian cooking, over coals.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream/90">
            A tandoor, a short menu and Yorkshire produce. Dinner Tuesday to Sunday, brunch at the weekend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/reservations" className="btn-primary">Reserve a table</Link>
            <Link to="/menu" className="btn-light">View menu</Link>
          </div>
        </div>
        <div className="md:col-span-5">
          <FoodImage label="Photo: tandoor platter" seed="hero-plate" className="aspect-[4/3] w-full" />
        </div>
      </div>
      <PatternDivider className="text-marigold/70" />
    </section>
  );
}

function DishRow({ dish }) {
  return (
    <article className="flex items-start justify-between gap-4 border-b border-maroon/20 py-5 first:pt-0 last:border-0">
      <div>
        <h3 className="font-display text-xl font-semibold leading-snug">{dish.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-charcoal-soft">{dish.description}</p>
        <div className="mt-2 flex items-center gap-2">
          {dish.dietaryTags?.map((t) => <DietBadge key={t} tag={t} />)}
          <SpiceLevel level={dish.spiceLevel} />
        </div>
      </div>
      <p className="font-display text-lg font-semibold text-maroon">{formatPrice(dish.price)}</p>
    </article>
  );
}

function Featured() {
  const [dishes, setDishes] = useState(fallbackFeatured);
  useEffect(() => {
    api.menu('?featured=true').then((d) => { if (d.length) setDishes(d.slice(0, 3)); }).catch(() => {});
  }, []);
  const [lead, ...rest] = dishes;
  return (
    <section className="container-page py-16 md:py-20">
      <SectionHeading title="What people order first" />
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <FoodImage src={lead.image} alt="" label={lead.name} seed={lead.name} className="aspect-[16/10] w-full" />
          <div className="mt-5"><DishRow dish={lead} /></div>
        </div>
        <div className="md:col-span-5">
          {rest.map((d) => <DishRow key={d._id} dish={d} />)}
          <Link to="/menu" className="btn-secondary mt-6">See the full menu</Link>
        </div>
      </div>
    </section>
  );
}

function StoryTeaser() {
  return (
    <section className="bg-cream-dark py-16 md:py-20">
      <div className="container-page grid items-start gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <FoodImage label="Photo: Anika at the pass" seed="chef" className="aspect-[4/5] w-full" />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Anika Rao cooks what she grew up eating</h2>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-soft">
            Anika split her childhood between Hyderabad and Headingley. The menu follows that: nihari cooked overnight, kebabs off the coals, and suppliers she can call by their first names.
          </p>
          <Link to="/about" className="btn-maroon mt-7">About the kitchen</Link>
        </div>
      </div>
    </section>
  );
}

function Highlight() {
  return (
    <section className="bg-maroon-dark py-16 text-cream md:py-20">
      <div className="container-page grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow !text-marigold">Thursday to Sunday evenings</p>
          <h3 className="mt-3 font-display text-3xl font-semibold !text-cream">Tasting menu</h3>
          <p className="mt-4 leading-relaxed text-cream/85">Seven courses from Kerala to Lucknow, with an optional spiced-wine pairing.</p>
          <p className="mt-4 font-display text-2xl text-marigold">£58 <span className="text-base text-cream/80">per person, pairing +£32</span></p>
          <Link to="/reservations" className="btn-primary mt-6">Book the tasting menu</Link>
        </div>
        <div>
          <p className="eyebrow !text-marigold">Saturday 10am to 3pm, Sunday from 11am</p>
          <h3 className="mt-3 font-display text-3xl font-semibold !text-cream">Weekend brunch</h3>
          <p className="mt-4 leading-relaxed text-cream/85">Masala scrambled eggs, keema pav, stuffed parathas, chai refills. Add a spritz for £6.</p>
          <p className="mt-4 font-display text-2xl text-marigold">From £11 <span className="text-base text-cream/80">a dish</span></p>
          <Link to="/reservations" className="btn-light mt-6">Reserve brunch</Link>
        </div>
      </div>
    </section>
  );
}

const fallbackReviews = [
  { _id: 'r1', author: 'Hannah R.', rating: 5, text: 'The nihari was the best thing I ate all year. Staff made our anniversary feel special.', source: 'Google' },
  { _id: 'r2', author: 'James & Priya', rating: 5, text: 'Beautiful room, brilliant cocktails and a menu that respects tradition without being stuck in it.', source: 'Google' },
  { _id: 'r3', author: 'Oliver T.', rating: 5, text: 'Booked the upstairs room for 14 colleagues. Seamless from enquiry to dessert.', source: 'TripAdvisor' },
];

function Testimonials() {
  const [reviews, setReviews] = useState(fallbackReviews);
  useEffect(() => {
    api.reviews(true).then((r) => { if (r.length) setReviews(r.slice(0, 5)); }).catch(() => {});
  }, []);
  const [first, ...others] = reviews.slice(0, 3);
  return (
    <section className="container-page py-16 md:py-20">
      <SectionHeading title="From the guest book" />
      <div className="grid gap-10 md:grid-cols-12">
        <blockquote className="md:col-span-7">
          <p className="font-display text-2xl leading-snug text-charcoal sm:text-3xl">&ldquo;{first.text}&rdquo;</p>
          <footer className="mt-4 text-sm font-semibold text-maroon">{first.author}{first.source && <span className="font-normal text-charcoal-soft">, {first.source}</span>}</footer>
        </blockquote>
        <div className="space-y-6 md:col-span-5">
          {others.map((r) => (
            <blockquote key={r._id}>
              <p className="leading-relaxed text-charcoal">&ldquo;{r.text}&rdquo;</p>
              <footer className="mt-1 text-sm font-semibold text-maroon">{r.author}{r.source && <span className="font-normal text-charcoal-soft">, {r.source}</span>}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstaGrid() {
  return (
    <section className="bg-cream-dark py-14">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">@marigoldkitchenleeds</h2>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-maroon underline underline-offset-4">Follow on Instagram</a>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <FoodImage label={instaTiles[0]} seed="insta-0" className="col-span-2 row-span-2 aspect-square" />
          {instaTiles.slice(1, 5).map((t) => (
            <FoodImage key={t} label={t} seed={`insta-${t}`} className="aspect-square" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        description="Regional South Asian cooking over coals on Call Lane, Leeds. Tandoor and grill, tasting menu, weekend brunch and private dining."
        path="/"
      />
      <Hero />
      <Featured />
      <StoryTeaser />
      <Highlight />
      <Testimonials />
      <InstaGrid />
    </>
  );
}
