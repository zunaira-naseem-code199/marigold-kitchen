import mongoose from 'mongoose';
import { EVENT_TYPES } from '../config/restaurant.js';

const eventEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 120, default: '' },
    eventType: { type: String, required: true, enum: EVENT_TYPES },
    guestCount: { type: Number, required: true, min: 1, max: 200 },
    date: { type: String, default: '' }, // preferred date, YYYY-MM-DD
    message: { type: String, trim: true, maxlength: 1500, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('EventEnquiry', eventEnquirySchema);
