import { Router } from 'express';
import MenuItem from '../models/MenuItem.js';
import Reservation from '../models/Reservation.js';
import EventEnquiry from '../models/EventEnquiry.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { menuItemSchema, menuItemPatchSchema, statusSchema } from '../utils/schemas.js';
import { sendReservationStatus } from '../utils/mailer.js';
import { todayInLeeds } from '../utils/availability.js';

const router = Router();
router.use(requireAuth);

/* ---------- Dashboard summary ---------- */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const today = todayInLeeds();
    const [todayBookings, pending, newEnquiries, unavailable] = await Promise.all([
      Reservation.find({ date: today, status: { $ne: 'cancelled' } }).lean(),
      Reservation.countDocuments({ status: 'pending', date: { $gte: today } }),
      EventEnquiry.countDocuments({ status: 'new' }),
      MenuItem.countDocuments({ isAvailable: false }),
    ]);
    res.json({
      today,
      bookingsToday: todayBookings.length,
      coversToday: todayBookings.reduce((sum, r) => sum + r.partySize, 0),
      pending,
      newEnquiries,
      unavailableItems: unavailable,
    });
  })
);

/* ---------- Menu CRUD ---------- */
router.get(
  '/menu',
  asyncHandler(async (req, res) => {
    res.json(await MenuItem.find().sort({ category: 1, sortOrder: 1, name: 1 }).lean());
  })
);

router.post(
  '/menu',
  validate(menuItemSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json(await MenuItem.create(req.body));
  })
);

router.put(
  '/menu/:id',
  validate(menuItemSchema),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json(item);
  })
);

// Partial update, e.g. { isAvailable: false } for the availability toggle
router.patch(
  '/menu/:id',
  validate(menuItemPatchSchema),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json(item);
  })
);

router.delete(
  '/menu/:id',
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    return res.json({ message: 'Deleted' });
  })
);

/* ---------- Reservations ---------- */
// GET /api/admin/reservations?date=YYYY-MM-DD&status=pending&upcoming=true
router.get(
  '/reservations',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.date) filter.date = String(req.query.date);
    if (req.query.status) filter.status = String(req.query.status);
    if (req.query.upcoming === 'true') filter.date = { $gte: todayInLeeds() };
    const items = await Reservation.find(filter).sort({ date: 1, time: 1 }).limit(300).lean();
    res.json(items);
  })
);

router.patch(
  '/reservations/:id/status',
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    const changed = reservation.status !== req.body.status;
    reservation.status = req.body.status;
    await reservation.save();
    if (changed && ['confirmed', 'cancelled'].includes(reservation.status)) sendReservationStatus(reservation);
    res.json(reservation);
  })
);

/* ---------- Enquiries ---------- */
router.get(
  '/enquiries',
  asyncHandler(async (req, res) => {
    res.json(await EventEnquiry.find().sort({ createdAt: -1 }).limit(200).lean());
  })
);

router.patch(
  '/enquiries/:id',
  asyncHandler(async (req, res) => {
    const status = req.body?.status;
    if (!['new', 'contacted', 'closed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const enquiry = await EventEnquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    return res.json(enquiry);
  })
);

export default router;
