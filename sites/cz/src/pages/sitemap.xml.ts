import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://www.localinference.cz';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function isoDay(value: unknown): string | undefined {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return undefined;
  return value.toISOString().slice(0, 10);
}

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const lastmod = new Map<string, string>();

  for (const doc of docs) {
    if (doc.id === '404' || doc.id.endsWith('/404')) continue;
    const clean = doc.id.replace(/\/index$/, '');
    const path = clean === 'index' ? '' : `${clean}/`;
    const day = isoDay((doc.data as { last_verified?: unknown }).last_verified);
    if (day) lastmod.set(path, day);
    else if (!lastmod.has(path)) lastmod.set(path, '');
  }

  if (!lastmod.has('')) lastmod.set('', '');

  const urls = [...lastmod.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, day]) => {
      const loc = escapeXml(`${SITE}/${path}`);
      const mod = day ? `<lastmod>${day}</lastmod>` : '';
      return `  <url><loc>${loc}</loc>${mod}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
