import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import seoRoutes from './routes/seo.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

  // Basic abuse protection on endpoints that send email or accept passwords
  const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 40, standardHeaders: true, legacyHeaders: false });
  const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

  app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

  app.use('/api/auth/login', loginLimiter);
  app.post('/api/reservations', formLimiter);
  app.post('/api/enquiries', formLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', publicRoutes);
  app.use('/', seoRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
