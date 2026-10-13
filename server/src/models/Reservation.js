import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD (restaurant local date)
    time: { type: String, required: true }, // HH:mm
    partySize: { type: Number, required: true, min: 1, max: 40 },
    notes: { type: String, trim: true, maxlength: 600, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

reservationSchema.index({ date: 1, time: 1 });

// Human friendly booking reference such as MK-7Q3F2
reservationSchema.pre('validate', function (next) {
  if (!this.reference) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let ref = '';
    for (let i = 0; i < 5; i += 1) ref += chars[Math.floor(Math.random() * chars.length)];
    this.reference = `MK-${ref}`;
  }
  next();
});

export default mongoose.model('Reservation', reservationSchema);
