import { Router } from 'express';

const router = Router();
const clientUrl = () => (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');

router.get('/sitemap.xml', (req, res) => {
  const pages = ['', '/menu', '/reservations', '/private-dining', '/gallery', '/about'];
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(
      (p) =>
        `  <url><loc>${clientUrl()}${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`
    )
    .join('\n');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${clientUrl()}/sitemap.xml\n`);
});

export default router;
