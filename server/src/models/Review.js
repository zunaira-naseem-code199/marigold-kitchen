import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 600 },
    source: { type: String, trim: true, default: '' }, // e.g. "Google", "Leeds Living"
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
