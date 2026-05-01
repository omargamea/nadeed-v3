// src/pages/sitemap.xml.ts
// Sitemap توليد ديناميكي بدون مكتبة خارجية
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? '').replace(/\/$/, '');

  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', freq: 'weekly' },
    { url: '/articles/', priority: '0.9', freq: 'weekly' },
    { url: '/books/',    priority: '0.9', freq: 'weekly' },
    { url: '/magazine/', priority: '0.8', freq: 'monthly' },
    { url: '/authors/',  priority: '0.7', freq: 'monthly' },
    { url: '/about/',    priority: '0.6', freq: 'yearly' },
    { url: '/shuroot/',  priority: '0.6', freq: 'yearly' },
    { url: '/contact/',  priority: '0.5', freq: 'yearly' },
  ];

  // Dynamic pages
  const articles = await getCollection('articles', e => !e.data.draft);
  const books    = await getCollection('books',    e => !e.data.draft);
  const authors  = await getCollection('authors',  e => !e.data.draft);
  const magazine = await getCollection('magazine', e => !e.data.draft);

  const today = new Date().toISOString().split('T')[0];

  const rows: string[] = [];

  // Static
  for (const p of staticPages) {
    rows.push(`  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
  }

  // Articles
  for (const a of articles) {
    const lastmod = (a.data.updatedAt ?? a.data.publishedAt).toISOString().split('T')[0];
    rows.push(`  <url>
    <loc>${base}/articles/${a.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // Books
  for (const b of books) {
    rows.push(`  <url>
    <loc>${base}/books/${b.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // Authors
  for (const au of authors) {
    rows.push(`  <url>
    <loc>${base}/authors/${au.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // Magazine
  for (const m of magazine) {
    const lastmod = m.data.publishedAt.toISOString().split('T')[0];
    rows.push(`  <url>
    <loc>${base}/magazine/${m.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
