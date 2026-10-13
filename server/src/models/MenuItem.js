import mongoose from 'mongoose';
import { MENU_CATEGORIES, DIETARY_TAGS } from '../config/restaurant.js';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 400 },
    price: { type: Number, required: true, min: 0 }, // in GBP, e.g. 14.5
    category: { type: String, required: true, enum: MENU_CATEGORIES, index: true },
    dietaryTags: { type: [String], enum: DIETARY_TAGS, default: [] },
    spiceLevel: { type: Number, min: 0, max: 3, default: 0 }, // 0 = none, 3 = hot
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
