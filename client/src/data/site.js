// Static site content. Keep opening hours in sync with server/src/config/restaurant.js.

export const site = {
  name: 'Marigold Kitchen',
  phone: '0113 496 0142',
  phoneHref: 'tel:+441134960142',
  email: 'hello@marigoldkitchen.co.uk',
  address: ['14 Call Lane', 'Leeds', 'LS1 7BT'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14+Call+Lane+Leeds+LS1+7BT',
  instagram: '@marigoldkitchenleeds',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
};

export const hours = [
  { day: 'Monday', time: 'Closed' },
  { day: 'Tuesday - Wednesday', time: '5pm - 10pm' },
  { day: 'Thursday', time: '5pm - 10:30pm' },
  { day: 'Friday', time: '5pm - 11pm' },
  { day: 'Saturday', time: 'Brunch 10am - 3pm, Dinner 5pm - 11pm' },
  { day: 'Sunday', time: '11am - 8pm' },
];

export const nav = [
  { to: '/menu', label: 'Menu' },
  { to: '/private-dining', label: 'Private Dining' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About & Contact' },
];

export const formatPrice = (n) => `£${Number(n).toFixed(2).replace(/\.00$/, '')}`;
