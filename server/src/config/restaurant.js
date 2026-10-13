// Central place for restaurant details and booking rules.
// Change opening hours, closed days and capacity here (or via .env).

export const restaurant = {
  name: 'Marigold Kitchen',
  tagline: 'Modern South Asian dining in the heart of Leeds',
  address: {
    street: '14 Call Lane',
    city: 'Leeds',
    postcode: 'LS1 7BT',
    country: 'GB',
  },
  phone: '0113 496 0142',
  email: process.env.RESTAURANT_EMAIL || 'hello@marigoldkitchen.co.uk',
  geo: { lat: 53.7955, lng: -1.5410 },
  priceRange: '££-£££',
};

// Day index: 0 = Sunday ... 6 = Saturday.
// Each day has one or more service windows. The last seating is `lastSeatingBeforeClose` minutes before close.
export const openingHours = {
  0: [{ open: '11:00', close: '20:00' }], // Sunday
  1: [], // Monday – closed
  2: [{ open: '17:00', close: '22:00' }],
  3: [{ open: '17:00', close: '22:00' }],
  4: [{ open: '17:00', close: '22:30' }],
  5: [{ open: '17:00', close: '23:00' }],
  6: [
    { open: '10:00', close: '15:00' }, // Saturday brunch
    { open: '17:00', close: '23:00' }, // Saturday dinner
  ],
};

export const bookingRules = {
  slotMinutes: 30,
  lastSeatingBeforeClose: 90,
  maxCoversPerSlot: Number(process.env.MAX_COVERS_PER_SLOT) || 40,
  maxPartySizeOnline: 8, // larger groups must send a private dining enquiry
  maxAdvanceDays: 90,
  blockedDates: (process.env.BLOCKED_DATES || '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean),
};

export const MENU_CATEGORIES = ['Starters', 'Mains', 'Tandoor & Grill', 'Desserts', 'Drinks'];
export const DIETARY_TAGS = ['V', 'VG', 'GF'];
export const EVENT_TYPES = ['Birthday', 'Anniversary', 'Corporate dinner', 'Team celebration', 'Wedding party', 'Other'];
