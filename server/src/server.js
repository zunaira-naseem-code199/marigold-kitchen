import 'dotenv/config';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

const port = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing. Copy .env.example to .env first.');
    process.exit(1);
  }
  await connectDB();
  createApp().listen(port, () => console.log(`API running on http://localhost:${port}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
