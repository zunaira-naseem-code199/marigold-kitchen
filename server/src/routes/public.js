import { Router } from 'express';
import MenuItem from '../models/MenuItem.js';
import Reservation from '../models/Reservation.js';
import EventEnquiry from '../models/EventEnquiry.js';
import Review from '../models/Review.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { reservationSchema, availabilityQuery, enquirySchema } from '../utils/schemas.js';
import { getAvailability, assertCanBook } from '../utils/availability.js';
import { sendReservationReceived, sendEnquiryEmails } from '../utils/mailer.js';
import { restaurant, openingHours, bookingRules, MENU_CATEGORIES, EVENT_TYPES } from '../config/restaurant.js';

const router = Router();

// Restaurant info for the client (hours, address, rules)
router.get('/config', (req, res) => {
  res.json({ restaurant, openingHours, bookingRules: { ...bookingRules, blockedDates: undefined }, categories: MENU_CATEGORIES, eventTypes: EVENT_TYPES });
});

// GET /api/menu?category=Mains&tags=V,GF&featured=true
router.get(
  '/menu',
  asyncHandler(async (req, res) => {
    const filter = { isAvailable: true };
    if (req.query.category && MENU_CATEGORIES.includes(req.query.category)) filter.category = req.query.category;
    if (req.query.tags) {
      const tags = String(req.query.tags).split(',').filter(Boolean);
      if (tags.length) filter.dietaryTags = { $all: tags };
    }
    if (req.query.featured === 'true') filter.isFeatured = true;
    const items = await MenuItem.find(filter).sort({ category: 1, sortOrder: 1, name: 1 }).lean();
    res.json(items);
  })
);

// GET /api/reservations/availability?date=2026-10-17
router.get(
  '/reservations/availability',
  validate(availabilityQuery, 'query'),
  asyncHandler(async (req, res) => {
    res.json(await getAvailability(req.validated.query.date));
  })
);

router.post(
  '/reservations',
  validate(reservationSchema),
  asyncHandler(async (req, res) => {
    await assertCanBook(req.body);
    const reservation = await Reservation.create(req.body);
    // Fire and forget: a mail problem must not break the booking.
    sendReservationReceived(reservation);
    res.status(201).json({
      reference: reservation.reference,
      name: reservation.name,
      email: reservation.email,
      date: reservation.date,
      time: reservation.time,
      partySize: reservation.partySize,
      status: reservation.status,
      emailSent: Boolean(process.env.SMTP_HOST),
    });
  })
);

router.post(
  '/enquiries',
  validate(enquirySchema),
  asyncHandler(async (req, res) => {
    const enquiry = await EventEnquiry.create(req.body);
    sendEnquiryEmails(enquiry);
    res.status(201).json({ id: enquiry._id, message: 'Enquiry received' });
  })
);

// GET /api/reviews?featured=true
router.get(
  '/reviews',
  asyncHandler(async (req, res) => {
    const filter = req.query.featured === 'true' ? { isFeatured: true } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).limit(20).lean();
    res.json(reviews);
  })
);

export default router;