import Reservation from '../models/Reservation.js';
import { openingHours, bookingRules } from '../config/restaurant.js';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toHHMM = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

// Parse YYYY-MM-DD as a calendar date without timezone surprises.
export function parseDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return dt;
}

// Today's date in the restaurant's timezone (UK).
export function todayInLeeds() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
}

export function nowMinutesInLeeds() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24;
  const m = Number(parts.find((p) => p.type === 'minute').value);
  return h * 60 + m;
}

// Why a date can't be booked, or null if it is open.
export function closedReason(dateStr) {
  const dt = parseDate(dateStr);
  if (!dt) return 'Invalid date';
  const today = todayInLeeds();
  if (dateStr < today) return 'That date has already passed';
  const diffDays = Math.round((dt - parseDate(today)) / 86400000);
  if (diffDays > bookingRules.maxAdvanceDays) {
    return `Bookings open up to ${bookingRules.maxAdvanceDays} days in advance`;
  }
  if (bookingRules.blockedDates.includes(dateStr)) return 'We are closed on this date';
  const windows = openingHours[dt.getUTCDay()] || [];
  if (windows.length === 0) return 'We are closed on this day';
  return null;
}

// All bookable times for a date (ignores existing bookings).
export function baseSlots(dateStr) {
  const dt = parseDate(dateStr);
  if (!dt) return [];
  const windows = openingHours[dt.getUTCDay()] || [];
  const slots = [];
  for (const w of windows) {
    const start = toMinutes(w.open);
    const last = toMinutes(w.close) - bookingRules.lastSeatingBeforeClose;
    for (let t = start; t <= last; t += bookingRules.slotMinutes) slots.push(toHHMM(t));
  }
  return slots;
}

// Slots with remaining covers for a date.
export async function getAvailability(dateStr) {
  const reason = closedReason(dateStr);
  if (reason) return { date: dateStr, closed: true, reason, slots: [] };

  const booked = await Reservation.aggregate([
    { $match: { date: dateStr, status: { $ne: 'cancelled' } } },
    { $group: { _id: '$time', covers: { $sum: '$partySize' } } },
  ]);
  const usedByTime = Object.fromEntries(booked.map((b) => [b._id, b.covers]));

  const isToday = dateStr === todayInLeeds();
  const nowMins = nowMinutesInLeeds();

  const slots = baseSlots(dateStr)
    .filter((time) => !isToday || toMinutes(time) > nowMins + 30)
    .map((time) => {
      const remaining = Math.max(bookingRules.maxCoversPerSlot - (usedByTime[time] || 0), 0);
      return { time, remaining };
    });

  return { date: dateStr, closed: false, slots };
}

// Throws a 409/400 style error if the booking can't be accepted.
export async function assertCanBook({ date, time, partySize }) {
  const availability = await getAvailability(date);
  if (availability.closed) {
    const err = new Error(availability.reason);
    err.status = 400;
    throw err;
  }
  const slot = availability.slots.find((s) => s.time === time);
  if (!slot) {
    const err = new Error('That time is not available. Please choose another slot.');
    err.status = 400;
    throw err;
  }
  if (slot.remaining < partySize) {
    const err = new Error(
      slot.remaining > 0
        ? `Sorry, only ${slot.remaining} seat${slot.remaining === 1 ? '' : 's'} left at ${time}. Try another time.`
        : `Sorry, ${time} is fully booked. Please choose another time.`
    );
    err.status = 409;
    throw err;
  }
}
