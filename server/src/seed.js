import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import MenuItem from './models/MenuItem.js';
import Review from './models/Review.js';
import AdminUser from './models/AdminUser.js';
import Reservation from './models/Reservation.js';
import EventEnquiry from './models/EventEnquiry.js';
import { todayInLeeds } from './utils/availability.js';

// [name, description, price, category, dietaryTags, spiceLevel, isFeatured]
const menu = [
  // ---- Starters ----
  ['Smoked Aubergine Chaat', 'Charred aubergine, tamarind glaze, pomegranate, crisp sev and mint yoghurt.', 8.5, 'Starters', ['V', 'GF'], 1, false],
  ['Crispy Squid Koliwada', 'Lightly spiced gram-flour squid, curry-leaf salt and a lime and green chilli mayo.', 10.5, 'Starters', [], 2, false],
  ['Lamb Seekh Croquettes', 'Slow-cooked lamb, coriander and ginger in a golden crumb, with burnt-onion chutney.', 11, 'Starters', [], 2, false],
  ['Paneer Tikka Bao', 'Soft steamed bao, tandoori paneer, pickled red onion and green chutney.', 9.5, 'Starters', ['V'], 1, false],
  ['Heritage Beetroot Tikki', 'Spiced beetroot and potato patties, cashew cream and fennel pickle.', 8, 'Starters', ['VG', 'GF'], 1, false],
  ['Masala Papad Basket', 'Fresh papads with three chutneys: mango, mint and smoked tomato.', 5.5, 'Starters', ['VG', 'GF'], 1, false],
  // ---- Mains ----
  ['Butter Chicken, Our Way', 'Tandoor-roasted chicken thigh in a velvety tomato and fenugreek butter sauce.', 18.5, 'Mains', ['GF'], 1, true],
  ['Slow-Braised Lamb Nihari', 'Twelve-hour shin of lamb, bone-marrow gravy, ginger julienne and warm kulcha.', 22.5, 'Mains', [], 2, true],
  ['Keralan Prawn Moilee', 'King prawns in coconut milk, green chilli, curry leaf and a squeeze of lime.', 23, 'Mains', ['GF'], 2, false],
  ['Dal Makhani', 'Black lentils simmered overnight with butter and cream, finished with smoked chilli.', 14, 'Mains', ['V', 'GF'], 1, false],
  ['Wild Mushroom and Chestnut Korma', 'Cashew and saffron sauce, roasted chestnuts, crispy shallots.', 15.5, 'Mains', ['VG', 'GF'], 0, false],
  ['Yorkshire Duck Vindaloo', 'Confit duck leg in a Goan vindaloo, pickled shallots and saffron rice.', 24, 'Mains', ['GF'], 3, false],
  ['Hyderabadi Chicken Dum Biryani', 'Sealed-pot basmati, saffron, fried onions and cooling mint raita.', 19, 'Mains', ['GF'], 2, false],
  ['Saag Paneer', 'Spinach and fenugreek with house-made paneer and a swirl of cream.', 14.5, 'Mains', ['V', 'GF'], 0, false],
  // ---- Tandoor and Grill ----
  ['Tandoori Cauliflower Steak', 'Whole-roasted cauliflower, kasundi marinade, almond and raisin chutney.', 15, 'Tandoor & Grill', ['VG', 'GF'], 2, false],
  ['Chilli Chicken Tikka', 'Free-range chicken thigh, Kashmiri chilli and yoghurt marinade, charred over coals.', 17, 'Tandoor & Grill', ['GF'], 2, true],
  ['Lamb Chops Mint & Pepper', 'Four Yorkshire lamb cutlets, black pepper rub, mint chutney.', 26, 'Tandoor & Grill', ['GF'], 2, false],
  ['Tandoori Sea Bream', 'Whole fillet, ajwain and lemon marinade, charred lime and kachumber salad.', 24.5, 'Tandoor & Grill', ['GF'], 1, false],
  ['Garlic & Coriander Naan', 'Baked to order in the tandoor, brushed with garlic butter.', 4.5, 'Tandoor & Grill', ['V'], 0, false],
  // ---- Desserts ----
  ['Saffron & Cardamom Kulfi', 'Dense, creamy kulfi with pistachio brittle and rose petals.', 8, 'Desserts', ['V', 'GF'], 0, true],
  ['Gulab Jamun Sticky Toffee Pudding', 'Warm date sponge, cardamom toffee sauce and vanilla ice cream.', 8.5, 'Desserts', ['V'], 0, false],
  ['Mango & Passion Fruit Shrikhand', 'Strained yoghurt, Alphonso mango, toasted coconut.', 7.5, 'Desserts', ['V', 'GF'], 0, false],
  ['Dark Chocolate & Chai Pot', 'Silky chocolate pot infused with masala chai, salted caramel shards.', 8, 'Desserts', ['V', 'GF'], 0, false],
  // ---- Drinks ----
  ['Marigold Spritz', 'Prosecco, saffron syrup, orange bitters and soda.', 10.5, 'Drinks', ['VG', 'GF'], 0, false],
  ['Smoked Tamarind Old Fashioned', 'Bourbon, tamarind, jaggery and chocolate bitters.', 12, 'Drinks', ['VG', 'GF'], 0, false],
  ['Mango Lassi', 'Alphonso mango, yoghurt, a pinch of cardamom.', 5.5, 'Drinks', ['V', 'GF'], 0, false],
  ['Masala Chai', 'Assam, ginger, green cardamom and whole milk.', 3.8, 'Drinks', ['V', 'GF'], 0, false],
  ['Kokum & Lime Cooler', 'Sparkling kokum, fresh lime, mint. Alcohol-free.', 4.5, 'Drinks', ['VG', 'GF'], 0, false],
  ['Leeds Brewed IPA (330ml)', 'Citrus-forward local pale ale that stands up to the spice.', 5.8, 'Drinks', ['VG'], 0, false],
];

