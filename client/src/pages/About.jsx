import Seo from '../components/Seo.jsx';
import FoodImage from '../components/FoodImage.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { site, hours } from '../data/site';

export default function About() {
  return (
    <>
      <Seo title="About & Contact" description="Meet Chef Anika Rao, see our opening hours, and find directions and parking for Marigold Kitchen on Call Lane, Leeds." path="/about" />

      <PageHeader title="About the kitchen" intro="Who cooks, when we open and how to find us." />

      <section className="container-page grid items-start gap-12 py-16 md:grid-cols-2">
        <FoodImage label="Photography: Chef Anika Rao" seed="chef-portrait" className="aspect-[4/5]" />
        <div>
          <h2 className="font-display text-3xl font-semibold">Anika Rao</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-charcoal-soft">
            <p>Anika learned to cook at her grandmother's side in Hyderabad, where dinner was never rushed and the spice box was a family heirloom. She moved to Leeds at nineteen, trained in some of the city's best kitchens, and spent a decade refining the idea behind Marigold.</p>
            <p>The idea is simple: honour regional recipes, cook over real fire, and buy from people she can shake hands with. Lamb comes from the Dales, duck from the Vale of York, and the spices are ground in-house every Monday, our one quiet day.</p>
          </div>
        </div>
      </section>

      <section className="bg-cream-dark py-16">
        <div className="container-page grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl font-semibold">Opening hours</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {hours.map((h) => (
                <div key={h.day} className="flex flex-col border-b border-dashed border-maroon/20 pb-2">
                  <dt className="font-semibold">{h.day}</dt>
                  <dd className="text-charcoal-soft">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-charcoal-soft">Last seatings are 90 minutes before closing.</p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
            <address className="mt-4 text-sm not-italic leading-relaxed text-charcoal-soft">
              {site.address.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="mt-4 text-sm"><a className="font-semibold text-maroon underline underline-offset-4" href={site.phoneHref}>{site.phone}</a></p>
            <p className="mt-1 text-sm"><a className="font-semibold text-maroon underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a></p>
            <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="btn-maroon mt-6 w-full">Open in Google Maps</a>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold">Getting here</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal-soft">
              <li><strong className="text-charcoal">On foot:</strong> 6 minutes from Leeds station via Bishopgate Street.</li>
              <li><strong className="text-charcoal">Parking:</strong> Q-Park Trinity (3 minutes' walk) and the NCP on Lower Basinghall Street. Evening rates apply after 6pm.</li>
              <li><strong className="text-charcoal">Accessibility:</strong> Step-free entrance and an accessible toilet on the ground floor. The Saffron Room has a lift.</li>
              <li><strong className="text-charcoal">Taxis:</strong> Drop-off is on Call Lane directly outside.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="overflow-hidden border border-maroon/20">
          <iframe
            title="Map showing Marigold Kitchen on Call Lane, Leeds"
            className="h-[360px] w-full"
            loading="lazy"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-1.5490%2C53.7920%2C-1.5330%2C53.7990&layer=mapnik&marker=53.7955%2C-1.5410"
          />
        </div>
        <p className="mt-3 text-xs text-charcoal-soft">Map data © OpenStreetMap contributors</p>
      </section>
    </>
  );
}
