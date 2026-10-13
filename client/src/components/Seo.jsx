import { useEffect } from 'react';
import { site } from '../data/site';

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

// Lightweight head manager: title, description, canonical and Open Graph tags per page.
export default function Seo({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Modern South Asian Restaurant in Leeds`;
    const url = `${site.siteUrl.replace(/\/$/, '')}${path}`;
    document.title = fullTitle;
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
    }
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:url', url);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path, noindex]);
  return null;
}
