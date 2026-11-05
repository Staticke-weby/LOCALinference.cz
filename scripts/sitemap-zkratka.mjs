// Zkopíruje sitemap-0.xml na /sitemap.xml.
// Astro generuje sitemap-index.xml + sitemap-0.xml; lidé i Search Console
// ale hledají /sitemap.xml. Obsah je stejný seznam URL, jen kratší jméno.
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2];

if (!dist) {
  console.error('Použití: node scripts/sitemap-zkratka.mjs <dist>');
  process.exit(1);
}

const zdroj = join(dist, 'sitemap-0.xml');
const cil = join(dist, 'sitemap.xml');

if (!existsSync(zdroj)) {
  console.error(`Chybí ${zdroj} — sitemap se nevygenerovala.`);
  process.exit(1);
}

copyFileSync(zdroj, cil);
console.log(`sitemap.xml → ${cil}`);
