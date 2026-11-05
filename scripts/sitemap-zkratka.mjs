// Z Astro sitemapy udělá jediný /sitemap.xml.
// Astro sitemapu vždy rozdělí na sitemap-index.xml + sitemap-0.xml a do
// hlavičky každé stránky vloží odkaz na index. S 131 URL je dělení zbytečné,
// takže po buildu zůstane jen /sitemap.xml, odkazy v HTML se přepíšou
// a pomocné soubory se smažou.
import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
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

// Odkaz <link rel="sitemap" href="/sitemap-index.xml"> v hlavičkách.
let prepsano = 0;

function projdi(slozka) {
  for (const polozka of readdirSync(slozka)) {
    const cesta = join(slozka, polozka);
    if (statSync(cesta).isDirectory()) {
      projdi(cesta);
      continue;
    }
    if (!polozka.endsWith('.html')) continue;
    const html = readFileSync(cesta, 'utf8');
    if (!html.includes('/sitemap-index.xml')) continue;
    writeFileSync(cesta, html.replaceAll('/sitemap-index.xml', '/sitemap.xml'));
    prepsano += 1;
  }
}

projdi(dist);

console.log(`sitemap.xml → ${cil} (index i dílčí soubor smazány, HTML upraveno: ${prepsano})`);