const reviews = [
  ['Hannah R.', 5, 'The nihari was the best thing I ate all year. Staff made our anniversary feel properly special.', 'Google', true],
  ['James & Priya', 5, 'Beautiful room, brilliant cocktails and a menu that respects tradition without being stuck in it.', 'Google', true],
  ['Oliver T.', 5, 'Booked the upstairs room for 14 colleagues. Seamless from enquiry to dessert, and the set menu was a hit.', 'TripAdvisor', true],
  ['Sana K.', 4, 'Weekend brunch is a joy. The masala scramble and chai are worth the trip alone.', 'Google', true],
  ['Marcus L.', 5, 'Finally a South Asian restaurant in Leeds that feels like a night out. Vegan options were genuinely exciting.', 'Instagram', true],
  ['Emily W.', 4, 'Lovely atmosphere, generous portions, and the kulfi is outstanding.', 'Google', false],
];

async function seed() {
  await connectDB();

  await Promise.all([MenuItem.deleteMany({}), Review.deleteMany({}), Reservation.deleteMany({}), EventEnquiry.deleteMany({})]);

  const sortCounter = {};
  await MenuItem.insertMany(
    menu.map(([name, description, price, category, dietaryTags, spiceLevel, isFeatured]) => {
      sortCounter[category] = (sortCounter[category] || 0) + 1;
      return { name, description, price, category, dietaryTags, spiceLevel, isFeatured, isAvailable: true, sortOrder: sortCounter[category] };
    })
  );

  await Review.insertMany(reviews.map(([author, rating, text, source, isFeatured]) => ({ author, rating, text, source, isFeatured })));

  // Admin user (created once, password refreshed on every seed)
  const email = (process.env.ADMIN_EMAIL || 'admin@marigoldkitchen.co.uk').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  await AdminUser.findOneAndUpdate(
    { email },
    { email, passwordHash: await AdminUser.hash(password), role: 'admin' },
    { upsert: true, new: true }
  );

  // A few sample bookings so the dashboard is not empty. Dates are generated from today.
  const today = todayInLeeds();
  await Reservation.insertMany([
    { name: 'Amelia Hart', email: 'amelia@example.com', phone: '07700 900111', date: today, time: '18:00', partySize: 2, notes: 'Anniversary, window table if possible', status: 'confirmed' },
    { name: 'Daniel Okafor', email: 'daniel@example.com', phone: '07700 900222', date: today, time: '19:30', partySize: 4, notes: 'One guest is vegan', status: 'pending' },
    { name: 'Sophie Bennett', email: 'sophie@example.com', phone: '07700 900333', date: today, time: '20:00', partySize: 6, notes: '', status: 'pending' },
  ]);

  await EventEnquiry.create({
    name: 'Rachel Moore',
    email: 'rachel@northgate-legal.example',
    phone: '0113 496 0999',
    company: 'Northgate Legal LLP',
    eventType: 'Corporate dinner',
    guestCount: 18,
    message: 'Looking for a Thursday evening in November for a client dinner, set menu with vegetarian options.',
  });

  console.log(`Seeded ${menu.length} menu items, ${reviews.length} reviews, 3 bookings, 1 enquiry.`);
  console.log(`Admin login -> ${email} / ${password}`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
