// Z jednoho sitemap-index.xml + sitemap-0.xml udělá jediný /sitemap.xml.
// Astro sitemapu vždy rozdělí na index a dílčí soubor; s 131 URL to není
// potřeba. Search Console i lidé hledají /sitemap.xml, takže po buildu
// zůstane jen ten a pomocné soubory se smažou.
import { copyFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2];

if (!dist) {
  console.error('Použití: node scripts/sitemap-zkratka.mjs <dist>');
  process.exit(1);
}

const dilci = join(dist, 'sitemap-0.xml');
const index = join(dist, 'sitemap-index.xml');
const cil = join(dist, 'sitemap.xml');

if (!existsSync(dilci)) {
  console.error(`Chybí ${dilci} — sitemap se nevygenerovala.`);
  process.exit(1);
}

copyFileSync(dilci, cil);
rmSync(dilci);
if (existsSync(index)) rmSync(index);

console.log(`sitemap.xml → ${cil} (index i dílčí soubor smazány)`);
