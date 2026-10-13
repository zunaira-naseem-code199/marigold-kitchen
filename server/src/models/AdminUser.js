import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], default: 'admin' },
  },
  { timestamps: true }
);

adminUserSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

adminUserSchema.statics.hash = (plain) => bcrypt.hash(plain, 12);

export default mongoose.model('AdminUser', adminUserSchema);
