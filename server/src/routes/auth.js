import { Router } from 'express';
import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { loginSchema } from '../utils/schemas.js';

const router = Router();

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });
    // Same message for unknown email and wrong password.
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
    return res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  })
);

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, email: req.user.email, role: req.user.role } });
});

export default router;
