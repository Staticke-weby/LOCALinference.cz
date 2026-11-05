import type { APIRoute } from 'astro';
import { getZmeny } from '../../../lib/data';

const SITE = 'https://www.localinference.cz';

function esc(v: string): string {
  return v
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = () => {
  const zmeny = getZmeny().slice(0, 40);
  const items = zmeny
    .map((z) => {
      const datum = z.datum instanceof Date ? z.datum.toISOString() : String(z.datum);
      const popis = esc(z.co_se_zmenilo);
      const url = `${SITE}/zdroje/novinky/#${datum.slice(0, 10)}`;
      return `    <item>
      <title>${esc(z.titulek)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(datum).toUTCString()}</pubDate>
      <description>${popis}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LOCALinference — novinky</title>
    <link>${SITE}/zdroje/novinky/</link>
    <description>Co se změnilo na webu LOCALinference: ceny, měření, modely a zdroje.</description>
    <language>cs</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
