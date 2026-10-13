import { z } from 'zod';
import { MENU_CATEGORIES, DIETARY_TAGS, EVENT_TYPES, bookingRules } from '../config/restaurant.js';

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD');
const timeStr = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use the format HH:mm');
// Accepts UK style numbers with spaces, +, brackets or dashes.
const phone = z
  .string()
  .trim()
  .regex(/^[+()\d][\d\s()+-]{6,19}$/, 'Please enter a valid phone number');

export const reservationSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
  phone,
  date: dateStr,
  time: timeStr,
  partySize: z.coerce
    .number()
    .int()
    .min(1, 'Party size must be at least 1')
    .max(bookingRules.maxPartySizeOnline, `For parties over ${bookingRules.maxPartySizeOnline} please use our private dining enquiry`),
  notes: z.string().trim().max(600).optional().default(''),
});

export const availabilityQuery = z.object({ date: dateStr });

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(100),
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
  phone,
  company: z.string().trim().max(120).optional().default(''),
  eventType: z.enum(EVENT_TYPES, { errorMap: () => ({ message: 'Please choose an event type' }) }),
  guestCount: z.coerce.number().int().min(1, 'How many guests?').max(200),
  date: z.union([dateStr, z.literal('')]).optional().default(''),
  message: z.string().trim().max(1500).optional().default(''),
});

export const menuItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(400),
  price: z.coerce.number().min(0).max(1000),
  category: z.enum(MENU_CATEGORIES),
  dietaryTags: z.array(z.enum(DIETARY_TAGS)).default([]),
  spiceLevel: z.coerce.number().int().min(0).max(3).default(0),
  image: z.string().trim().max(500).optional().default(''),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
});

export const menuItemPatchSchema = menuItemSchema.partial();

export const statusSchema = z.object({ status: z.enum(['pending', 'confirmed', 'cancelled']) });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, 'Password is required'),
});
